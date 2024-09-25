<template>
    <Card class="w-full max-w-md mx-auto shadow-lg">
      <div class="flex items-center space-x-4">
        <Avatar
          icon="pi pi-user"
          size="large"
          class="bg-blue-500 text-white"
        />
        <div>
          <h2 class="text-xl font-semibold">{{ servants.first_name }} {{ servants.last_name }}</h2>
          <p class="text-gray-500">{{ servants.email }}</p>
          <p class="text-gray-500">{{ servants.phone }}</p>
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-lg font-semibold">Información Adicional</h3>
        <ul class="text-gray-700">
          <li><strong>Servicio Usual:</strong> {{ servants.usual_roll || 'No asignado' }}</li>
          <li><strong>Último Servicio:</strong> {{ formatDate(servants.last_service) || 'N/A' }}</li>
          <li><strong>Guía de Ovejas:</strong> {{ servants.cuantity_sheeps_guide || 'N/A' }}</li>
          <li><strong>Estado del Curso:</strong> {{ servants.status_course || 'No inscrito' }}</li>
        </ul>
      </div>
    </Card>
  </template>
  
  <script>
  import  Card  from 'primevue/card';
  import  Avatar  from 'primevue/avatar';
  
  export default {
    name: 'ServerCard',
    components: {
      Card,
      Avatar,
    },
    props: {
      servants: {
        type: Object,
        required: true,
      },
    },
    methods: {
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Puedes agregar estilos personalizados aquí si es necesario */
  </style>
  