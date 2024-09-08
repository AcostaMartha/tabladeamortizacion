// Datos iniciales de amortización
var amortizacionData = {};

// Evento al botón de calcular
document.getElementById('calcular').addEventListener('click', function() {
    // Obtener los valores de entrada
    var monto = parseFloat(document.getElementById('monto').value);
    var tasaInteresAnual = parseFloat(document.getElementById('interes').value);
    var plazoMeses = parseInt(document.getElementById('plazo').value);

    // Validar que se ingresen valores válidos
    if (isNaN(monto) || isNaN(tasaInteresAnual) || isNaN(plazoMeses)) {
        alert('Por favor, ingrese valores válidos.');
        return;
    }

    // Verificar si es un retiro en efectivo
    var esRetiroEfectivo = document.getElementById('es-retiro-efectivo').checked;

    // Calcular la tasa de interés mensual
    var tasaInteresMensual = tasaInteresAnual / (100 * 12);

    // Calcular la cuota fija mensual utilizando la fórmula de amortización constante
    var cuotaFijaMensual = monto > 0 ? monto * (tasaInteresMensual / (1 - (1 / Math.pow((1 + tasaInteresMensual), plazoMeses)))) : 0;
    var totalaPagar = cuotaFijaMensual * plazoMeses; // Calcular el total a pagar
    var totalInteresapagar = totalaPagar - monto; // Calcular el total de intereses
    var totalInteresPromedio = totalInteresapagar / plazoMeses; // Calcular el interés promedio

    // Calcular la comisión de retiro si es un retiro en efectivo
    var comisionRetiro = esRetiroEfectivo ? monto * 0.0625 : 0;
    //totalaPagar += comisionRetiro; // Sumar la comisión al total a pagar

    // Almacenar datos para futuros cálculos
    amortizacionData = {
        monto: monto,
        tasaInteresMensual: tasaInteresMensual,
        plazoMeses: plazoMeses,
        cuotaFijaMensual: cuotaFijaMensual,
        totalInteresapagar: totalInteresapagar,
        comisionRetiro: comisionRetiro
    };

    // Mostrar la cuota mensual y otros resultados con formato de moneda
    document.getElementById('resultado-cuota').textContent = 'Cuota mensual: ' + cuotaFijaMensual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('resultado-totalapagar').textContent = 'Total a pagar: ' + totalaPagar.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('resultado-interesapagar').textContent = 'Total Interes a pagar: ' + totalInteresapagar.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('resultado-interespromedio').textContent = 'Interes promedio: ' + totalInteresPromedio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (esRetiroEfectivo) {
        document.getElementById('resultado-comision-retiro').textContent = 'Comisión de retiro: ' + comisionRetiro.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
        document.getElementById('resultado-comision-retiro').textContent = '';
    }


    // Generar la tabla de amortización
    generarTablaAmortizacion();

    // Mostrar los contenedores de resultados
    document.getElementById('resultados').style.display = 'block';
    // mostrar el campo para introducir fecha de pago
    document.getElementById('fecha-pago').style.display = 'block';
});



//Funcion para generar el resultado // Generar la tabla de amortización
function generarTablaAmortizacion() {
    var tabla = document.getElementById('tabla-amortizacion');
    var tbody = tabla.querySelector('tbody');
    tbody.innerHTML = ''; // Limpiar el cuerpo de la tabla

    var saldo = amortizacionData.monto;
    var capitalAcumulado = 0;
    var interesAcumulado = 0;
    var pagosAcumulados = 0;
    var interesTotalEsperado = 0;
    var interesPendiente = 0;

    var filas = '';

    // Calcula el total de intereses esperados
    for (var i = 1; i <= amortizacionData.plazoMeses; i++) {
        var interesMes = saldo * amortizacionData.tasaInteresMensual;
        interesTotalEsperado += interesMes;
        saldo -= (amortizacionData.cuotaFijaMensual - interesMes);
        if (saldo <= 0) break;
    }

    saldo = amortizacionData.monto; // Reinicia el saldo para la generación de la tabla
    interesPendiente = interesTotalEsperado; // Inicializa el interés pendiente con el total esperado

    for (var i = 1; i <= amortizacionData.plazoMeses; i++) {
        var interesMes = saldo * amortizacionData.tasaInteresMensual; // Calcular intereses del mes
        var capital = amortizacionData.cuotaFijaMensual - interesMes; // Calcular el capital pagado

        // Ajustar la última cuota si es necesario
        if (i === amortizacionData.plazoMeses && Math.abs(saldo - capital) > 0.01) {
            capital = saldo; // Ajustar el capital para no exceder el saldo
        }

        saldo -= capital; // Actualizar el saldo del principal
        capitalAcumulado += capital; // Acumular capital pagado
        interesAcumulado += interesMes; // Acumular interés pagado
        pagosAcumulados += amortizacionData.cuotaFijaMensual; // Acumular pagos totales

        // Calcular el balance de interés
        if (i === 1) {
            interesPendiente -= interesMes;
        } else if (saldo > 0) {
            interesPendiente -= interesMes;
            if (interesPendiente < 0) interesPendiente = 0; // Asegurarse de que no sea negativo
        } else {
            interesPendiente = 0; // Si el saldo es 0, el interés pendiente también debe ser 0
        }

        var fila = `<tr>
                        <td>${i}</td>
                        <td>${capital.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${interesMes.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${amortizacionData.cuotaFijaMensual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${saldo.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${interesPendiente.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${capitalAcumulado.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${interesAcumulado.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${pagosAcumulados.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>`;
        filas += fila;

        if (saldo === 0) {
            break; // Salir del bucle si el saldo se ha reducido a cero
        }
    }

    tbody.innerHTML = filas;

    // Mostrar el botón de descarga en PDF
    document.getElementById('descargar-pdf').style.display = 'block';
    // Mostrar los elementos de la tabla
    document.getElementById('tabla-amortizacion').style.display = 'block';

    // Agregar evento para actualizar resultados al marcar o desmarcar los checkboxes
    document.querySelectorAll('.pago-checkbox').forEach(function(checkbox) {
        checkbox.addEventListener('change', actualizarResultados);
    });
}

