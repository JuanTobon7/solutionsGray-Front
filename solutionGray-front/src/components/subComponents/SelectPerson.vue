<template>
  <div v-if="loading" class="p-6 space-y-4">
    <div class="animate-pulse">
      <div class="h-6 bg-gray-300 rounded mb-4"></div>
      <div class="h-4 bg-gray-300 rounded mb-2"></div>
      <div class="h-4 bg-gray-300 rounded mb-2"></div>
      <div class="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
    </div>
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
        scrollable
        @update:selection="onPersonSelected" 
        dataKey="id"
        tableStyle="min-width: 50rem"
        emptyMessage="No hay personas registradas"
      >           
        <Column field="first_name" header="Primer Nombre" frozen></Column>
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
      } catch (e) {
        if(e.response.status === 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups intentalo de nuevo' });
        }
      } finally {
        this.loading = false;
      }
    },
    onPersonSelected(person) {
      this.selectedPerson = person;
      store.dispatch('selectPerson', person);
      this.$toast.add({severity: 'success', summary: 'Guía Espiritual Seleccionada', detail:'Persona seleccionada correctamente',life: 3000});
    }
  },
  mounted() {
    this.getPeople();
  }
};
</script>
