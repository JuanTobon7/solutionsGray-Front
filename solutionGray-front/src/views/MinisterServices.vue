<template>
  <section class="min-h-screen sm:pt-8 container w-full">
    <div v-if="showInfoService">
      <InfoWorshipService 
        :worshipService="selectedService"  
        @close="showInfoService = false"
      />
    </div>
    <div v-else>
      <div class="mb-4 text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl mb-4 text-second-800">
          <strong>Asistencia e Informe de Cultos</strong>
        </h1>
        <p class="text-primary-900 text-xl sm:text-2xl font-serif">
          <strong>Yo me alegré con los que me decían: A la casa de Jehová iremos. Salmos 122:1</strong>
        </p>
      </div>

      <!-- Barra de búsqueda y botones -->      

      <!-- Cultos Programados -->      
      <DataView
        v-if="cultos.length > 0 && !showHistoryService"
        :value="cultos"
        :paginator="true"
        :rows="12"
      >
        <template #header>
          <div class="flex flex-wrap justify-between items-center">
            <h2 class="text-2xl sm:text-3xl font-semibold text-second-800">Cultos Programados</h2>
            <div class="flex flex-wrap items-center gap-2">   
              <Calendar 
              :input-class="['border border-gray-300 rounded-md px-2 py-1 w-auto']"
              class=" w-auto" 
              showIcon
              selectionMode="range" :manualInput="false"
              v-model="date" 
              placeholder="dd/mm/yyyy-dd/mm/yyyy"/>  
   
              <button
                @click="toggleHistory"
                class="bg-primary-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105 text-sm sm:text-base">
                {{ historyButtonText }}
              </button>
              <button
                @click="addWorshipService"
                class="bg-primary-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105 text-sm sm:text-base">
                Agregar Culto
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
                class="transition-transform duration-200 hover:-translate-y-2 shadow-md shadow-gray-400 rounded-lg sm:rounded-2xl cursor-pointer w-full overflow-hidden"
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

      <!-- Mensaje de no hay cultos programados -->
      <div v-if="cultos.length == 0" class="flex flex-col items-center justify-center h-64 sm:h-96">
        <span class="text-6xl sm:text-8xl material-symbols-outlined mb-4 text-primary-900">sentiment_dissatisfied</span>
        <p class="text-xl sm:text-2xl text-second-800">No hay cultos programados en este momento.</p>
        <p class="text-lg sm:text-xl text-gray-600 mt-2 text-center">Por favor, vuelve más tarde o agrega un nuevo culto.</p>
      </div>

      <!-- Historial de Cultos -->
        <DataTable 
        v-else-if="showHistoryService"
          :value="cultos" 
          v-model:selection="selectedService"
          @rowSelect="showInfoEvent"
          stripedRows
          paginator 
          :rows="10" 
          selectionMode="single"
          class="w-full border-collapse" tableStyle="min-width: 40rem; max-height: 80rem;"
        >
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-2xl sm:text-3xl font-semibold text-second-800">Cultos Programados</h2>
            <div class="flex items-center gap-2">     
              <Calendar 
              :input-class="['border border-gray-300 rounded-md px-2 py-1 w-auto']"
              class=" w-auto" 
              showIcon 
              v-model="date" 
              placeholder="dd/mm/yyyy-dd/mm/yyyy"/>                

              <button
                @click="toggleHistory"
                class="mt-2 sm:mt-0 bg-primary-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105 text-sm sm:text-base">
                {{ historyButtonText }}
              </button>
              <button
                @click="addWorshipService"
                class="mt-2 sm:mt-0 bg-primary-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105 text-sm sm:text-base">
                Agregar Culto
            </button>
          </div>
          </div>

        </template>
          <Column field="sermon_tittle" header="Titulo del Sermon" class="border-b border-primary-200 text-second-800"></Column>
          <Column field="worship_name" header="Tipo de Culto" class="  border-b border-primary-200 text-second-800"></Column>
          <Column field="date" header="Fecha" class="border-b border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.date">
                {{ formatDate(slotProps.data.date) || 'No definido' }}
              </Tag>
            </template>
          </Column>
          <Column field="description" header="Descripción" class="border-b border-primary-200 text-second-800"></Column>
        </DataTable>

      <!-- Componente para agregar culto -->
      <AddWorshipService
        v-if="showAddWorshipService"
        @close="closeAddWorhipService"
        @worshipServiceAdded="worshipServices"
      />
      <EditInfoCard 
        v-if="showEditService"
        :worshipService="selectedService"
        @close="showEditService = false"
        @worshipServiceEdited="worshipServices"
      />

  </section>
</template>

<script>
import { getWorshipServices } from '@/apiServices';
import AddWorshipService from '../components/Church/AddWorshipService.vue';
import InfoWorshipService from '../components/Church/InfoWorshipService.vue';
import EditInfoCard from '@/components/Church/EditWorshipService.vue';
import DataTable from 'primevue/datatable';
import DataView from 'primevue/dataview';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Calendar from 'primevue/calendar';

export default {
  components: {
    AddWorshipService,
    EditInfoCard,
    InfoWorshipService,
    DataTable,
    DataView,
    Column,
    Tag,
    Calendar,
  },
  data() {
    return {
      showAddWorshipService: false,
      showHistoryService: false,
      showInfoService: false,
      showEditService: false,
      historyButtonText: 'Ver Historial de Cultos',
      searchQuery: '',
      selectedService: null,
      message: null,
      cultos: [],
      date: null,
    };
  },
  methods: {
    addWorshipService() {
      this.showAddWorshipService = true;
    },
    showInfoEvent(event) {
      this.selectedService = event.data;
      this.showInfoService = true;
    },
    toggleHistory() {
      this.showHistoryService = !this.showHistoryService;
      this.historyButtonText = this.showHistoryService ? 'Cultos del Mes' : 'Historial de Cultos';
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
    showEdit(selectedService) {
      this.selectedService = selectedService;
      this.showEditService = true;
    },
    showInfo(selectedService) {
      this.selectedService = selectedService;
      this.showInfoService = true;
    },
    async worshipServices() {
      try {
        this.cultos = await getWorshipServices();
      } catch (error) {
        console.error(error);
      }
    },
  },
  async mounted() {
    await this.worshipServices();
  },
};
</script>

<style scoped>
.bg-image {
  background-image: url('../assets/vid.png');
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
