<template>
  <div v-if="loading" class="p-6 space-y-4">
    <div class="animate-pulse">
      <div class="h-6 bg-gray-300 rounded mb-4"></div>
      <div class="h-4 bg-gray-300 rounded mb-2"></div>
      <div class="h-4 bg-gray-300 rounded mb-2"></div>
      <div class="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
    </div>
  </div>

  <div v-else class="p-6">
    <div v-if="message" class="text-center text-3xl text-primary-800 p-4">
      <p>{{ message }}</p>
      <span class="text-8xl material-symbols-outlined mb-4 text-primary-900">
        sentiment_dissatisfied
      </span>
    </div>
    
    <div v-else>
      <DataTable 
        :value="people" 
        class="w-full border-collapse" 
        paginator 
        :rows="10" 
        filterDisplay="menu"
        selectionMode="single"
        :selection="selectedPerson" 
        @update:selection="onPersonSelected" 
        dataKey="id"
        tableStyle="min-width: 50rem"
      >           
        <Column field="first_name" header="Primer Nombre"></Column>
        <Column field="last_name" header="Primer Apellido"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="type_person" header="Tipo de Persona"></Column>
        <Column field="phone" header="Número de Celular"></Column>           
      </DataTable>
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { getPeople } from '@/apiServices/index';
import store from '@/store';

export default {
  components: {
    DataTable,
    Column,
  },
  data() {
    return {
      loading: true,
      people: [],
      selectedPerson: null, // Variable para almacenar la persona seleccionada
      message: ''
    };
  },
  methods: {
    async getPeople() {
      try {
        this.loading = true;
        const response = await getPeople();
        this.people = response;
      } catch (error) {
        this.message = error.response.data.message;
      } finally {
        this.loading = false;
      }
    },
    onPersonSelected(person) {
      this.selectedPerson = person;
      store.dispatch('selectPerson', person);
    }
  },
  mounted() {
    this.getPeople();
  }
};
</script>
