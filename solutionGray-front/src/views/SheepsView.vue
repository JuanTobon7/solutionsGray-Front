<template>
  <section class="h-screen container">
    <!-- Encabezado principal y versículo -->
    <div class="mb-6 container text-center">
      <p class="text-primary-900 text-2xl sm:text-3xl font-serif">
        <strong>
          Y el Señor añadía cada día al número de ellos los que iban siendo salvos. Hechos 2:47
        </strong>
      </p>
    </div>

    <!-- Vista de detalle de Oveja seleccionada -->
    <div v-if="sheepInfoById">
      <SheepInfoCard 
        :sheep="sheepInfoById" 
        @close="sheepInfoById = null" 
      />
    </div>

    <!-- Sección principal -->
      

      <!-- Skeleton Loader -->
      <div v-if="loading" class="p-6 space-y-4">
        <div class="animate-pulse">
          <div class="h-6 bg-gray-300 rounded mb-4"></div>
          <div class="h-4 bg-gray-300 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>

      <!-- DataTable -->
      <div v-else-if="sheepInfoById == null" class="overflow-x-auto">
        <DataTable 
          :value="sheepsInfo" 
          paginator
          rows="10"
          selectionMode="single"
          v-model:selection="sheepInfoById"

          @rowSelect="handleSheepInfo"
          class="w-full"
        >
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <h1 class="text-3xl text-second-900 font-bold">Ovejas</h1>
            <div class="flex items-center gap-2">      
              <button @click="getSheeps" class="bg-second-500 text-white p-2 rounded-full material-symbols-outlined">
                refresh
              </button>
              <button @click="openAddSheep" class="bg-second-500 text-white p-2 rounded-full material-symbols-outlined">
                person_add
              </button>
            </div>
          </div>
        </template>
          <!-- Columnas -->
          <Column field="first_name" header="Primer Nombre" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="last_name" header="Apellido" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="email" header="Email" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="description" header="Descripción" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>

          <!-- Columnas Personalizadas -->
          <Column field="arrival_date" header="Fecha de Ingreso" class="p-4 text-center border-b border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.arrival_date">
                {{ formatDate(slotProps.data.arrival_date) || 'No definido' }}
              </Tag>
            </template>
          </Column>
          <Column field="last_visit" header="Última Visita" class="p-4 text-center border-b border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.last_visit">
                {{ formatDate(slotProps.data.last_visit) || 'No definida' }}
              </Tag>
            </template>
          </Column>
          <Column field="status" header="Estado" class="p-4 text-center border-b border-primary-200">
            <template #body="slotProps">
              <Tag 
                :value="slotProps.data.status" 
                class="p-2 rounded-md bg-green-200 text-green-900 uppercase"
              >
                {{ slotProps.data.status || 'Activo' }}
              </Tag>
            </template>
          </Column>
        </DataTable>
      </div>

    <!-- Modal para agregar nueva oveja -->
    <AddSheepCard 
      v-if="newSheepVisible" 
      @close="newSheepVisible = false" 
    />
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
        console.log(event.data);
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
    openAddSheep() {
      this.newSheepVisible = true;
    },
  },
  mounted() {
    this.getSheeps();
  },
};
</script>
