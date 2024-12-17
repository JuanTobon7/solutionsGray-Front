<template>
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Reporte Financiero de la Iglesia</h1>
  
      <!-- Filtros -->
      <div class="flex justify-between items-center mb-6">
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
  
      <!-- Gráficos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Ingresos por Categoría -->
        <div class="p-4 shadow-md rounded bg-white">
          <h2 class="text-lg font-semibold text-center mb-4">Ingresos por Categoría</h2>
          <BarChart :data="incomeByCategoryData" />
        </div>
  
        <!-- Ingresos Mensuales -->
        <div class="p-4 shadow-md rounded bg-white">
          <h2 class="text-lg font-semibold text-center mb-4">Ingresos Mensuales</h2>
          <LineChart :data="monthlyIncomeData" />
        </div>
      </div>
  
      <!-- Tabla de Detalles -->
      <div class="mt-8">
        <h2 class="text-lg font-semibold mb-4">Detalle de Ingresos</h2>
        <table class="min-w-full border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="text-left px-4 py-2">Fecha</th>
              <th class="text-left px-4 py-2">Categoría</th>
              <th class="text-right px-4 py-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="income in filteredIncomes"
              :key="income.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ formatDate(income.date) }}</td>
              <td class="px-4 py-2">{{ income.category }}</td>
              <td class="text-right px-4 py-2">{{ formatCurrency(income.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import BarChart from "@/components/BarChart.vue"; // Gráfico de barras
  import LineChart from "@/components/LineChart.vue"; // Gráfico de líneas
  
  export default {
    data() {
      return {
        // Opciones de filtros
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        years: [2023, 2024],
        selectedMonth: "Enero",
        selectedYear: 2023,
  
        // Datos simulados
        incomes: [
          { id: 1, date: "2023-01-15", category: "Ofrendas", amount: 1200 },
          { id: 2, date: "2023-01-20", category: "Donaciones", amount: 800 },
          { id: 3, date: "2023-02-05", category: "Eventos", amount: 500 },
          { id: 4, date: "2023-02-10", category: "Ofrendas", amount: 1000 },
        ],
  
        // Datos para gráficos
        incomeByCategoryData: {
          labels: ["Ofrendas", "Donaciones", "Eventos"],
          datasets: [{ data: [2200, 800, 500], backgroundColor: ["#4CAF50", "#FF9800", "#03A9F4"] }],
        },
        monthlyIncomeData: {
          labels: ["Enero", "Febrero", "Marzo"],
          datasets: [
            {
              label: "Ingresos",
              data: [2000, 1500, 1800],
              borderColor: "#4CAF50",
              fill: false,
            },
          ],
        },
      };
    },
    computed: {
      filteredIncomes() {
        return this.incomes.filter(
          (income) =>
            new Date(income.date).getFullYear() === this.selectedYear &&
            new Date(income.date).getMonth() === this.months.indexOf(this.selectedMonth)
        );
      },
    },
    methods: {
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      },
      formatCurrency(amount) {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  </style>
  