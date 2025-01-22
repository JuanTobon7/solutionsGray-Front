<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4 text-center">Reporte Financiero de la Iglesia</h1>
    <p class="text-gray-600 mb-8 text-center">
      Este reporte presenta un resumen detallado de los ingresos totales, diezmos y ofrendas recibidos en la iglesia, desglosados por mes y año.
      Use los filtros para ajustar los datos y descargue los reportes en formato PDF o Excel para su análisis.
    </p>
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">      
      <div>
        <label for="date" class="mr-2">Seleccione un año:</label>
        <Calendar
          v-model="date" 
          view="year" 
          dateFormat="yy" 
          class="border border-gray-300 py-1 pl-2 rounded-md" 
        />
      </div>
      <button
        class="flex items-center gap-2 bg-second-500 hover:bg-second-600 px-4 py-2 text-white font-medium rounded-md shadow-md"
        @click="toggleDownloadReport"
      >
        Descargar Reporte
        <i class="material-symbols-outlined">file_download</i>
      </button>
    </div>
    <div  class="mb-8">
      <h2 class="text-xl font-semibold text-center mb-4">Ingresos Totales</h2>
      <canvas class="mb-4 min-h-[30vh] w-full" id="totalIncomeChart"></canvas>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="(chart, index) in charts"
        :key="index"
        class="chart-item"
      >
        <h3 class="chart-title">{{ chart.title }}</h3>
        <canvas :id="`chart-${index}`" class="flex items-center" style="max-width: 400px; max-height: 400px;"></canvas>        
      </div>
      <div>
            <h2 v-if="finish">Ingresos por Tipo de Culto</h2>
            <canvas class="flex items-center" style="max-width: 300px; max-height: 300px;" id="incomeByServiceChart"></canvas>
        </div>
    </div>
  </div>
  <ReportFinances v-if="downloadCtrl" :date="date" :tableData="tableData" />
</template>
    
