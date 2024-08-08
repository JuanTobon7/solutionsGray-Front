<template>
  <section class="h-screen p-8 container">
    <div class="mb-6 container">
      <p class="text-primary-900 text-3xl font-serif"><strong>
        Apacentad la grey de Dios que está entre vosotros, cuidando de ella, no por fuerza, sino voluntariamente; no por ganancia deshonesta, sino con ánimo pronto; 1 Pedro 5:2</strong></p>
    </div>
    <div class="p-2 shadow-md bg-second-50 shadow-second-600 rounded-md h-auto">
      <h1 class="text-5xl mb-4 text-second-800"><strong>Tus ovejas</strong></h1>
      <h2 class="text-second-800 text-2xl mb-2"><strong>Estadísticas e Información de tus Ovejas</strong></h2>
      <div class="p-6">
        <DataTable :value="sheepsInfo" class="w-full border-collapse" tableStyle="min-width: 80rem">
          <Column field="name" header="Nombre" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="email" header="Email" class="p-4 text-center border-b  border-primary-200 text-second-800"></Column>
          <Column field="description" header="Description" class="p-2 text-center text-second-800 border-b  border-primary-200"></Column>
          <Column field="arrival_date" header="Fecha de inicio" class="p-4 text-center border-b  border-primary-200 text-second-800">
            <template #body="slotProps">
              <Tag :value="slotProps.data.arrival_date">
                {{ formatDate(slotProps.data.arrival_date) }}
              </Tag>
            </template>
        </Column> 
        <Column field="last_visit" header="Ultima Visita" class="p-4 text-center border-b  border-primary-200 text-second-800">
          <template #body="slotProps">
              <Tag :value="slotProps.data.last_visit">
                {{ formatDate(slotProps.data.last_visit) }}
              </Tag>
            </template>
        </Column>
          <Column field="status" header="Estado" class="p-4 text-center border-b  border-primary-200 text-second-800">
          <template #body="slotProps">
              <Tag :value="slotProps.data.status" class="p-2 text-center border-b rounded-md bg-green-200 text-green-900 uppercase">
                <strong> {{ slotProps.data.status }} </strong>
              </Tag>
            </template>
          </Column>
          <Column field="Información" header="Informacion" class="p-4 text-center border-b  border-primary-200 ">
            <template #body="slotProps">
              <i @click="handleSheepInfo(slotProps.data.id)" class="material-symbols-outlined cursor-pointer">info</i>
            </template>
          </Column>
          <Column field="Acciones" header="Acciones" class="p-4 text-center border-b border-primary-200">
            <template #body="slotProps">
              <div class="flex items-center justify-around text-xl">
                <i @click="editInfoSheep(slotProps.data.id)" class="material-symbols-outlined cursor-pointer text-yellow-500">edit</i>
                <i class="material-symbols-outlined cursor-pointer text-red-600">delete</i>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    <SheepInfoCard v-if="showSheepInfoCard" :sheep="sheepInfoById" @close="closeSheepInfoCard" />
    <EditInfoCard v-if="showEditInfoCard" :sheep="sheepInfoById" @close="closeEditInfoCard" />
  </section>
</template>

<script>
import { getMySheeps,getSheepById } from '../apiServices/index'
import SheepInfoCard from '@/components/Sheeps/SheepInfoCard.vue';
import EditInfoCard from '@/components/Sheeps/EditInfoCard.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

export default {
  components: {
    DataTable,
    EditInfoCard,
    SheepInfoCard,
    Column,
    Tag,
  },
  data() {
    return {
      sheepsInfo: [],
      sheepInfoById: null,
      showSheepInfoCard: false,
      showEditInfoCard: false,
    };
  },
  methods: {
    async getSheeps() {
      this.sheepsInfo = await getMySheeps();
    },
    async handleSheepInfo(id) {
      try{
        const sheepsInfo = await getSheepById(id);
        this.sheepInfoById = sheepsInfo;
        this.showSheepInfoCard = true;
        this.showEditInfoCard = false;
      }catch(error){
        console.log(error);
      }
    },
    async editInfoSheep(id) {
      try {
        const sheepInfo = await getSheepById(id);
        this.sheepInfoById = sheepInfo;
        this.showEditInfoCard = true;
        this.showSheepInfoCard = false;
      } catch (error) {
        console.log(error);
      }
    },
    closeSheepInfoCard() {
      this.showSheepInfoCard = false;
      this.sheepInfoById = null;
    },
    closeEditInfoCard() {
      this.showEditInfoCard = false;
      this.sheepInfoById = null;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  mounted() {
    this.getSheeps();
  }
};
</script>

<style scoped>
tr:hover{
@apply bg-white
}
</style>