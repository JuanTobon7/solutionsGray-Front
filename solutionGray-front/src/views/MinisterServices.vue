<template>
  <section class="min-h-screen sm:pt-8 container w-full">
    <div v-if="showInfoService">
      <InfoWorshipService 
        :worshipService="selectedService"  
        @close="showInfoService = false"
      />
    </div>
    <div v-else>
      <div class="mb-6 text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl mb-4 text-second-800">
          <strong>Cultos Programados</strong>
        </h1>
        <p class="text-primary-900 text-xl sm:text-2xl font-serif mb-1">
          <strong>Yo me alegré con los que me decían: A la casa de Jehová iremos. Salmos 122:1</strong>
        </p>
      </div>

      <!-- Barra de búsqueda y botones -->
      <div class="flex flex-col sm:flex-row items-center gap-2 mb-4 w-full">
        <label for="search" class="text-second-800 text-lg sm:text-xl">Buscar</label>
        <input
          type="text"
          id="search"
          placeholder="Buscar"
          class="p-2 border border-gray-300 rounded-md w-full outline-none bg-second-50"
        />
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

      <!-- Cultos Programados -->
      <div v-if="cultos.length > 0 && !showHistoryService" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <div v-for="items in cultos" :key="items.id" class="w-full">
          <Card 
            class="transition-transform duration-200 hover:-translate-y-2 shadow-md shadow-gray-400 rounded-lg sm:rounded-2xl cursor-pointer" 
            style="width: 100%; overflow: hidden"
            @click="showInfo(items)"
          >
            <!-- Imagen de fondo -->
            <template #header>
              <div class="relative w-full h-36 sm:h-48 bg-cover bg-center bg-image">
                
              </div>
            </template>
          
            <!-- Título y subtítulo -->
            <template #title>
              <h2 class="text-lg sm:text-2xl font-semibold text-second-900">{{ items.sermon_tittle }}</h2>
            </template>
            <template #subtitle>
              <h3 class="text-base sm:text-xl text-second-800">{{ items.worship_name }}</h3>
            </template>
          
            <!-- Contenido -->
            <template #content>
              <div class="flex flex-col">
                <!-- Fecha y hora con icono -->
                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                  <i class="material-symbols-outlined text-gray-700">event</i>
                  <span class="text-base sm:text-xl text-gray-800">{{ formatDate(items.date) }}</span>
                </div>
                <!-- Descripción con efecto hover y tooltip -->
                <div class="flex items-center gap-2 text-gray-800">
                  <span class="material-symbols-outlined">book</span>
                  <!-- Ajustar texto largo -->
                  <p class="whitespace-normal break-words overflow-hidden text-sm sm:text-base">{{items.description }}</p>
                </div>
              </div>
            </template>
          
            <!-- Footer -->
            
          </Card>
        </div>
      </div>

      <!-- Mensaje de no hay cultos programados -->
      <div v-else-if="cultos.length === 0" class="flex flex-col items-center justify-center h-64 sm:h-96">
        <span class="text-6xl sm:text-8xl material-symbols-outlined mb-4 text-primary-900">sentiment_dissatisfied</span>
        <p class="text-xl sm:text-2xl text-second-800">No hay cultos programados en este momento.</p>
        <p class="text-lg sm:text-xl text-gray-600 mt-2 text-center">Por favor, vuelve más tarde o agrega un nuevo culto.</p>
      </div>

      <!-- Historial de Cultos -->
      <div v-else class="p-2 shadow-md bg-second-50 shadow-second-600 rounded-md h-auto overflow-x-auto">
        <DataTable 
          :value="cultos" 
          v-model:selection="selectedService"
          @rowSelect="showInfoEvent"
          paginator 
          :rows="10" 
          selectionMode="single"
          class="w-full border-collapse" tableStyle="min-width: 40rem; max-height: 80rem;"
        >
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
      </div>

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
    </div>
  </section>
</template>

<script>
import { getWorshipServices } from '@/apiServices';
import AddWorshipService from '../components/Church/AddWorshipService.vue';
import InfoWorshipService from '../components/Church/InfoWorshipService.vue';
import EditInfoCard from '@/components/Church/EditWorshipService.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Card from 'primevue/card';

export default {
  components: {
    AddWorshipService,
    EditInfoCard,
    InfoWorshipService,
    DataTable,
    Column,
    Tag,
    Card,
  },
  data() {
    return {
      showAddWorshipService: false,
      showHistoryService: false,
      showInfoService: false,
      showEditService: false,
      historyButtonText: 'Ver Historial de Cultos',
      selectedService: null,
      message: null,
      cultos: [],
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
      this.historyButtonText = this.showHistoryService ? 'Mostrar Cultos del Mes' : 'Ver Historial de Cultos';
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