/// Funcion para mostrar el fecha de poago
document.addEventListener('DOMContentLoaded', function() {
    var checkboxIncluirFecha = document.getElementById('incluir-fecha');
    var incluirFechaDiv = document.getElementById('IncluirFecha');
    var diaDePagoInput = document.getElementById('dia-de-pago');

    checkboxIncluirFecha.addEventListener('change', function() {
        if (checkboxIncluirFecha.checked) {
            incluirFechaDiv.style.display = 'block'; // Muestra el div cuando el checkbox está marcado
        } else {
            incluirFechaDiv.style.display = 'none'; // Oculta el div cuando el checkbox no está marcado
        }
    });

    // Validación adicional para asegurar que el número ingresado esté dentro del rango permitido
    diaDePagoInput.addEventListener('input', function() {
        var value = parseInt(diaDePagoInput.value, 10);
        if (value < 1) {
            diaDePagoInput.value = 1; // Ajusta el valor al mínimo permitido
        } else if (value > 31) {
            diaDePagoInput.value = 31; // Ajusta el valor al máximo permitido
        }
    });
});



// Función para mostrar los resultados
function actualizarResultados() {
    var tabla = document.getElementById('tabla-amortizacion');
    if (!tabla) return; // Asegúrate de que la tabla exista

    var tbody = tabla.querySelector('tbody');
    if (!tbody) return; // Asegúrate de que tbody exista

    var filas = tbody.querySelectorAll('tr');
    var montoPagado = 0;
    var saldoRestante = amortizacionData ? amortizacionData.monto : 0; // Verifica la existencia de amortizacionData
    var interesAcumulado = 0;
    var capitalAcumulado = 0;
    var pagosAcumulados = 0;
    
    
    // Actualizar los resultados
    var resultados = {
        'resultado-monto-pagado': montoPagado,
        'resultado-saldo-restante': saldoRestante,
        'resultado-interes-acumulado': interesAcumulado,
        'resultado-capital-acumulado': capitalAcumulado,
        'resultado-pagos-acumulados': pagosAcumulados
    };
    
    for (var id in resultados) {
        var elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = id.replace('resultado-', '').replace(/-/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase() }) + ': ' + resultados[id].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }
}


// Evento al botón de reiniciar
document.getElementById('reiniciar').addEventListener('click', function() {
    // Limpiar campos de entrada
    document.getElementById('monto').value = '';
    document.getElementById('interes').value = '';
    document.getElementById('plazo').value = '';
    document.getElementById('es-retiro-efectivo').checked = false; // Limpiar checkbox
    document.getElementById('incluir-fecha').checked = false; // Limpiar checkbox

    // Limpiar resultados
    document.getElementById('resultado-cuota').textContent = '';
    document.getElementById('resultado-totalapagar').textContent = '';
    document.getElementById('resultado-interesapagar').textContent = '';
    document.getElementById('resultado-interespromedio').textContent = '';
    document.getElementById('resultado-comision-retiro').textContent = '';
    document.getElementById('dia-de-pago').value = '';

    // Limpiar la tabla de amortización
    var tabla = document.getElementById('tabla-amortizacion');
    if (tabla) {
        tabla.querySelector('tbody').innerHTML = '';
    }
    tabla.style.display = 'none'; // Ocultar tabla

    // Ocultar contenedores de resultados
    var resultados = document.getElementById('resultados');
    if (resultados) {
        resultados.style.display = 'none'; // Ocultar contenedor de resultados
    }
    
    // Ocultar el botón de descargar PDF
    var botonDescargar = document.getElementById('descargar-pdf');
    if (botonDescargar) {
        botonDescargar.style.display = 'none';
    }

    //ocultar formulario fecha de pago
    var fechaPago = document.getElementById('fecha-pago');
    if (fechaPago) {
        fechaPago.style.display = 'none';
    }
    document.getElementById('limpiar-boton').addEventListener('click', function() {
        document.getElementById('dia-de-pago').value = '';
    });
    
});

