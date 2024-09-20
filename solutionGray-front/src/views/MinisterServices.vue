<template>
  <section class="min-h-screen p-8 container mx-auto">
    <div class="mb-6">
      <p class="text-primary-900 text-3xl font-serif mb-1">
        <strong>Yo me alegré con los que me decían: A la casa de Jehová iremos. Salmos 122:1</strong>
      </p>
      <h1 class="text-5xl mb-4 text-second-800">
        <strong>Cultos Programados</strong>
      </h1>
    </div>
    
    <!-- Barra de búsqueda y botones -->
    <div class="flex items-center gap-2 mb-4 w-full">
      <label for="search" class="text-second-800 text-xl">Buscar</label>
      <input
        type="text"
        id="search"
        placeholder="Buscar"
        class="p-2 border border-gray-300 rounded-md w-1/2 outline-none bg-second-50"
      />
      <button
        @click="toggleHistory"
        class="right-0 bg-primary-500 text-white p-2 rounded-md transition-transform duration-200 hover:scale-105">
        {{ historyButtonText }}
      </button>
      <button
        @click="addWorshipService"
        class="right-0 bg-primary-500 text-white p-2 rounded-md transition-transform duration-200 hover:scale-105">
        Agregar Culto
      </button>
    </div>

    <!-- Cultos Programados -->
    <div v-if="cultos.length > 0 && !showHistoryService" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="items in cultos" :key="items.id" class="w-full z-100">
        <Card class="transition-transform duration-200 hover:-translate-y-2 shadow-md shadow-gray-400 rounded-2xl" style="width: 100%; overflow: hidden">
          
          <!-- Imagen de fondo -->
          <template #header>
            <div class="relative w-full h-48 bg-cover bg-center bg-image">
              <div class="absolute top-0 right-0 p-2">
                <!-- Botón de editar estilizado -->
                <button
                  @click="showEdit(items)"
                  class="bg-white text-primary-600 border border-primary-500 py-1 px-2 rounded-full shadow-md hover:bg-primary-50 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-1 focus:ring-primary-300">
                  <i class="material-symbols-outlined text-2xl">edit</i>
                </button>
              </div>
            </div>
          </template>
        
          <!-- Título y subtítulo -->
          <template #title>
            <h2 class="text-2xl font-semibold text-second-900">{{ items.sermon_tittle }}</h2>
          </template>
          <template #subtitle>
            <h3 class="text-xl text-second-800">{{ items.worship_name }}</h3>
          </template>
        
          <!-- Contenido -->
          <template #content>
            <div class="flex flex-col ">
              <!-- Fecha y hora con icono -->
              <div class="flex items-center gap-3 mb-2">
                <i class="material-symbols-outlined text-gray-700">event</i>
                <span class="text-xl text-gray-800">{{ formatDate(items.date) }}</span>
              </div>
              <!-- Descripción con efecto hover y tooltip -->
              <div class="flex items-center gap-2 text-gray-800">
                <span class="material-symbols-outlined">book</span>
                <!-- Ajustar texto largo -->
                <p class="whitespace-normal break-words overflow-hidden">{{items.description }}</p>
              </div>
            </div>
          </template>
        
          <!-- Footer -->
          <template #footer>
            <div class="bg-second-700 p-2 flex w-full rounded-lg">
              <button @click="showInfo(items)" class="w-full text-second-100 font-bold cursor-pointer">Ver información</button>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Mensaje de no hay cultos programados -->
    <div v-else-if="cultos.length === 0" class="flex flex-col items-center justify-center h-96">
      <span class="text-8xl material-symbols-outlined mb-4 text-primary-900">sentiment_dissatisfied</span>
      <p class="text-2xl text-second-800">No hay cultos programados en este momento.</p>
      <p class="text-xl text-gray-600 mt-2">Por favor, vuelve más tarde o agrega un nuevo culto.</p>
    </div>

    <!-- Historial de Cultos -->
    <div v-else class="p-2 shadow-md bg-second-50 shadow-second-600 rounded-md h-auto">
      <DataTable :value="cultos" class="w-full border-collapse" tableStyle="min-width: 80rem; max-height: 80rem;">
        <Column field="name" header="Nombre" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
        <Column field="typeService" header="Tipo de Culto" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
        <Column field="date" header="Fecha" class="p-4 text-center border-b border-primary-200 text-second-800">
          <template #body="slotProps">
            <Tag :value="slotProps.data.date">
              {{ formatDate(slotProps.data.date) || 'No definido' }}
            </Tag>
          </template>
        </Column>
        <Column field="description" header="Descripción" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
      </DataTable>
    </div>

    <!-- Componente para agregar culto -->
    <AddWorshipService
      v-if="showAddWorshipService"
      @close="closeAddWorhipService"
      @worshipServiceAdded="worshipServices"
    />
    <InfoWorshipService 
      v-if="showInfoService" 
      :worshipService="selectedService"  
      @close="showInfoService = false"
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
  mounted() {
    this.worshipServices();
  },
};
</script>

<style scoped>
.bg-image{
  background-image: url('../assets/vid.png');
  background-repeat: no-repeat;
  background-position: top;  
}
</style>
