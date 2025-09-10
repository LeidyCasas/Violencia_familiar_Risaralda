document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('year-select');
    const municipioSelect = document.getElementById('municipio-select');
    const generateBtn = document.getElementById('generate-report-btn');

    let chartData = [];
    let annualChart, municipioChart, monthlyChart;

    function csvToArray(csv) {
        const lines = csv.trim().split(/\r?\n/);
        if (lines.length < 2) return [];
        
        const headers = lines.shift().split(',').map(h => h.replace(/"/g, '').trim());
        
        return lines.filter(line => line.trim() !== '').map(line => {
            const values = line.split(',').map(v => v.replace(/"/g, '').trim());
            const obj = {};
            for (let i = 0; i < headers.length; i++) {
                obj[headers[i]] = values[i] || '';
            }
            return obj;
        });
    }
    
    function normalizeMunicipio(municipio) {
        return municipio.toLowerCase().replace(' (ct)', '').replace('á', 'a').replace('í', 'i');
    }

    async function loadData() {
        try {
            const response = await fetch('Vista_reporte_de_violencia_intrafamiliar_-_Risaralda_20250910.csv');
            const csvText = await response.text();
            chartData = csvToArray(csvText).map(row => {
                const dateParts = row['FECHA HECHO'].split('/');
                if (dateParts.length === 3) {
                    row.year = parseInt(dateParts[2], 10);
                    row.month = parseInt(dateParts[1], 10);
                }
                row.CANTIDAD = parseInt(row.CANTIDAD, 10) || 0;
                return row;
            });
            
            populateFilters();
            updateCharts(); // Initial chart generation
        } catch (error) {
            console.error('Error al cargar o procesar los datos:', error);
        }
    }

    function populateFilters() {
        const years = [...new Set(chartData.map(row => row.year).filter(Boolean))].sort((a, b) => b - a);
        const municipios = [...new Set(chartData.map(row => row.MUNICIPIO).filter(Boolean))];

        yearSelect.innerHTML = '';
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
        
        municipioSelect.innerHTML = '<option value="todos">Todos los municipios</option>';
        municipios.forEach(municipio => {
            const option = document.createElement('option');
            option.value = normalizeMunicipio(municipio);
            option.textContent = municipio;
            municipioSelect.appendChild(option);
        });

        if (generateBtn) {
            generateBtn.addEventListener('click', updateCharts);
        }
    }

    function updateCharts() {
        const selectedYear = parseInt(yearSelect.value, 10);
        const selectedMunicipio = municipioSelect.value;

        const filteredData = chartData.filter(row => {
            const yearMatch = !selectedYear || row.year === selectedYear;
            const municipioMatch = selectedMunicipio === 'todos' || normalizeMunicipio(row.MUNICIPIO) === selectedMunicipio;
            return yearMatch && municipioMatch;
        });

        updateAnnualChart(chartData, selectedMunicipio);
        updateMunicipioChart(selectedYear, selectedMunicipio);
        updateMonthlyChart(filteredData, selectedYear);
    }

    function updateAnnualChart(data, selectedMunicipio) {
        const annualData = data.filter(row => selectedMunicipio === 'todos' || normalizeMunicipio(row.MUNICIPIO) === selectedMunicipio)
                               .reduce((acc, row) => {
            if (row.year) {
                acc[row.year] = (acc[row.year] || 0) + row.CANTIDAD;
            }
            return acc;
        }, {});

        const labels = Object.keys(annualData).sort();
        const values = labels.map(year => annualData[year]);

        if (annualChart) annualChart.destroy();
        annualChart = new Chart(document.getElementById('annualChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Casos reportados',
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                }]
            }
        });
    }

    function updateMunicipioChart(year, selectedMunicipio) {
        const municipioChartTitle = document.querySelector('.chart-container h3:nth-of-type(2)');

        if (selectedMunicipio === 'todos') {
            const dataForYear = chartData.filter(row => row.year === year);
            const municipioData = dataForYear.reduce((acc, row) => {
                if (row.MUNICIPIO) {
                    acc[row.MUNICIPIO] = (acc[row.MUNICIPIO] || 0) + row.CANTIDAD;
                }
                return acc;
            }, {});

            const labels = Object.keys(municipioData);
            const values = Object.values(municipioData);

            if (municipioChart) municipioChart.destroy();
            municipioChart = new Chart(document.getElementById('municipioChart'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `Casos en ${year}`,
                        data: values,
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    }]
                },
                options: { indexAxis: 'y', responsive: true }
            });
            municipioChartTitle.textContent = `Distribución por municipio (${year})`;

        } else {
            const dataForFilter = chartData.filter(row => row.year === year && normalizeMunicipio(row.MUNICIPIO) === selectedMunicipio);
            const grupoEtarioData = dataForFilter.reduce((acc, row) => {
                const grupo = row['GRUPO ETARIO'] || 'No especificado';
                acc[grupo] = (acc[grupo] || 0) + row.CANTIDAD;
                return acc;
            }, {});

            const labels = Object.keys(grupoEtarioData);
            const values = Object.values(grupoEtarioData);

            if (municipioChart) municipioChart.destroy();
            municipioChart = new Chart(document.getElementById('municipioChart'), {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                        ],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    }
                }
            });
            const municipioName = municipioSelect.options[municipioSelect.selectedIndex].text;
            municipioChartTitle.textContent = `Distribución por grupo etario en ${municipioName} (${year})`;
        }
    }

    function updateMonthlyChart(data, year) {
        const monthlyData = data.reduce((acc, row) => {
            if (row.month) {
                acc[row.month] = (acc[row.month] || 0) + row.CANTIDAD;
            }
            return acc;
        }, {});

        const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const values = Array(12).fill(0);
        for (const month in monthlyData) {
            values[month - 1] = monthlyData[month];
        }

        if (monthlyChart) monthlyChart.destroy();
        monthlyChart = new Chart(document.getElementById('monthlyChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Casos en ${year}`,
                    data: values,
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                }]
            }
        });
        document.querySelector('.chart-container h3:nth-of-type(3)').textContent = `Tendencia mensual (${year})`;
    }

    loadData();
});
