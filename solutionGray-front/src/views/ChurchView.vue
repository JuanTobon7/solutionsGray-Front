<template>
  <section class="min-h-screen container w-full mx-auto p-4">
      <div class="p-2">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 text-3xl sm:text-5xl mb-4">
          <h1 class="text-second-800"><strong>Iglesia {{ churchName }}</strong></h1>
          <i class="material-symbols-outlined text-second-500 text-3xl sm:text-5xl">church</i>
        </div>
        <p class="text-primary-900 text-xl sm:text-3xl font-serif mb-2">
          <strong>Y el Señor añadía cada día al número de ellos los que iban siendo salvos. Hechos 2:47</strong>
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="card">
            <h3 class="text-lg font-bold text-second-700">Cantidad de Siervos</h3>
            <span class="text-3xl font-bold text-primary-800">{{ quantityservants || 0 }}</span>
          </div>
          <div class="card">
            <h3 class="text-lg font-bold text-second-700">Cantidad de Grupos</h3>
            <span class="text-3xl font-bold text-primary-800">{{ quantitygroups || 0 }}</span>
          </div>
          <div class="card">
            <h3 class="text-lg font-bold text-second-700">Cantidad de Ovejas</h3>
            <span class="text-3xl font-bold text-primary-800">{{ quantitysheeps || 0 }}</span>
          </div>
          <div class="card">
            <h3 class="text-lg font-bold text-second-700">Cantidad de Nuevos</h3>
            <span class="text-3xl font-bold text-primary-800">{{ quantity_new_times || 0}}</span>
          </div>
          <div class="card">
            <h3 class="text-lg font-bold text-second-700">Cantidad de Estudiantes en Crecimiento</h3>
            <span class="text-3xl font-bold text-primary-800">{{ peopleInCourses.quantity_active_students || 0 }}</span>
          </div>
          <div class="card">
            <h3 class="text-lg font-bold text-second-700">Cantidad de Maestos</h3>
            <span class="text-3xl font-bold text-primary-800">{{ peopleInCourses.quantity_teachers || 0 }}</span>
          </div>
        </div>

        <div class="mb-4">
          <div class="flex flex-wrap items-center justify-between">
            <h2 class="text-2xl text-second-800 font-semibold mb-4">
              Estadística de Asistencia
            </h2>
            <div class="flex flex-wrap items-center gap-4 mb-2">
              <Calendar 
                v-model="date" 
                view="year" 
                dateFormat="yy" 
                class="border border-gray-300 py-1 pl-2 rounded-md" 
              />
              <span class="text-gray-500 text-sm">
                * El año seleccionado se aplica a todas las gráficas.
              </span>
              <button v-if="$hasRole('Admin')"
              @click="toogleCharts"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2">
                Descargar Reporte
                <i class="material-symbols-outlined">download</i>
              </button>
            </div>
          </div>
                   
        </div>

        <div ref="report">          
          <div class="chart-container">
              <canvas id="stadisticAssitanceChurchChart"></canvas>
          </div> 
          <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-4">    
            <div>  
                  <h2 class="text-2xl text-second-800 font-semibold">
                    Estadística de Personas
                  </h2>
                  
                <div v-if="ctrl" class="chart-container">
                  <canvas id="stadisticChurchChart"></canvas>
                </div>
                <div v-else class="text-center">
                  <span class="material-symbols-outlined text-gray-400 text-6xl mb-2">sentiment_dissatisfied</span>
              <p class="text-gray-500 text-lg">No hay datos disponibles</p>        
              </div>
            </div>

            <!-- Estadística de Cursos -->
              <div>
                  <h2 class="text-2xl text-second-800 font-semibold">
                    Estadística de Cursos
                  </h2>
                  
                  <div class="chart-container">
                    <canvas id="stadistcCourseChart"></canvas>
                  </div>            
              </div>
          </div>
      </div>

    </div>
  </section>
  <InfoChurchPDF v-if="dataReady && chartsComplete" :date="date" 
    :chartImages="chartImages"
    :churchName="churchName"
    @close="toogleCharts"
  />
</template>

<script>
import { getStadistcsPeopleChurch,getStadisticsAssistance,getStadisticsPeopleCourses } from "@/apiServices/index";
import { Chart } from "chart.js/auto";
import Calendar from "primevue/calendar";
import { format } from "date-fns";
import InfoChurchPDF from "@/components/Church/InfoChurchPDF.vue";