<script>
  import Calendar from "primevue/calendar";
  import { Chart } from "chart.js";
  import ReportFinances from "@/components/Finances/ReportFinances.vue";
  import { format } from "date-fns";
  import { getFinances } from "@/apiServices";
    
  export default {
    components: {
      ReportFinances,
      Calendar,
    },
    watch: {
      date(){
        const date = this.date
        const selectedYear = new Date(date).getFullYear();
        const minDate = new Date(selectedYear, 0, 1, 0, 0, 0, 0);
        const maxDate = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const minDateFormat = format(minDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
        const maxDateFormat = format(maxDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
        this.getFinances({maxDateFormat, minDateFormat})
      }
    },
    data() {
      return {
        // Opciones de filtros
        date: null,
        finances: [],
        charts: [],
        tableData: [],
        downloadCtrl: false,
      };
    },
    mounted() {
      this.date = new Date()      
    },
    methods: {
      tableDataFun() {
        const finances = this.finances;

        // Agrupar por tipo de contribución y moneda
        const groupedData = finances.reduce((acc, { type_contribution, currency, amount }) => {
          const key = `${type_contribution}-${currency}`; // Clave única basada en tipo y moneda
          if (!acc[key]) {
            acc[key] = {
              type_contribution,
              currency,
              total: 0, // Inicializar el total
            };
          }
          acc[key].total += parseFloat(amount); // Acumular el monto
          return acc;
        }, {});

        // Convertir el objeto agrupado en un arreglo
        return Object.values(groupedData);
      },
      async getFinances(data){
        try{
          const result = await getFinances(data)
          this.finances = result         
          this.tableData = this.tableDataFun()
          this.finish = true
        }catch(e){
          if(e.response.status === 401 && e.response.data.message === "Token has expired"){
            this.$toast.add({severity: "error", summary: "Error", detail: "Ups algo ha pasado, intentalo de nuevo",life:3000});
          }
          this.finish = false

          this.finances = []
          this.tableData = []
        }finally{
          this.renderTotalIncomeChart();
          this.renderIncomeByServiceChart();
          this.generateChartsData()
          this.$nextTick(()=>{
            this.renderCharts()
          })
        }
      },
      renderTotalIncomeChart() {
        const canvas = document.getElementById("totalIncomeChart")
        if(!canvas){
          return
        }
        if(canvas.chartInstance){
          canvas.chartInstance.destroy()
        }
        const ctx = canvas.getContext("2d");

        // Lista de meses para el eje X
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        // Agrupar los datos por moneda y mes
        const groupedData = this.finances.reduce((acc, entry) => {
          // Validar que `entry` no sea nulo y tenga las propiedades necesarias
          if (!entry || !entry.currency || !entry.month || !entry.amount) {
            return acc;
          }

          const { currency, symbol, month, amount } = entry;

          // Crear un grupo para la moneda si no existe
          if (!acc[currency]) {
            acc[currency] = {
              symbol,
              data: Array(12).fill(0), // Inicializar con 0 para los 12 meses
            };
          }

          // **Calcular el índice del mes de forma segura**
          const [year, monthPart] = month.split("-"); // Dividir "2025-01" en ["2025", "01"]
          const monthIndex = parseInt(monthPart, 10) - 1; // Convertir "01" en índice (0 para enero)

          // Asignar el monto correspondiente al mes
          acc[currency].data[monthIndex] += parseFloat(amount);

          return acc;
        }, {});

        // Crear datasets para Chart.js
        const datasets = Object.keys(groupedData).map((currency) => {
          const group = groupedData[currency];
          return {
            label: `${group.symbol} ${currency}`,
            data: group.data,
            backgroundColor: this.getRandomColor(), // Generar color aleatorio
          };
        });

        // Crear gráfico
        canvas.chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: months,
            datasets: datasets,
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              x: {
                stacked: true, // Para agrupar barras por mes
              },
              y: {
                stacked: true, // Mostrar datos apilados
                beginAtZero: true,
              },
            },
          },
        });
      },
      getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      },        
      renderIncomeByServiceChart() {
        const finances = this.finances;

        // Agrupar los datos por tipo de contribución y moneda
        const groupedData = finances.reduce((acc, { type_contribution, amount, currency }) => {
          const key = `${type_contribution} (${currency})`;

          // Si no existe el tipo de contribución en el acumulador, inicializarlo en 0
          if (!acc[key]) {
            acc[key] = 0;
          }

          // Sumar el monto acumulado
          acc[key] += parseFloat(amount);

          return acc;
        }, {});

        // Extraer las etiquetas (tipos de contribuciones + moneda) y los valores (montos acumulados)
        const labels = Object.keys(groupedData); // ["Ofrenda pro-templo (COP)", ...]
        const data = Object.values(groupedData); // [200000, ...]

        // Crear el gráfico
        const canvas = document.getElementById("incomeByServiceChart")
        if(canvas.chartInstance){
          canvas.chartInstance.destroy()
        }
        const ctx = canvas.getContext("2d");
        canvas.chartInstance = new Chart(ctx, {
          type: "pie", // Gráfico de pastel
          data: {
            labels: labels, // Etiquetas para cada tipo de contribución
            datasets: [
              {
                data: data, // Valores acumulados
                backgroundColor: labels.map(() => this.getRandomColor()), // Colores aleatorios para cada segmento
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.raw || 0;
                    return `${label}: ${value.toLocaleString()}`;
                  },
                },
              },
            },
          },
        });
      },
      generateChartsData() {
      // Lista de meses para el eje X
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

      // Agrupar datos por tipo de contribución
      const groupedData = this.finances.reduce((acc, { type_contribution, amount, month }) => {
        if (!acc[type_contribution]) {
          acc[type_contribution] = Array(12).fill(0); // Inicializar 12 meses en 0
        }
        
        // Asegurarse de que el índice del mes sea correcto
        const [year, monthPart] = month.split('-'); // Dividir el mes en año y mes
        const monthIndex = parseInt(monthPart, 10) - 1; // Restar 1 para que enero sea 0

        acc[type_contribution][monthIndex] += parseFloat(amount); // Sumar el monto al mes correspondiente
        return acc;
      }, {});

      // Crear configuraciones para cada gráfico
      const charts = Object.keys(groupedData).map((typeContribution) => {
        return {
          typeContribution,
          data: groupedData[typeContribution],
        };
      });
      if(charts.length === 0){
        return this.charts = []
      }
      this.charts = charts;
    },


      renderCharts() {
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        this.charts.forEach((chart, index) => {
          const canvas = document.getElementById(`chart-${index}`);
          if (!canvas) {
            return;
          }else if(canvas.chartInstance){
            canvas.chartInstance.destroy()
          }
          const ctx = canvas.getContext("2d");

          canvas.chartInstance = new Chart(ctx, {
            type: "line",
            data: {
              labels: months,
              datasets: [
                {
                  label: chart.typeContribution,
                  data: chart.data,
                  borderColor: this.getRandomColor(),
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  fill: true,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        });
      },
      toggleDownloadReport() {
        this.downloadCtrl = !this.downloadCtrl

      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  </style>
  