<template>
    <section class="min-h-screen sm:pt-8 container w-full">
        <div v-if="showInfoService">
        
        </div>
        <div v-else>
        <div class="mb-4 text-center">
            <h1 class="text-3xl sm:text-4xl md:text-5xl mb-4 text-second-800">
            <strong>Asistencia e Informe de Cultos en mi grupo {{'Vida Nueva'}}</strong>
            </h1>
            <p class="text-primary-900 text-xl sm:text-2xl font-serif">
            <strong>Y considerémonos unos a otros para estimularnos al amor y a las buenas obras; no dejando de congregarnos, como algunos tienen por costumbre, sino exhortándonos; y tanto más, cuanto veis que aquel día se acerca. Hebreos 10:24-25</strong>
            </p>
        </div>

        <!-- Barra de búsqueda y botones -->      

        <!-- Cultos Programados -->      
        <DataView
          :value="cultos"
          :paginator="true"
          :rows="5"
        >
            <template #header>
            <div class="flex flex-wrap justify-between items-center">
                <h2 class="text-2xl text-second-800 font-semibold">Servicios Programados</h2>
                <div class="flex flex-wrap items-center gap-2">   
                <Calendar 
                :input-class="['border border-gray-300 rounded-md px-2 py-1 w-auto']"
                class=" w-auto" 
                showIcon
                selectionMode="range" :manualInput="false"
                v-model="dates" 
                placeholder="dd/mm/yyyy-dd/mm/yyyy"/>
                    
                <button
                    @click="addWorshipService"
                    class="bg-primary-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105 text-sm sm:text-base">
                    Agregar Servicio
                </button>
            </div>
            </div>

            </template>
            <!-- Template para renderizar elementos en la lista -->
            <template #list="slotProps">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <div
            v-for="(items, index) in slotProps.items"
            :key="index" class="w-full full">
                
                <div
                    class="transition-transform duration-200 hover:-translate-y-2 shadow-md shadow-gray-400 rounded-lg sm:rounded-2xl cursor-pointer w-full h-full overflow-hidden"
                    @click="showInfo(items)"
                >
                    <!-- Imagen de fondo -->
                    <div
                    class="relative w-full h-36 sm:h-48 bg-cover bg-center bg-image"                  
                    ></div>

                    <!-- Contenido del card -->
                    <div class="p-4">
                    <!-- Título -->
                    <h2 class="text-lg sm:text-2xl font-semibold text-second-900">
                        {{ items.sermon_tittle }}
                    </h2>

                    <!-- Subtítulo -->
                    <h3 class="text-base sm:text-xl text-second-800">
                        {{ items.worship_name }}
                    </h3>

                    <!-- Detalles -->
                    <div class="flex flex-col mt-2">
                        <!-- Fecha -->
                        <div class="flex items-center gap-2 sm:gap-3 mb-2">
                        <i class="material-symbols-outlined text-gray-700">event</i>
                        <span class="text-base sm:text-xl text-gray-800">
                            {{ formatDate(items.date) }}
                        </span>
                        </div>

                        <!-- Descripción -->
                        <div class="flex items-center gap-2 text-gray-800">
                        <span class="material-symbols-outlined">book</span>
                        <p class="whitespace-normal break-words overflow-hidden text-sm sm:text-base">
                            {{ items.description }}
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </template>
        </DataView>         
        </div>          
    </section>
    <AddWorshipService v-if="showAddWorshipService" :group="group" @close="closeAddWorhipService" />
</template>
<script>
import { getServicesGroup,getMyInfoGroup } from '@/apiServices';
import DataView from 'primevue/dataview';
import Calendar from 'primevue/calendar';
import AddWorshipService from '@/components/Church/AddWorshipService.vue';
import { format } from 'date-fns';

export default {
  components: {
    DataView,
    Calendar,
    AddWorshipService,
  },
  data() {
    return {
      showAddWorshipService: false,
      showInfoService: false,
      showEditService: false,
      searchQuery: '',
      selectedService: null,
      message: null,
      cultos: [],
      dates: [],
      group: {},
    };
  },  
  watch: {
    dates(){
      this.getServicesGroup();
    }
  },
  methods: {
    addWorshipService() {
      this.showAddWorshipService = true;
    },
    showInfoEvent(event) {
      this.selectedService = event.data;
      this.showInfoService = true;
    },    
    closeAddWorhipService() {
      this.showAddWorshipService = false;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' };
      let dateFormated = date.toLocaleDateString('es-ES', options);
      dateFormated = dateFormated.charAt(0).toUpperCase() + dateFormated.slice(1);
      return dateFormated.replace(/,/g, ' ');
    },
    selectService(service) {
      this.selectedService = service;
    },
    async getMyInfoGroup() {
      try {
        const response = await getMyInfoGroup();
        this.group = response;
      } catch (e) {
        if (e.response.status !== 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el culto.', life: 3000 });
        }
      }
    },
    async getServicesGroup() {
      try {
        if(!this.dates[1]) return;
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const minDate = format(this.dates[0], "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
        const maxDate = format(this.dates[this.dates.length - 1], "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
        this.cultos = await getServicesGroup({groupId:this.group.id,minDate, maxDate});
      } catch (e) {
        if (e.response.status !== 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el culto.', life: 3000 });
        }else if(e.response.status === 400 && e.response.data.message === 'No hay cultos programados'){
          this.cultos = [];
          this.$toast.add({ severity: 'info', summary: 'Info', detail: 'No hay cultos programados en el rango de fechas seleccionado.', life: 3000 });
        }
      }
    },
  },
  async mounted() {    
    const today = new Date();
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(today.getDate() - 30);
    const date30DaysAfter = new Date();
    date30DaysAfter.setDate(today.getDate() + 30);
    this.dates = [date30DaysAgo, date30DaysAfter];
    await this.getMyInfoGroup();
  },
};
</script>

<style scoped>
.bg-image {
  background-image: url('https://s3.us-east-2.amazonaws.com/viddefe.com/photos/vid.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

@media (min-width: 640px) {
  .bg-image {
    background-position: center;
  }
}
</style>
