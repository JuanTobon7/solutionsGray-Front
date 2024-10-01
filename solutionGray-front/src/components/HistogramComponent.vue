<template>
  <div class="w-full">
    <canvas id="histogram-chart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js/auto';

export default {
  name: 'HistogramChart',
  setup() {
    const chartRef = ref(null);

    onMounted(() => {
      const ctx = document.getElementById('histogram-chart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
          datasets: [
            {
              label: 'Nuevos y Antiguos',
              data: [12, 19, 3, 5, 2],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 3
            },
            {
              label: 'Desertores',
              data: [12, 19, 3, 5, 2],
              type: 'line',
              fill: false,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              pointBorderColor: 'rgba(255, 99, 132, 1)',
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true, // Makes the chart responsive
          maintainAspectRatio: false, // Allow the chart to resize with the container
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: window.innerWidth < 640 ? 10 : 15 // Adjust font size for smaller screens
                }
              }
            },
            x: {
              ticks: {
                font: {
                  size: window.innerWidth < 640 ? 10 : 11 // Adjust font size for smaller screens
                }
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Asistencia',
              font: {
                size: window.innerWidth < 640 ? 14 : 18 // Adjust title font size based on screen size
              }
            },
            legend: {
              labels: {
                font: {
                  size: window.innerWidth < 640 ? 12 : 18 // Smaller font size for legend on small screens
                }
              }
            }
          },
          layout: {
            padding: {
              top: 10,
              bottom: 10,
            }
          }
        }
      });

      // Update chart size when window is resized
      window.addEventListener('resize', () => {
        chart.options.scales.x.ticks.font.size = window.innerWidth < 640 ? 10 : 12;
        chart.options.scales.y.ticks.font.size = window.innerWidth < 640 ? 10 : 12;
        chart.options.plugins.title.font.size = window.innerWidth < 640 ? 14 : 18;
        chart.options.plugins.legend.labels.font.size = window.innerWidth < 640 ? 10 : 12;
        chart.update();
      });
    });

    return {
      chartRef
    };
  }
};
</script>

<style scoped>
/* Ensure the canvas takes full width of the container */
#histogram-chart {
  width: 100%;
  height: 400px; /* Set a base height; can be adjusted as needed */
}
</style>
