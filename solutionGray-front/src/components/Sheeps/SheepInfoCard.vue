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
       <div class="w-full lg:w-2/3 bg-white shadow-lg shadow-primary-300 rounded-lg p-6 text-primary-800">        
        <h2 class="text-lg font-bold mb-2">Información de la Oveja</h2>
        <div class=" grid grid-cols-1 lg:grid-cols-2 gap-4  ">
           
        <!-- Información de la Oveja -->
        <div>
          <p class="text-sm"><strong>Nombre:</strong> {{sheep.first_name + ' ' + sheep.last_name}}</p>
          <p class="text-sm"><strong>Correo electrónico:</strong> {{sheep.email}}</p>
          <p class="text-sm"><strong>Teléfono:</strong> {{sheep.phone}}</p>
        </div>
        
        <!-- Resumen del Culto con información del pastor -->
        <div>
          <p class="text-sm"><strong>Cantidad de ovejas a cargo:</strong> N/A</p>
          <p class="text-sm"><strong>Servicio Usual:</strong> N/A</p>
          <p class="text-sm"><strong>Pastor:</strong> {{ pastor.first_name }} {{ pastor.last_name }}</p>
          <p class="text-sm"><strong>Correo del Pastor:</strong> {{ pastor.email }}</p>
          <p class="text-sm"><strong>Cantidad de Visitas: </strong>{{totalVisits}}</p>
        </div>
        
      </div>
    </div>
      
    </div>
    <div>
      <!-- Cursos Hechos-->
    <!-- Cursos Hechos-->
    <div v-if="curses.length !== 0" class="w-full mb-4">      
      <h2 class="text-2xl text-second-800 font-semibold mb-4" >Cursos Aprobados</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">        
        <div v-for="item in curses" :key="item.name">
          <div class="bg-white shadow-lg shadow-gray-300 rounded-lg p-4 mb-4">          
            <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
            <p class="text-gray-600">{{ item.status }}</p>
          </div>
        </div>
      </div>    
    </div>
    <div v-else class="w-full mb-4">      
      <h2 class="text-2xl text-second-800 font-semibold mb-4" >Cursos Aprobados</h2>
      <p class="text-gray-600">No hay cursos a mostrar por el momento</p>
    </div>
    </div>
    <div class="w-full mt-8">
      <div class="flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-second-800">edit_calendar</span>
        <h2 class="text-2xl text-second-800 font-semibold mr-2">Registro de Visitas</h2>
        <button @click="showRegistervisits = true" class="material-symbols-outlined rounded-md p-1 bg-second-500 text-white font-bold">add</button>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- Itera sobre las visitas para mostrar cada tarjeta -->
      <div v-for="visit in visits" :key="visit.date" class="bg-white shadow-lg shadow-gray-300 rounded-lg p-4 relative overflow-hidden w-full h-full">
        <div class="absolute top-0 left-0 w-full h-2 bg-second-500"></div>
        <h3 class="text-lg font-bold text-second-800 mb-2 flex items-center gap-1">
          <span class="material-symbols-outlined text-second-800">event</span>
          {{ formatDate(visit.visit_date) }}
        </h3>
        <p class="text-sm text-gray-600 mb-2"><strong>Descripción:</strong> {{ visit.description }}</p>
      </div>
    </div>
    
    </div>
    <RegisterVisits v-if="showRegistervisits && sheep" @close="showRegistervisits = false" :sheepInfo="sheep" @update="getVisitsFun" />
  </section>
  
</template>

<script>
  import Avatar from 'primevue/avatar';
  import RegisterVisits from '../subComponents/RegisterVisits.vue';
  import { getVisits,getCoursesByPeople } from '@/apiServices';

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
        curses: [],
        visits: []
      }
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' };
        let dateFormated = date.toLocaleDateString('es-ES', options);
        dateFormated = dateFormated.charAt(0).toUpperCase() + dateFormated.slice(1);
        return dateFormated.replace(/,/g, ' ');
      },
      getInitials(sheep) {
        return sheep.first_name.charAt(0) + sheep.last_name.charAt(0);
      },
      async getVisitsFun(){
        try{          
          this.visits = await getVisits(this.sheep.id);
        }catch(error){
          console.error(error);
        }
      },
      async getCourses() {
        if(!this.sheep){
          return
        }
        const id = this.sheep.id;
        const curses = await getCoursesByPeople(id);
        this.curses = curses.filter((item) => item.status !== 'Reprobado');
      },
    },
    computed: {
      totalVistis(){
        return this.visits.length;
      }
    },
    async mounted() {
      await this.getVisitsFun();
      await this.getCourses();
    }
  };
  </script>
  
  <style scoped>
  p {
    @apply text-primary-900;
  }
  </style>
  