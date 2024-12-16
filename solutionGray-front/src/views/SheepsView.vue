<template>
  <section class="min-h-screen container">
    <!-- Heading and Verse -->
    <div class="mb-6 container text-center">
      <p class="text-primary-900 text-2xl sm:text-3xl font-serif">
        <strong>
          Y el Señor añadía cada día al número de ellos los que iban siendo salvos. Hechos 2:47
        </strong>
      </p>
    </div>
    <div v-if="sheepInfoById">
      <SheepInfoCard v-if="sheepInfoById" :sheep="sheepInfoById" @close="sheepInfoById = null" />
    </div>
    <!-- Ovejas Section -->
    <div v-else class="p-4 sm:p-6 shadow-md bg-second-50 shadow-second-600 rounded-md h-auto">
      <h1 class="text-3xl sm:text-5xl mb-4 text-second-800">
        <strong>Ovejas</strong>
      </h1>
      <h2 class="text-second-800 text-xl sm:text-2xl mb-2">
        <strong>Estadísticas e Información de Iglesia</strong>
      </h2>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
        <button class="bg-primary-500 text-white p-2 rounded-md" @click="getSheeps">
          Actualizar
        </button>
        <button class="bg-primary-500 text-white p-2 rounded-md" @click="addSheeps">
          Agregar
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-6 space-y-4">
        <div class="animate-pulse">
          <div class="h-6 bg-gray-300 rounded mb-4"></div>
          <div class="h-4 bg-gray-300 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
        </div>
      </div>

      <!-- DataTable -->
      <div v-else class="overflow-x-auto ">
        <DataTable 
          :value="sheepsInfo" 
          paginator
          rows="10"
          selectionMode="single"
          v-model:selection="sheepInfoById"
          @rowSelect="handleSheepInfo"
          class="w-full" 
          tableStyle="min-width: 60rem"
          >
          <!-- Table Columns -->
          <Column field="first_name" header="Primer Nombre" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="last_name" header="Primer Apellido" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="email" header="Email" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="description" header="Descripción" class="p-2 text-center border-b border-primary-200 text-second-800"></Column>
          
          <!-- Custom Date Columns with Formatting -->
          <Column field="arrival_date" header="Fecha de inicio" class="p-4 text-center border-b border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.arrival_date">
                {{ formatDate(slotProps.data.arrival_date) }}
              </Tag>
            </template>
          </Column>
          <Column field="last_visit" header="Última Visita" class="p-4 text-center border-b border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.last_visit">
                {{ formatDate(slotProps.data.last_visit) }}
              </Tag>
            </template>
          </Column>

          <!-- Status Column -->
          <Column field="status" header="Estado" class="p-4 text-center border-b border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.status" class="p-2 text-center border-b rounded-md bg-green-200 text-green-900 uppercase">
                <strong>{{ slotProps.data.status }}</strong>
              </Tag>
            </template>
          </Column>

        </DataTable>
      </div>
    </div>

    <!-- Modals for Adding and Viewing Sheep -->
    <AddSheepCard v-if="newSheepVisible" @close="newSheepVisible = false" />
    
  </section>
</template>

<script>
import { getSheeps, getSheepById } from '../apiServices/index';
import SheepInfoCard from '../components/Sheeps/SheepInfoCard.vue';
import AddSheepCard from '../components/Sheeps/AddSheepCard.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

export default {
  components: {
    DataTable,
    Column,
    Tag,
    SheepInfoCard,
    AddSheepCard,
  },
  data() {
    return {
      sheepsInfo: [],
      newSheepVisible: false,
      sheepInfoById: null,
      loading: true,
    };
  },
  methods: {
    async getSheeps() {
      this.loading = true;
      try {
        this.sheepsInfo = await getSheeps();
      } finally {
        this.loading = false;
      }
    },
    addSheeps() {
      this.newSheepVisible = !this.newSheepVisible;
    },
    async handleSheepInfo(event) {
      try {
        const sheepsInfo = await getSheepById(event.data.id);
        this.sheepInfoById = sheepsInfo;
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  },
  mounted() {
    this.getSheeps();
  },
};
</script>