export default {
  name: "DashboardView",
  components: {
    Calendar,
    InfoChurchPDF,
  },
  data() {
    return {
      churchName: '', // Nombre de la iglesia
      quantityservants: 0, // Cantidad de siervos
      quantitygroups: 0, // Cantidad de grupos
      quantitysheeps: 0, // Cantidad de ovejas
      quantity_new_times: 0, // Cantidad de nuevos
      assitance: [],
      peopleInCourses: {},
      date: null,
      ctrl: true,
      chartImages: [],
      chartsComplete: false,
    };
  },  
  mounted() {
    this.date = new Date();
    const session = this.$store.getters.userSession;
    if (session) this.churchName = JSON.parse(session).churchName;
  },
  watch: {
    async date() {
      const date = this.date;
      const selectedYear = new Date(date).getFullYear();
      const minDate = new Date(selectedYear, 0, 1, 0, 0, 0, 0);
      const maxDate = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const minDateFormat = format(minDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
      const maxDateFormat = format(maxDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
      this.getStadistcsChurch({minDateFormat, maxDateFormat});
      this.getStadisticsAssistance({minDateFormat, maxDateFormat});
      this.getStadisticsPeopleCourses({minDateFormat, maxDateFormat});
      this.chartImages = [];
    },
  },
  computed: {
    dataReady() {
      return this.assitance.length > 0 && this.churchName && this.chartImages.length >= 3;
    },
  },
  methods: {    
    async getStadistcsChurch(data) {
      try {
        const response = await getStadistcsPeopleChurch(data);        
        // Asignar datos obtenidos a las propiedades
        this.quantitygroups = parseInt(response.quantitygroups) || 0;
        this.quantitysheeps = parseInt(response.countoveja) || 0;
        this.quantityservants = parseInt(response.countusuario) || 0;
        this.quantity_new_times = parseInt(response.countnuevo) || 0;

        // Renderizar el gráfico con los datos actualizados
        this.renderDetailedStatsChart();
      } catch (e) {
        if (e.response.status !== 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el culto.', life: 3000 });
        }else {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No hay informacion que mostrar', life: 3000 });
          this.quantitygroups = 0;
          this.quantitysheeps = 0;
          this.quantityservants =  0;
          this.quantity_new_times =  0;
          this.renderDetailedStatsChart();
        }
      }
    },
    async getStadisticsAssistance (data){
      try {
        const response = await getStadisticsAssistance(data);
        this.assitance = response;
        this.renderAssistanceChart();
      } catch (e) {
        if (e.response.status !== 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el culto.', life: 3000 });
        }else{
          this.peopleInCourses = {
            quantity_students: 0,
            quantity_teachers: 0,
            quantity_active_students: 0,
          };
          this.renderAssistanceChart();
        }
      }
    },
    async getStadisticsPeopleCourses (data){
      try {
        const response = await getStadisticsPeopleCourses(data);
        this.peopleInCourses = response;
        this.renderCourseChart();
      } catch (e) {
        if (e.response.status !== 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el culto.', life: 3000 });
        }else{
          this.peopleInCourses = {};
          this.renderCourseChart();
        }
      }
    },
    renderDetailedStatsChart() {
      const canvas = document.getElementById("stadisticChurchChart");

      // Verificar si ya existe un gráfico asociado al canvas y destruirlo
      if (canvas.chartInstance) {
        canvas.chartInstance.destroy();
      }

      // Obtener el contexto del canvas
      const ctx = canvas.getContext("2d");

      // Crear un nuevo gráfico y almacenarlo como propiedad del canvas
      canvas.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Grupos", "Usuarios", "Nuevos", "Ovejas"], // Etiquetas de los datos
          datasets: [
            {
              label: "Cantidad",
              data: [
                this.quantitygroups,
                this.quantityservants,
                this.quantity_new_times,
                this.quantitysheeps,
              ],
              backgroundColor: [
                "rgba(75, 192, 192, 0.5)", // Color para Grupos
                "rgba(54, 162, 235, 0.5)", // Color para Usuarios
                "rgba(255, 206, 86, 0.5)", // Color para Nuevos
                "rgba(255, 99, 132, 0.5)", // Color para Ovejas
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(255, 99, 132, 1)",
              ],
              borderWidth: 1.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true, // Mostrar leyenda
            },
            tooltip: {
              enabled: true, // Mostrar tooltips
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: window.innerWidth < 640 ? 10 : 14,
                },
              },
            },
            x: {
              ticks: {
                font: {
                  size: window.innerWidth < 640 ? 10 : 14,
                },
              },
            },
          },
          animation: {
            onComplete: ()=>{
              this.chartImages.push({image:canvas.toDataURL("image/png"),tittle:'Estadistica Personas'});
            }
          }
        },
      });
    },
    renderAssistanceChart() {
      // Array con nombres de los meses
      const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];

      // Crear un objeto inicial con todos los meses en 0
      const fullYearData = monthNames.map((month, index) => ({
        month: index + 1, // Índice del mes (1 = Enero, 2 = Febrero, ...)
        name: month, // Nombre del mes
        attendance_count: 0, // Inicializamos con asistencia 0
      }));

      // Actualizar los datos con los valores de this.assitance
      this.assitance.forEach(item => {
        const [, month] = item.month.split("-");
        fullYearData[parseInt(month) - 1].attendance_count = parseInt(item.attendance_count);
      });

      // Extraer etiquetas (meses) y datos (asistencias)
      const labels = fullYearData.map(item => item.name);
      const data = fullYearData.map(item => item.attendance_count);

      // Obtener el canvas y verificar si ya hay una instancia de Chart
      const canvas = document.getElementById("stadisticAssitanceChurchChart");
      if (!canvas) {
        return;
      }

      // Si ya existe un gráfico, actualizamos sus datos
      if (canvas.chartInstance) {

        // Actualizar etiquetas y datos
        canvas.chartInstance.data.labels = labels; // Nuevas etiquetas
        canvas.chartInstance.data.datasets[0].data = data; // Nuevos datos

        // Refrescar el gráfico
        canvas.chartInstance.update(); // Método de Chart.js para actualizar el gráfico
        return;
      }

      // Crear un nuevo gráfico si no existe uno
      const ctx = canvas.getContext("2d");
      canvas.chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Cantidad de Asistentes",
              data: data,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1.5,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            onComplete: ()=>{
              this.chartImages.push({image: canvas.toDataURL("image/png"),tittle: 'Estadistica Asistencia' });
            }
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
    },
    renderCourseChart() {
  // Extraer datos del objeto
      const data = this.peopleInCourses; // Asegúrate de que sea un array con el primer elemento
      const chartData = [
        data.quantity_students,
        data.quantity_teachers,
        data.quantity_active_students,
      ];

      // Etiquetas correspondientes
      const labels = ["Estudiantes", "Docentes", "Estudiantes Activos"];

      // Obtener el canvas y verificar la instancia existente
      const canvas = document.getElementById("stadistcCourseChart");

      // Destruir gráfico existente si ya hay uno
      if (canvas.chartInstance) {
        canvas.chartInstance.destroy();
      }

      // Obtener el contexto del canvas
      const ctx = canvas.getContext("2d");

      // Crear un nuevo gráfico y asignarlo como propiedad del canvas
      canvas.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels, // Etiquetas dinámicas
          datasets: [
            {
              label: "Cantidad", // Etiqueta del dataset
              data: chartData, // Datos extraídos del objeto
              backgroundColor: [
                "rgba(75, 192, 192, 0.5)", // Estudiantes
                "rgba(54, 162, 235, 0.5)", // Docentes
                "rgba(255, 206, 86, 0.5)", // Estudiantes Activos
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1.5, // Grosor de los bordes
            },
          ],
        },
        options: {
          animation: {
            onComplete: ()=>{
              this.chartImages.push({image: canvas.toDataURL("image/png"),tittle: 'Estadistica Cursos' });
            }
          },
          responsive: true,
          maintainAspectRatio: false, // Ajusta el gráfico al contenedor
          plugins: {
            legend: {
              display: true, // Mostrar la leyenda
            },
            tooltip: {
              enabled: true, // Activar tooltips
            },
          },
          scales: {
            y: {
              beginAtZero: true, // Comenzar el eje Y en 0
              ticks: {
                font: {
                  size: window.innerWidth < 640 ? 10 : 14, // Tamaño adaptable
                },
              },
            },
            x: {
              ticks: {
                font: {
                  size: window.innerWidth < 640 ? 10 : 14, // Tamaño adaptable
                },
              },
            },
          },
        },
      });      
    },
    toogleCharts(){
      this.chartsComplete = !this.chartsComplete;
    }
  },
};
</script>

<style scoped>
/* General container for the charts to ensure responsiveness */
.chart-container {
 
  @apply w-full h-80 mb-10;
}


/* Style to ensure charts are properly scaled */
canvas {
  @apply w-full h-auto;
}

.card{
  @apply p-4 bg-white rounded-lg shadow-md shadow-gray-300 flex flex-col items-center;
}

/* Estilo para ocultar el botón cuando se genera el PDF */
button[disabled] {
  visibility: hidden; /* Oculta visualmente el botón pero mantiene el espacio */
}
</style>