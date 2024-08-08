<template>
    <section class="h-screen p-8 container">
      <div class="mb-6 container">
        <p class="text-primary-900 text-3xl font-serif"><strong>Y el Señor añadía cada día al número de ellos los que iban siendo salvos. Hechos 2:47</strong></p>
      </div>
      <div class="p-2 shadow-md bg-second-50 shadow-second-600 rounded-md h-auto">
        <h1 class="text-5xl mb-4 text-second-800"><strong>Ovejas</strong></h1>
        <h2 class="text-second-800 text-2xl mb-2"><strong>Estadísticas e Información de Iglesia</strong></h2>
          <button class="bg-primary-500 text-white p-2 rounded-md mr-2" @click="getSheeps">Actualizar</button>
          <button class="bg-primary-500 text-white p-2 rounded-md" @click="addSheeps">Agregar</button>
        <div class="p-6">
          <DataTable :value="sheepsInfo" class="w-full border-collapse" tableStyle="min-width: 80rem">
            <Column field="name" header="Nombre" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
            <Column field="email" header="Email" class="p-4 text-center border-b  border-primary-200 text-second-800"></Column>
            <Column field="description" header="Descripcion" class="p-2 text-center text-second-800 border-b  border-primary-200"></Column>
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
          </DataTable>
        </div>
      </div>
      <AddSheepCard v-if="newSheepVisible" @close="newSheepVisible = false" />
      <SheepInfoCard v-if="sheepInfoById" :sheep="sheepInfoById" @close="sheepInfoById = null" />
    </section>
  </template>
  
  <script>
  import { getSheeps,getSheepById } from '../apiServices/index'
  import SheepInfoCard from '../components/Sheeps/SheepInfoCard.vue'
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
      AddSheepCard
    },
    data() {
      return {
        sheepsInfo: [],
        newSheepVisible: false,
        sheepInfoById: null
      };
    },
    methods: {
      async getSheeps() {
        this.sheepsInfo = await getSheeps();
      },
      addSheeps() {
        this.newSheepVisible = !this.newSheepVisible;
      },
      async handleSheepInfo(id) {
        try{
          const sheepsInfo = await getSheepById(id);
          this.sheepInfoById = sheepsInfo;

        }catch(error){
          console.log(error);
        }
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