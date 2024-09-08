
---

## Descripción del Repositorio: Generador de Tabla de Amortización con PDF Descargable
-
Este repositorio presenta un generador de tabla de amortización interactivo que permite a los usuarios calcular cuotas mensuales, intereses acumulados, capital acumulado, y más. La aplicación está desarrollada utilizando HTML, CSS, y JavaScript, con la capacidad de generar un PDF descargable de los resultados.
---
### Características Principales

- **Cálculo de Amortización**: Permite a los usuarios ingresar detalles como el monto del préstamo, la tasa de interés y el plazo, y genera automáticamente una tabla detallada de amortización que muestra los pagos mensuales, el interés pagado, el capital pagado, y los saldos restantes.

- **Generación de PDF Personalizable**: Los usuarios pueden descargar la tabla de amortización generada en formato PDF con un diseño limpio y profesional. Incluye opciones para personalizar el PDF, como añadir la fecha de pago mensual.

- **Interfaz de Usuario Intuitiva**: Diseño limpio y responsivo que se adapta a diferentes dispositivos, asegurando una experiencia de usuario óptima tanto en computadoras de escritorio como en dispositivos móviles.

- **Componentes de Interacción Dinámica**: Uso de checkboxes y entradas de formulario que permiten a los usuarios personalizar los detalles antes de generar el PDF, con actualizaciones en tiempo real.

- **Estilos Modernos**: La aplicación utiliza la tipografía 'Roboto' y un esquema de color moderno para ofrecer una apariencia profesional. 

- **Funciones Adicionales en el PDF**: El PDF generado incluye encabezados con el nombre del documento, numeración de páginas, fecha actual, y advertencias personalizadas sobre los cálculos.
---
### Ejemplo de Cálculo de Intereses

El siguiente fragmento de código muestra cómo se calcula el interés mensual para cada cuota en la tabla de amortización:

```javascript
// Fórmula para calcular el interés de un mes
function calcularInteresMensual(saldo, tasaInteres) {
    return saldo * (tasaInteres / 100) / 12;
}

// Iteración para calcular los intereses y actualizar la tabla de amortización
function generarTablaAmortizacion(montoInicial, tasaInteres, plazoMeses) {
    let saldoRestante = montoInicial;
    for (let mes = 1; mes <= plazoMeses; mes++) {
        const interesMensual = calcularInteresMensual(saldoRestante, tasaInteres);
        const capitalAmortizado = cuotaMensual - interesMensual;
        saldoRestante -= capitalAmortizado;

        // Agregar la fila correspondiente a la tabla
        agregarFilaTabla(mes, capitalAmortizado, interesMensual, cuotaMensual, saldoRestante);
    }
}
```
---
### Tecnologías Utilizadas

- **HTML5 y CSS3**: Para la estructura y estilos de la interfaz de usuario.
- **JavaScript**: Para la lógica de cálculo de amortización, generación de PDF, y manejo de eventos dinámicos.
- **Librería jsPDF**: Para la creación y descarga de archivos PDF.

### Cómo Empezar

1. Clona el repositorio en tu máquina local.
2. Abre el archivo `index.html` en tu navegador.
3. Ingresa los detalles de la amortización y genera la tabla.
4. Personaliza los detalles de la descarga en PDF y presiona "Descargar Tabla PDF".

### Contribuciones

Las contribuciones son bienvenidas. Siéntete libre de abrir issues y pull requests para mejorar la funcionalidad o el diseño.

### Licencia

Este proyecto está bajo la licencia MIT. 

---

Este enfoque muestra el código clave para calcular los intereses, brindando a los desarrolladores una visión clara de la lógica de la aplicación.
