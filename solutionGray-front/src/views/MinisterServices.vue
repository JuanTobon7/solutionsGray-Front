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
    <div class="flex items-center gap-2 mb-4 w-full">
      <label for="search" class="text-second-800 text-xl">Buscar</label>
      <input type="text" id="search" placeholder="Buscar" class="p-2 border border-gray-300 rounded-md w-1/2 outline-none bg-second-50" />
      <button @click="toggleHistory" class="right-0 bg-primary-500 text-white p-2 rounded-md">
        {{ historyButtonText }}
      </button>
      <button @click="addWorshipService" class="right-0 bg-primary-500 text-white p-2 rounded-md">Agregar Culto</button>
    </div>

    <!-- Cultos Programados -->
    <div v-if="cultos.length > 0 && !showHistoryService" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="items in cultos" :key="items.id" class="w-full z-100">
        <div class="shadow-md shadow-second-500 rounded-lg bg-second-50 transition-transform duration-200 hover:-translate-y-2">
          <div class="flex flex-col overflow-hidden rounded-md">
            <div>
              <img src="../assets/vid.png" alt="Culto Image" class="w-full h-48 object-cover" />
            </div>
            <div class="p-4 flex flex-col justify-between gap-1">
              <h2 class="text-3xl text-second-900 font-bold mb-2"><strong>{{ items.tittleSermon }}</strong></h2>
              <h3 class="text-2xl text-second-800 font-bold mb-2"><strong>{{ items.name }}</strong></h3>
              <span class="text-2xl text-gray-800">{{ formatDate(items.date) }}</span>
              <span>
                <p class="text-gray-800">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus quaerat excepturi dolore</p>
              </span>
            </div>
            <div class="bg-second-700 p-2 flex">
              <button class="w-full text-second-100 font-bold cursor-pointer">Ver información</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de no hay cultos programados -->
    <div v-else-if="cultos.length === 0" class="flex flex-col items-center justify-center h-96">
      <span class="text-8xl material-symbols-outlined mb-4 text-primary-900">
        sentiment_dissatisfied
      </span>
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
  </section>
</template>

<script>
import { getWorshipServices } from '@/apiServices';
import AddWorshipService from '../components/Church/AddWorshipService.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

export default {
  components: {
    AddWorshipService,
    DataTable,
    Column,
    Tag,
  },
  data() {
    return {
      showAddWorshipService: false,
      showHistoryService: false,
      historyButtonText: 'Ver Historial de Cultos',
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
      const options = { month: 'long', day: 'numeric', weekday: 'long',hour: 'numeric', minute: 'numeric' };
      let dateFormated = date.toLocaleDateString('es-ES', options);
      dateFormated = dateFormated.charAt(0).toUpperCase() + dateFormated.slice(1);
      return dateFormated.replace(/,/g, ' ');
    },
    async worshipServices() {
      try {
        const response = await getWorshipServices();
        if (response.length === 0) {
          this.message = 'No hay cultos programados';
        }
        this.cultos = response;
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

<style scoped></style>
