<template>
  <div class="flex justify-center items-center w-full max-h-96">
    <canvas id="histogram-chart" class="w-full max-w-3xl max-h-96"></canvas>
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
      new Chart(ctx, {
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
              pointRadius: 5
            }
          ]
        },
        options: {
          
          scales: {
            y: {            
              ticks: {
                font: {
                  size: 16
                }
              }
            },
            x: {
              ticks: {
                font: {
                  size: 16
                }
              }
            }
          },
          plugins: {
            title: {
              display: true,
                text: 'Asistencia',
                font: {
                  size: 24
                }
            },
            legend: {
              labels: {
                font: {
                  size: 18
                }
              }
            }
          }
        }
      });
    });

    return {
      chartRef
    };
  }
};
</script>

<style scoped>
/* Asegúrate de que el contenedor principal tenga un ancho completo y ajuste el contenido */
.container {
  width: 100%;
  max-width: 1200px; /* O el valor que necesites */
  margin: 0 auto;
}
</style>
