<template>
    <div v-if="sheep" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-second-50 p-8 rounded shadow-md shadow-primary-700 w-[70vh]">
        <h2 class="text-3xl font-bold mb-8 text-second-900">Informacion por editar de {{ sheep.name }}</h2>
        <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col">
              <label class="text-second-900" for="email"><strong>Email: </strong></label>
              <input v-model="sheep.email" 
                id="email" 
                type="text" 
                placeholder="Email" 
                class="rounded-md bg-second-200 p-1 text-second-950 outline-1 outline-second-500">
            </div>  
            <div class="flex flex-col">
              <label for="status" class="text-second-900"><strong>Estado: </strong></label>
              <input v-model="sheep.status" 
                id="status" 
                type="text" 
                placeholder="Estado" 
                class="rounded-md bg-second-200 p-1 text-second-950 outline-1 outline-second-500">
            </div>  
            <div class="flex flex-col">
                <label for="arrival-date" class="text-second-900"><strong>Fecha de Ingreso:</strong></label>
                <p id="arrival-date" class="rounded-md bg-second-200 p-1 text-second-950 ">{{ formatDate(sheep.arrival_date) }}</p>
            </div>
        </div>
        <div class="flex flex-col gap-2">

          <div class="flex flex-col">
              <label for="last_visit" class="text-second-900"><strong>Ultima Visita:</strong></label>
              <p id="last_visit" class="rounded-md bg-second-200 p-1 text-second-950 ">{{ formatDate(sheep.last_visit) }}</p>
            </div>
            <div class="flex flex-col">
                <label for="cuantity_visits" class="text-second-900"><strong>Cantidad de Visitas:</strong></label>
                <p id="cuantity_visits" class="rounded-md bg-second-200 p-1 text-second-950 ">{{sheep.cuantity_visits}}</p>
            </div>
            <div class="flex flex-col">
              <label for="progress" class="text-second-900"><strong>Progreso: </strong></label>
              <textarea
                v-model="sheep.description"
                id="progress"
                placeholder="Progreso"
                rows="3"
                class="rounded-md bg-second-200 p-1 text-second-950 outline-1 outline-second-500 focus:border-second-800 focus:outline-none resize-none">
              </textarea>
            </div>  
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
  