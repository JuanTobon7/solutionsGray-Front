<template>
  <section class="w-full container mx-auto p-4">
    <div class="w-full flex justify-between mb-6">
      <h2 class="text-2xl text-second-800 font-semibold mb-4">Información y trayectoria de la Oveja</h2>
      <button @click="$emit('close')" class="bg-second-500 text-white px-3 py-1 rounded-md shadow-md hover:scale-105 transition-transform flex items-center gap-2">
        <i class="material-symbols-outlined text-md">arrow_back</i> Volver
      </button>
    </div>
    <!-- Contenedor principal -->
    <div class="flex flex-wrap lg:flex-nowrap w-full items-start justify-between gap-6 mb-10">
      
      <!-- Card de la Oveja -->
      <div class="w-full lg:w-1/3 shadow-md shadow-gray-400 rounded-lg">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="bg-gradient-to-r from-second-500 to-second-700 h-20"></div>
          <div class="p-6 -mt-14">
            <div class="bg-white p-4 rounded-lg shadow-lg">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-full overflow-hidden">
                  <Avatar
                    v-if="sheep.avatar"
                    :image="sheep.avatar"
                    size="xlarge"
                    shape="circle"
                  />
                  <Avatar
                    v-else
                    :label="getInitials(sheep)"
                    class="bg-second-100 flex items-center justify-center text-second-900"
                    size="xlarge"
                    shape="circle"
                  />
                </div>
                <div>
                  <h2 class="text-xl font-bold text-second-900">
                    {{ sheep.first_name + ' ' + sheep.last_name }}
                  </h2>
                  <p class="text-sm text-gray-600">{{ sheep.email }}</p>
                  <p class="text-sm text-gray-600">{{ sheep.phone }}</p>
                  <p class="text-sm text-gray-600">{{ sheep.type }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Información de la Oveja y Resumen del Culto -->
      <div class="w-full lg:w-2/3 grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <!-- Información de la Oveja -->
        <div class="flex flex-col w-full h-full bg-white shadow-lg shadow-primary-300 rounded-lg p-6 text-primary-800">
          <h2 class="text-lg font-bold mb-2">Información de la Oveja</h2>
          <p class="text-sm"><strong>Nombre:</strong> {{sheep.first_name + ' ' + sheep.last_name}}</p>
          <p class="text-sm"><strong>Correo electrónico:</strong> {{sheep.email}}</p>
          <p class="text-sm"><strong>Teléfono:</strong> {{sheep.phone}}</p>
        </div>
        
        <!-- Resumen del Culto con información del pastor -->
        <div class="bg-white w-full h-full shadow-lg shadow-second-300 rounded-lg p-6 text-second-800">
          <h3 class="text-lg font-bold mb-2">Informacion de su Guia</h3>
          <p class="text-sm"><strong>Cantidad de ovejas a cargo:</strong> N/A</p>
          <p class="text-sm"><strong>Servicio Usual:</strong> N/A</p>
          <p class="text-sm"><strong>Pastor:</strong> {{ pastor.first_name }} {{ pastor.last_name }}</p>
          <p class="text-sm"><strong>Correo del Pastor:</strong> {{ pastor.email }}</p>
        </div>
        
      </div>
      
    </div>
    <div>
      <!-- Cursos Hechos-->
    <div class="w-full mb-4">      
      <h2 class="text-2xl text-second-800 font-semibold mb-4" >Cursos Aprobados</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">        
        <div v-for="item in curses" :key="item.name">
          <div class="bg-white shadow-lg shadow-gray-300 rounded-lg p-4 mb-4">          
            <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
            <p class="text-gray-600">{{ item.homologation }}</p>
          </div>
        </div>
      </div>    
    </div>
    </div>
    <div class="w-full mt-8">
      <div class="flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-second-800">edit_calendar</span>
        <h2 class="text-2xl text-second-800 font-semibold mr-2">Registro de Visitas</h2>
        <button @click="showRegistervisits = true" class="material-symbols-outlined rounded-md p-1 bg-second-500 text-white font-bold">add</button>
      </div>
      
      <div class="grid grid-cols-3 gap-4">
        <!-- Itera sobre las visitas para mostrar cada tarjeta -->
        <div v-for="visit in visits" :key="visit.date" class="bg-white shadow-lg rounded-lg p-6">
          <h3 class="text-lg font-bold text-second-800 mb-2">Visita del {{ visit.date }}</h3>
          <p class="text-sm text-gray-600 mb-2">{{ visit.comment }}</p>
          <p class="text-sm font-bold text-second-600">Estado: {{ visit.status }}</p>
        </div>
      </div>
    </div>
    <RegisterVisits v-if="showRegistervisits" @close="showRegistervisits = false" />
  </section>
  
</template>

<script>
  import Avatar from 'primevue/avatar';
  import RegisterVisits from '../subComponents/RegisterVisits.vue';
  export default {
    props: {
      sheep: {
        type: Object,
        required: true
      }
    },
    components: {
      Avatar,
      RegisterVisits
    },
    data() {
      return {
        showRegistervisits: false,
        pastor: {
          first_name: 'Pastor',
          last_name: 'Default',
          email: 'pepito@gmail.com'
        },
        curses: [
          {name: 'Discipulado 1', homologation: 'Homologado'},
          {name: 'Discipulado 2', homologation: 'Homologado'},
          {name: 'Discipulado 3', homologation: 'Homologado'},
          {name: 'Discipulado 4', homologation: 'Aprobado'},
          {name: 'Discipulado 5', homologation: 'Aprobado'},
          {name: 'Discipulado 6', homologation: 'Aprobado'},
          {name: 'Discipulado 7', homologation: 'Aprobado'},  
        ],
        visits: [
          { date: '02 de octubre, 2024', comment: 'La oveja ha mostrado una actitud más positiva en los cultos.', status: 'Mejorando' },
          { date: '25 de septiembre, 2024', comment: 'Ha asistido con regularidad y participa activamente en los estudios.', status: 'Estable' },
          { date: '10 de septiembre, 2024', comment: 'Se necesita más seguimiento, ha estado ausente.', status: 'En riesgo' }
        ]
      }
    },
    methods: {
      formatDate(dateString) {
        if(!dateString) return 'N/A';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      getInitials(sheep) {
        return sheep.first_name.charAt(0) + sheep.last_name.charAt(0);
      }
    }
  };
  </script>
  
  <style scoped>
  p {
    @apply text-primary-900;
  }
  </style>
  