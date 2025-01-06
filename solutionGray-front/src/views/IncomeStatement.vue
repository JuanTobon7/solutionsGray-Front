<template>
    <div class="container mx-auto p-6">
      <!-- Título -->
      <h1 class="text-3xl font-bold mb-4 text-center">Reporte Financiero de la Iglesia</h1>
      
      <!-- Descripción General -->
      <p class="text-gray-600 mb-8 text-center">
        Este reporte presenta un resumen detallado de los ingresos totales, diezmos y ofrendas recibidos en la iglesia, desglosados por mes y año.
        Use los filtros para ajustar los datos y descargue los reportes en formato PDF o Excel para su análisis.
      </p>
  
      <!-- Botón de Reporte General -->
      
  
      <!-- Filtros -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <label for="month" class="font-medium">Mes:</label>
          <select
            id="month"
            v-model="selectedMonth"
            class="border border-gray-300 rounded px-2 py-1"
          >
            <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
          </select>
        </div>
        <div>
          <label for="year" class="font-medium">Año:</label>
          <select
            id="year"
            v-model="selectedYear"
            class="border border-gray-300 rounded px-2 py-1"
          >
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>
  
      <!-- Resumen General con Tarjetas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="p-6 bg-white rounded-lg shadow flex flex-col items-center">
          <h2 class="text-lg font-bold text-gray-700 mb-2">Ingresos Totales</h2>
          <p class="text-2xl text-green-600 font-semibold">$ {{ totalIncome }}</p>
        </div>
        <div class="p-6 bg-white rounded-lg shadow flex flex-col items-center">
          <h2 class="text-lg font-bold text-gray-700 mb-2">Diezmos</h2>
          <p class="text-2xl text-blue-600 font-semibold">$ {{ tithesIncome }}</p>
        </div>
        <div class="p-6 bg-white rounded-lg shadow flex flex-col items-center">
          <h2 class="text-lg font-bold text-gray-700 mb-2">Ofrendas</h2>
          <p class="text-2xl text-yellow-600 font-semibold">$ {{ offeringsIncome }}</p>
        </div>
      </div>
  
      <!-- Gráfico de Ingresos Totales -->
      <div class="p-3 shadow-md rounded bg-white mb-8">
        <h2 class="text-xl font-semibold text-center mb-4">Ingresos Totales</h2>
        <canvas         
        class="mb-4 min-h-[30vh] w-full" id="totalIncomeChart"></canvas>            
      </div>
  
      <!-- Tabla Desglose por Categoría -->
      <div class="p-6 shadow-md rounded bg-white mb-8">
        <h2 class="text-xl font-semibold mb-4 text-center">Desglose de Ingresos</h2>
        <table class="w-full border-collapse border border-gray-200 text-center mb-4">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2 border">Categoría</th>
              <th class="p-2 border">Monto</th>
              <th class="p-2 border">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
              <td class="p-2 border">Diezmos</td>
              <tr>
              <td class="p-2 border">$ {{ tithesIncome }}</td>
            </tr>
            <tr>
              <td class="p-2 border">Ofrendas</td>
              <td class="p-2 border">$ {{ offeringsIncome }}</td>
            </tr>
            <tr>
              <td class="p-2 border font-bold">Total</td>
              <td class="p-2 border font-bold">$ {{ totalIncome }}</td>
              <td class="p-2 border font-bold">100%</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-end">
        <button
          class="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-medium rounded-md shadow-md"
          @click="downloadGeneralReport"
        >
          Descargar Reporte General
          <i class="material-symbols-outlined">file_download</i>
        </button>
      </div>
      </div>    
      <!-- Gráficos por Categoría -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
         <!-- Gráfico de Pie -->
        <div class="p-6 bg-white rounded-lg shadow mb-8">
          <h2 class="text-xl font-semibold text-center mb-4">Ingresos por Tipo de Culto</h2>
          <canvas style="max-width: 300px; max-height: 300px;"

          id="incomeByServiceChart"></canvas>
          <div class="flex justify-end mt-4">
            <button
              class="bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-medium rounded-md shadow-md"
              @click="downloadReport('Ingresos por Tipo de Culto', 'incomeByServiceChart')"
            >
              Descargar Reporte
            </button>
          </div>
        </div>
        <!-- Diezmos -->
        <div class="p-6 shadow-md rounded bg-white">
            <div class="mb-4">                
                <h2 class="text-lg font-semibold text-center mb-4">Ingresos de Diezmos</h2>
                <canvas id="tithesIncomeChart"></canvas>
            </div>
            <div class="flex justify-end mb-4">
            <button
              class="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 text-white rounded-md"
              @click="downloadReport('Ingresos de Diezmos', 'tithesIncomeChart')"
            >
              Descargar Reporte
              <i class="material-symbols-outlined">download</i>
            </button>
          </div>          
        </div>
  
        <!-- Ofrendas -->
        <div class="p-6 shadow-md rounded bg-white">
            <h2 class="text-lg font-semibold text-center mb-4">Ingresos de Ofrendas</h2>
            <canvas class="mb-4" id="offeringsIncomeChart"></canvas>
            <div class="flex justify-end mb-4">
            <button
              class="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 text-white rounded-md"
              @click="downloadReport('Ingresos de Ofrendas', 'offeringsIncomeChart')"
            >
              Descargar Reporte
              <i class="material-symbols-outlined">download</i>
            </button>
          </div>          
        </div>
      </div>
    </div>
  </template>
  
    
  <script>
  import { Chart, registerables } from "chart.js";
  import jsPDF from "jspdf";
  
  Chart.register(...registerables);
  
  export default {
    data() {
      return {
        // Opciones de filtros
        months: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        years: [2023, 2024],
        selectedMonth: "Enero",
        selectedYear: 2023,

        // Ingresos simulados
        totalIncome: 3000,
        tithesIncome: 1500,
        offeringsIncome: 1200,
        incomeByService: [
        { name: "Culto Dominical", amount: 1500 },
        { name: "Culto de Oracion", amount: 1200 },
        { name: "Culto Especial", amount: 300 },
      ],

  
        // Datos simulados
        incomes: [
          { date: "2023-01-15", category: "Diezmos", amount: 1500 },
          { date: "2023-01-20", category: "Ofrendas", amount: 1200 },
          { date: "2023-02-10", category: "Diezmos", amount: 2000 },
          { date: "2023-02-15", category: "Ofrendas", amount: 1000 },
        ],
      };
    },
    mounted() {
      this.renderTotalIncomeChart();
      this.renderTithesIncomeChart();
      this.renderOfferingsIncomeChart();
        this.renderIncomeByServiceChart();
    },
    methods: {
      renderTotalIncomeChart() {
        const ctx = document.getElementById("totalIncomeChart").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: this.months,
            datasets: [
              {
                label: "Ingresos Totales",
                data: [3000, 4000, 5000, 6000, 7000, 8000],
                backgroundColor: "#4CAF50",
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
          },
        });
      },
      renderTithesIncomeChart() {
        const ctx = document.getElementById("tithesIncomeChart").getContext("2d");
        new Chart(ctx, {
          type: "line",
          data: {
            labels: this.months,
            datasets: [
              {
                label: "Diezmos",
                data: [1500, 2000, 1800, 2200, 2100, 2300],
                borderColor: "#FF9800",
                backgroundColor: "rgba(255, 152, 0, 0.2)",
                fill: true,
              },
            ],
          },
          options: { responsive: true, plugins: { legend: { position: "top" } } },
        });
      },
      renderOfferingsIncomeChart() {
        const ctx = document.getElementById("offeringsIncomeChart").getContext("2d");
        new Chart(ctx, {
          type: "line",
          data: {
            labels: this.months,
            datasets: [
              {
                label: "Ofrendas",
                data: [1200, 1400, 1600, 1800, 2000, 2200],
                borderColor: "#03A9F4",
                backgroundColor: "rgba(3, 169, 244, 0.2)",
                fill: true,
              },
            ],
          },
          options: { responsive: true, plugins: { legend: { position: "top" } } },
        });
      },
      renderIncomeByServiceChart() {
      const ctx = document.getElementById("incomeByServiceChart").getContext("2d");
      new Chart(ctx, {
        type: "pie", // Gráfico de pastel
        data: {
          labels: this.incomeByService.map((service) => service.name),
          datasets: [
            {
              label: "Ingresos",
              data: this.incomeByService.map((service) => service.amount),
              backgroundColor: ["#4CAF50", "#FF9800", "#03A9F4"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
        },
      });
    },
      downloadReport(reportTitle, canvasId) {
        const canvas = document.getElementById(canvasId);
        const canvasImage = canvas.toDataURL("image/png");
  
        const pdf = new jsPDF();
        pdf.text(reportTitle, 10, 10);
        pdf.addImage(canvasImage, "PNG", 10, 20, 190, 100);
        pdf.save(`${reportTitle}.pdf`);
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  </style>
  