function toggleMenu() {
    var menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Funcion generar pdf
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('descargar-pdf').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

         // Añadir la fuente Roboto
         const robotoFont = 'data:font/ttf;base64,PASTE_YOUR_BASE64_ENCODED_FONT_HERE';
         doc.addFileToVFS('Roboto-Regular.ttf', robotoFont);
         doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

        // Función para añadir el nombre de la página en cada página
        function addPageName(doc) {
            const pageName = document.title; // Esto obtiene el título del documento HTML
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(12);
            doc.setTextColor(0, 128, 0); // Verde
            doc.text(pageName, pageWidth - doc.getTextWidth(pageName) - 14, 10);
        }

        // Obtener fecha actual
        function getCurrentDate() {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
            const year = today.getFullYear();
            return `${day}/${month}/${year}`;
        }

        // Agregar la fecha actual en la esquina inferior derecha
        function addFooter(doc) {
            const fechaActual = getCurrentDate();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.setFontSize(10);
            doc.setTextColor(128, 128, 128); // Gris
            doc.text(`Fecha: ${fechaActual}`, pageWidth - 50, pageHeight - 10); // Ajusta el ancho y alto según sea necesario
        }

        // Configuración inicial del PDF
        doc.setFontSize(16);
        doc.setTextColor(0, 110, 0); // Verde oscuro
        doc.text('Tabla de Amortización', 14, 10);

        // Obtener datos del formulario
        var montoInicial = document.getElementById('monto').value;
        var tasaInteres = parseFloat(document.getElementById('interes').value);
        var plazoMeses = parseInt(document.getElementById('plazo').value);
        var fechaPago = document.getElementById('dia-de-pago').value;

        // Configuración de texto
        doc.setFontSize(10); 
        doc.setTextColor(128, 128, 128); // Gris para los resultados

        // Agregar resultados al PDF
        doc.text(`Monto Inicial: ${parseFloat(montoInicial).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, 15);
        doc.text(`Tasa de Interés: ${tasaInteres.toFixed(2)}%`, 72, 15);
        doc.text(`Plazo: ${plazoMeses} meses`, 14, 42);

        // Añadir el día de pago al PDF en negrita
        if (fechaPago) {
            doc.setFont('helvetica', 'bold');
            doc.text(`Fecha de pago: ${fechaPago} de cada mes`, 72, 46);
            doc.setFont('helvetica', 'normal'); // Restablecer fuente
        } else {
            doc.text('', 14, 48);
        }

        // Agregar el resto de los resultados
        var cuotaMensual = document.getElementById('resultado-cuota').textContent;
        var totalPagar = document.getElementById('resultado-totalapagar').textContent;
        var totalInteres = document.getElementById('resultado-interesapagar').textContent;
        var interesPromedio = document.getElementById('resultado-interespromedio').textContent;
        var comisionRetiro = document.getElementById('resultado-comision-retiro').textContent;

        doc.text(cuotaMensual, 14, 22);
        doc.text(totalPagar, 14, 27);
        doc.text(totalInteres, 14, 31);
        doc.text(interesPromedio, 14, 35);
        doc.text(comisionRetiro, 14, 47);

        // Agregar tabla
        doc.setFontSize(8);
        var tabla = document.getElementById('tabla-amortizacion');
        var filas = [];

        var filasHtml = tabla.querySelectorAll('tbody tr');
        filasHtml.forEach(function(filaHtml) {
            var celdas = filaHtml.querySelectorAll('td');
            var fila = [];
            celdas.forEach(function(celda) {
                fila.push(celda.textContent.trim());
            });
            filas.push(fila);
        });

        var columnas = [
            'Mes',
            'Capital',
            'Interés',
            'Cuota Mensual',
            'Saldo',
            'Total Interés',
            'Capital Acumulado',
            'Interés Acumulado',
            'Pagos Acumulados'
        ];

        doc.autoTable({
            head: [columnas],
            body: filas,
            startY: 50,
            theme: 'grid',
            styles: { 
                fontSize: 8,
                cellPadding: 2,
                halign: 'center',
                valign: 'middle'
            },
            headStyles: {
                halign: 'center'
            },
            didDrawPage: function (data) {
                addPageName(doc);
                addFooter(doc); // Agregar fecha en cada página
            }
        });

        // Obtener la altura donde termina la tabla para colocar el texto de advertencia
        const finalY = doc.lastAutoTable.finalY || 60;

        // Agregar el texto de advertencia en rojo y tamaño 10
        doc.setFontSize(10);
        doc.setTextColor(128, 0, 0); // Rojo
        doc.text('Advertencia: Los cálculos presentados son aproximados y pueden variar según condiciones específicas.', 14, finalY + 10);

        // Guardar PDF
        doc.save('tabla_amortizacion.pdf');
    });
});

