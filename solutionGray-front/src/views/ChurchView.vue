<template>
  <section class="min-h-screen container w-full mx-auto p-4">
    <!-- Versículo Bíblico -->
    <div class="mb-6">
      <p class="text-primary-900 text-xl sm:text-3xl font-serif">
        <strong>Y el Señor añadía cada día al número de ellos los que iban siendo salvos. Hechos 2:47</strong>
      </p>
    </div>

    <!-- Información General de la Iglesia -->
    <div class="p-4 shadow-md bg-second-50 shadow-second-600 rounded-md h-auto mb-6">
      <div class="w-full">
        <!-- Church Info Header -->
        <div class="flex flex-col sm:flex-row items-center gap-3 text-3xl sm:text-5xl mb-4">
          <h1 class="text-second-800"><strong>Iglesia {{ churchName }}</strong></h1>
          <i class="material-symbols-outlined text-second-500 text-3xl sm:text-5xl">church</i>
        </div>

        <!-- Church Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <!-- Card 1: Siervos -->
          <div class="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
            <h3 class="text-lg font-bold text-second-700">Cantidad de Siervos</h3>
            <span class="text-3xl font-bold text-primary-800">{{ quantityservants }}</span>
          </div>

          <!-- Card 2: Grupos -->
          <div class="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
            <h3 class="text-lg font-bold text-second-700">Cantidad de Grupos</h3>
            <span class="text-3xl font-bold text-primary-800">{{ quantitygroups }}</span>
          </div>

          <!-- Card 3: Ovejas -->
          <div class="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
            <h3 class="text-lg font-bold text-second-700">Cantidad de Ovejas</h3>
            <span class="text-3xl font-bold text-primary-800">{{ quantitysheeps }}</span>
          </div>
        </div>

        <!-- HistogramComponent for custom growth stats -->
        <div class="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 class="text-2xl text-second-800 font-semibold mb-4">Estadísticas de Crecimiento</h2>
          <div class="chart-container">
            <HistogramComponent/>
          </div>
        </div>

        <!-- Chart.js Section: Growth and Decline -->
        <div class="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 class="text-2xl text-second-800 font-semibold mb-4">Estadísticas de Crecimiento</h2>
          <div class="chart-container">
            <canvas id="growthChart"></canvas>
          </div>
        </div>

        <!-- Chart.js Section: Pie Chart -->
        <div class="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 class="text-2xl text-second-800 font-semibold mb-4">Distribución de Grupos, Siervos y Ovejas</h2>
          <div class="chart-container">
            <canvas id="distributionChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import HistogramComponent from '@/components/HistogramComponent.vue';
import { Chart } from 'chart.js/auto';

export default {
  name: 'DashboardView',
  components: {
    HistogramComponent,
  },
  data() {
    return {
      churchName: 'Ejemplo de Iglesia',
      quantityservants: 50,
      quantitygroups: 20,
      quantitysheeps: 200,
    };
  },
  mounted() {
    this.renderGrowthChart();
    this.renderDistributionChart();
  },
  methods: {
    renderGrowthChart() {
      const ctx = document.getElementById('growthChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
          datasets: [
            {
              label: 'Crecimiento',
              data: [10, 15, 12, 18, 20, 25],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Decrecimiento',
              data: [5, 3, 6, 2, 4, 5],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true, // Makes the chart responsive
          maintainAspectRatio: false, // Allow the chart to resize with the container
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: window.innerWidth < 640 ? 10 : 15, // Adjust font size for smaller screens
                },
              },
            },
            x: {
              ticks: {
                font: {
                  size: window.innerWidth < 640 ? 10 : 11, // Adjust font size for smaller screens
                },
              },
            },
          },
        },
      });
    },
    renderDistributionChart() {
      const ctx = document.getElementById('distributionChart').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Siervos', 'Grupos', 'Ovejas'],
          datasets: [
            {
              data: [this.quantityservants, this.quantitygroups, this.quantitysheeps],
              backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
              borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // This will allow the chart to adjust to container size
        },
      });
    },
  },
};
</script>

<style scoped>
/* General container for the charts to ensure responsiveness */
.chart-container {
  width: 100%;
  height: 400px; /* You can adjust this height */
  position: relative;
}

/* Style to ensure charts are properly scaled */
canvas {
  @apply w-full h-full;
}
</style>
