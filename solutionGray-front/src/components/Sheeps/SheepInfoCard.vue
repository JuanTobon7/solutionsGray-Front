<template>
    <div v-if="sheep" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-second-50 p-8 rounded shadow-md shadow-primary-700 w-[50vh] animate-fade-down animate-once animate-duration-[300ms]  animate-ease-linear">
        <h2 class="text-2xl font-bold mb-4 text-primary-900">{{ sheep.name }}</h2>
        <div class="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="flex-col gap-2">
          <p><strong>Email: </strong> {{ sheep.email }}</p>
          <p><strong>Estado: </strong> {{ sheep.status }}</p>
          <p><strong>Fecha de Ingreso: </strong> {{ formatDate(sheep.arrival_date) }}</p>
        </div>
        <div class="flex-col">
          <p><strong>Ultima Visita: </strong> {{ formatDate(sheep.last_visit) }}</p>
          <p><strong>Cantidad de Visitas: </strong>{{sheep.cuantity_visits}}</p>
          <p><strong>Progreso: </strong>{{ sheep.description }}</p>
        </div>
      </div>
      <button @click="$emit('close')" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
    </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      sheep: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
  };
  </script>
  
  <style scoped>
  p {
    @apply text-primary-900;
  }
  </style>
  