<template>
  <section class="h-screen container">
    <!-- Encabezado principal y versículo -->
    <div class="mb-6 container text-center">
      <h1 class="text-3xl sm:text-5xl mb-4 text-second-800 text-center"><strong>Ovejas</strong></h1>
      <h2 class="text-xl sm:text-2xl text-second-800 text-center mb-6"><strong>Estadísticas e Información de las ovejas</strong></h2>
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
        :mySheep="isMySheep"
        @close="sheepInfoById = null" 
      />
    </div>

    <!-- Sección principal -->
    <div v-else>
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
      <div v-else class="overflow-x-auto">
        <DataTable 
          :value="sheepsInfo" 
          paginator
          :rows=10
          stripedRows
          selectionMode="single"
          v-model:selection="sheepInfoById"
          @rowSelect="handleSheepInfo"
          class="w-full"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h1 class="text-3xl text-second-900 font-bold">Ovejas</h1>
              <div class="flex items-center gap-2">
                <!-- Botón Actualizar -->
                
                <!-- Botón Mis Ovejas -->
                <button 
                    @click="toggleFavorites" 
                    class="bg-second-500 text-white p-2 rounded-full flex items-center gap-1"
                  >
                    <span class="material-symbols-outlined">
                      {{ showFavorites ? 'group' : 'favorite' }}
                    </span>
                    <span>{{ showFavorites ? 'Todas' : 'Mis Ovejas' }}</span>
                  </button>
                <button @click="getSheeps" class="bg-second-500 text-white p-2 rounded-full material-symbols-outlined">
                  refresh
                </button>
                <!-- Botón Agregar Oveja -->
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
    </div>

    <!-- Modal para agregar nueva oveja -->
    <AddSheepCard 
      v-if="newSheepVisible" 
      @close="newSheepVisible = false"
    />
  </section>
</template>

<script>
import { getSheeps, getMySheeps, getSheepById } from '../apiServices/index';
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
      sheepsInfo: [],          // Lista de ovejas
      isMySheep: false,
      newSheepVisible: false,  // Modal para agregar ovejas
      sheepInfoById: null,     // Detalle de oveja seleccionada
      loading: true,           // Estado de carga
      showFavorites: false,    // Alternador entre favoritos y todas las ovejas
    };
  },
  methods: {
    async getSheeps() {
      this.loading = true;
      try {
        this.sheepsInfo = await getSheeps();
        this.isMySheep = false;
      }catch(e){
        if(e.response.status === 401 && e.resposnse.data.message === 'Token has expired'){
          this.$toast.add({severity:'error', summary:'Error', detail:'Ups algo paso, intentalo de nuevo', life: 3000});
        }
      }
       finally {
        this.loading = false;
      }
    },
    async getMySheeps() {
      this.loading = true;
      try {
        this.sheepsInfo = await getMySheeps();
        this.isMySheep = true;
      } catch(e){
        if(e.response.status === 401 && e.resposnse.data.message === 'Token has expired'){
          this.$toast.add({severity:'error', summary:'Error', detail:'Ups algo paso, intentalo de nuevo', life: 3000});
        }
      }finally {
        this.loading = false;
      }
    },
    toggleFavorites() {
      // Alterna entre mostrar favoritos (mis ovejas) y todas las ovejas
      this.showFavorites = !this.showFavorites;
      if (this.showFavorites) {
        this.getMySheeps(); // Cargar favoritos
      } else {
        this.getSheeps();   // Cargar todas las ovejas
      }
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
    openAddSheep() {
      this.newSheepVisible = true;
    },
  },
  mounted() {
    this.getSheeps(); // Cargar todas las ovejas inicialmente
  },
};
</script>