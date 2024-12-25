<template>
    <div class="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Reuniones del Grupo</h2>
      <ul>
        <li v-for="(event, index) in events" :key="index" class="mb-2">
          {{ event }}
        </li>
      </ul>
      <button
        @click="$emit('close')"
        class="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 mt-4"
      >
        Cerrar
      </button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        events: [
          "Reunión de planificación - 12 de enero",
          "Seminario espiritual - 19 de enero",
        ],
      };
    },
  };
  </script>
  