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
      <DataTable 
        :value="people" 
        class="w-full border-collapse" 
        paginator 
        :rows="10" 
        filterDisplay="menu"
        selectionMode="single"
        v-model:selection="selectedGuide" 
        @update:selection="onGuideSelected" 
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
  </template>
  
  
  <script>
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import {getServants} from '@/apiServices/index'
  
  export default {
   components: {
       DataTable,
       Column,
   },
   data() {
       return {
           loading: true,
           people: [],
           selectedGuide: null, // Variable para almacenar la persona seleccionada
       }
   },
   methods: {
       async getServants() {
           this.loading = true;
           const response = await getServants();
           this.people = response
           this.loading = false;
       },
       onGuideSelected(guide) {
           this.$store.dispatch('selectGuide', guide);
       }
   },
   mounted() {
       this.getServants();
   }
  }
  </script>
  