document.addEventListener('DOMContentLoaded', function() {
    // Datos simulados de la API de datos abiertos
    const datosAnuales = {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            label: 'Casos reportados',
            data: [285, 312, 275, 298, 327, 310],
            backgroundColor: 'rgba(142, 68, 173, 0.6)',
            borderColor: 'rgba(142, 68, 173, 1)',
            borderWidth: 1
        }]
    };

    const datosMunicipios = {
        labels: ['Pereira', 'Dosquebradas', 'Santa Rosa', 'La Virginia', 'Belén de Umbría'],
        datasets: [{
            label: 'Casos por municipio',
            data: [145, 78, 42, 25, 20],
            backgroundColor: [
                'rgba(142, 68, 173, 0.6)',
                'rgba(52, 152, 219, 0.6)',
                'rgba(46, 204, 113, 0.6)',
                'rgba(241, 196, 15, 0.6)',
                'rgba(231, 76, 60, 0.6)'
            ],
            borderWidth: 1
        }]
    };

    const datosMensuales = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
            label: 'Casos mensuales 2023',
            data: [28, 32, 26, 24, 29, 31, 35, 27, 25, 22, 20, 31],
            fill: false,
            backgroundColor: 'rgba(231, 76, 60, 0.6)',
            borderColor: 'rgba(231, 76, 60, 1)',
            tension: 0.1
        }]
    };

    // Crear gráficos
    const annualChart = new Chart(
        document.getElementById('annualChart'),
        {
            type: 'bar',
            data: datosAnuales,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Evolución anual de casos de violencia intrafamiliar'
                    }
                }
            }
        }
    );

    const municipioChart = new Chart(
        document.getElementById('municipioChart'),
        {
            type: 'pie',
            data: datosMunicipios,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Distribución de casos por municipio'
                    }
                }
            }
        }
    );

    const monthlyChart = new Chart(
        document.getElementById('monthlyChart'),
        {
            type: 'line',
            data: datosMensuales,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Tendencia mensual de casos en 2023'
                    }
                }
            }
        }
    );

    // Funcionalidad de filtros
    const yearSelect = document.getElementById('year-select');
    const municipioSelect = document.getElementById('municipio-select');

    if (yearSelect && municipioSelect) {
        yearSelect.addEventListener('change', actualizarGraficos);
        municipioSelect.addEventListener('change', actualizarGraficos);
    }

    function actualizarGraficos() {
        // En una implementación real, aquí se haría una nueva consulta a la API
        // con los parámetros seleccionados y se actualizarían los gráficos
        
        // Simulamos una carga con un pequeño delay
        document.querySelectorAll('.chart-container canvas').forEach(canvas => {
            canvas.style.opacity = '0.5';
        });
        
        setTimeout(() => {
            document.querySelectorAll('.chart-container canvas').forEach(canvas => {
                canvas.style.opacity = '1';
            });
            
            // Aquí se actualizarían los datos de los gráficos con la respuesta de la API
            alert(`Filtros aplicados: Año ${yearSelect.value}, Municipio ${municipioSelect.value}. En una implementación real, los gráficos se actualizarían con nuevos datos.`);
        }, 500);
    }
});