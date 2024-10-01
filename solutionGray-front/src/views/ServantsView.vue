<template>
  <section class="h-screen container">
    <div class="mb-6 container">
      <p class="text-primary-900 text-xl sm:text-2xl font-serif"><strong>Rogad, pues, al Señor de la mies, que envíe obreros a su mies. Mateo 9:38</strong></p>
    </div>
    <div class="p-2 shadow-md bg-second-50 shadow-second-600 rounded-md h-auto">
      <h1 class="text-3xl sm:text-5xl mb-4 text-second-800"><strong>Servidores</strong></h1>
      <h2 class="text-xl sm:text-2xl mb-2 text-second-800"><strong>Estadísticas e Información de los servidores</strong></h2>
      <div class="flex flex-col sm:flex-row gap-2 mb-4">
        <button class="bg-primary-500 text-white p-2 rounded-md">Actualizar</button>
        <button @click="addServants" class="bg-primary-500 text-white p-2 rounded-md">Invitar</button>
      </div>

      <div v-if="loading" class="p-6 space-y-4">
        <div class="animate-pulse">
          <div class="h-6 bg-gray-300 rounded mb-4"></div>
          <div class="h-4 bg-gray-300 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
        </div>
      </div>

      <div v-else class="p-4 sm:p-6 overflow-x-auto">
        <DataTable 
          :value="servantsInfo" 
          class="w-full border-collapse" 
          tableStyle="min-width: 40rem;"
        >           
          <Column field="first_name" header="Primer Nombre" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="last_name" header="Primer Apellido" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="email" header="Email" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="usual_rol" header="Rol Habitual" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.usual_rol">
                {{ slotProps.data.usual_rol || 'No definido' }}
              </Tag>
            </template>
          </Column>
          <Column field="last_service" header="Último Servicio" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.last_service">
                {{ formatDate(slotProps.data.last_service)  || 'No definido'}}
              </Tag>
            </template>
          </Column> 
          <Column field="last_course" header="Último Curso" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.last_course">
                {{ slotProps.data.last_course || 'No definido' }}
              </Tag>
            </template>
          </Column>
          <Column field="status_course" header="Estado del Curso" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.status_course" class="p-2 text-center border-b rounded-md bg-green-200 text-green-900 uppercase">
                <strong> {{ slotProps.data.status_course }} </strong>
              </Tag>
            </template>
          </Column>
          <Column field="Información" header="Información" class="p-2 sm:p-4 text-center border-b border-primary-200">
            <template #body="slotProps">
              <i @click="handleServantsInfo(slotProps.data.id)" class="material-symbols-outlined cursor-pointer">info</i>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <AddServantCard 
      v-if="newServantsVisible" 
      @close="closeAddServantCard" 
    />
  </section>
</template>

<script>
import { getServants, getServantById} from '../apiServices/index'
import AddServantCard from '@/components/Servants/AddServantCard.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

export default {
  components: {
    DataTable,
    Column,
    Tag,
    AddServantCard
  },
  data() {
    return {
      servantsInfo: [],
      newServantsVisible: false,
      servantInfoById: null,
      loading:true
    };
  },
  methods: {
    async getServants() {
      this.servantsInfo = await getServants();
      this.loading = false;
    },
    addServants() {
      this.newServantsVisible = true;
    },
    closeAddServantCard() {
      this.newServantsVisible = false;
    },
    async handleServantsInfo(id) {
      try{
        const servantInfoById = await getServantById(id);
        this.servantInfoById = servantInfoById;
      }catch(error){
        console.log(error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  mounted() {
    this.getServants();
  }
};
</script>