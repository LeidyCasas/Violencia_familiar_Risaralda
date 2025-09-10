# Proyecto Violencia Intrafamiliar en Risaralda

### Presentado por:
    Laura Garcia
    Daniel Medina

Este proyecto es un **sitio web informativo e interactivo** sobre la violencia intrafamiliar en el departamento de Risaralda, Colombia.  
Su objetivo es **sensibilizar, informar y facilitar el acceso a recursos de apoyo para víctimas**, además de **mostrar datos estadísticos** de forma clara y accesible.

---

## 🎯 Objetivo
Transformar un archivo CSV con miles de filas (casos de violencia intrafamiliar entregado por la Policía Nacional) en una **plataforma visual e intuitiva** que cualquier persona pueda entender y consultar.

---

## 📂 Estructura del Proyecto
- **Archivos `.html`** → La estructura de las páginas (inicio, reportes, contacto).
- **Archivos `.css`** → Los estilos y diseño responsivo.
- **Archivos `.js`** → La lógica de filtros, validaciones y visualización de gráficos.
- **Archivo `.csv`** → Fuente de datos crudos (simulado, pero preparado para integrarse con una API real).

---

## 🌐 Páginas Principales
- **`index.html`** → Introducción al problema, estadísticas clave y fuentes de datos (Datos Abiertos de Colombia).
- **`reporte.html`** → Reporte estadístico con filtros por año y municipio + gráficos interactivos con **Chart.js**.
- **`contacto.html`** → Información de líneas de ayuda, entidades oficiales y formulario de contacto.

---

## 📊 Visualización de Datos
- Gráficos creados con **Chart.js (CDN)**:  
  - Evolución anual de casos.  
  - Distribución por municipio.  
  - Tendencia mensual.  
- **Filtros interactivos**:
  - Selección dinámica de **año** y **municipio**.
  - Los filtros se generan automáticamente a partir de los datos CSV.


Ejemplo de lógica en `graficos.js`:
```javascript
fetch("datos.csv")
  .then(response => response.text())
  .then(csv => {
    const data = csvToArray(csv); // Convierte el CSV en objetos
    updateFilters(data);          // Llena dinámicamente los select
    renderCharts(data);           // Genera los gráficos con Chart.js
  });
