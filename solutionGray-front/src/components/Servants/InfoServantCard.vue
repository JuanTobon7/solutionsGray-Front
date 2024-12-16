<template>
  <section class="container w-full">
    <div class="flex flex-wrap w-full items-center justify-between gap-6 mb-10">
      <div class="flex-grow shadow-md shadow-gray-400 rounded-lg">
           
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
         <div class="bg-gradient-to-r from-second-500 to-second-700 h-20"></div>
          <div class="p-6 -mt-14">
            <div class="bg-white p-4 rounded-lg shadow-lg">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-full overflow-hidden">
                  <Avatar
                    v-if="servants.avatar"
                    :image="servants.avatar"
                    size="xlarge"
                    shape="circle"
                  />
                  <Avatar
                    v-else
                    :label="getInitials(servants.first_name, servants.last_name)"
                    class="bg-second-100 flex items-center justify-center text-second-900"
                    size="xlarge"
                    shape="circle"
                  />
                </div>
                <div>
                  <h2 class="text-xl font-bold text-second-900">
                    {{ servants.first_name + ' ' + servants.last_name }}
                  </h2>
                  <p class="text-sm text-gray-600">{{ servants.email }}</p>
                  <p class="text-sm text-gray-600">{{ servants.phone }}</p>
                  <p class="text-sm text-gray-600">{{ servants.type }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-3/4 bg-second-50 p-6 rounded-lg shadow-md shadow-gray-300 flex-grow">
        <h2 class="text-2xl font-semibold text-second-800 mb-4 text-center">Resumen del Culto</h2>
        <div class="grid grid-cols-2 gap-4 text-second-900 mb-4">
          <p><strong>Cantidad de ovejas a cargo</strong> {{ servants.cuantity_sheeps_guide || 'N/A'}}</p>
          <p> <strong>Estado del curso</strong> {{ servants.status_course || 'N/A' }}</p>
          <p> <strong>Ultimo Servicio</strong> {{ formatDate(servants.last_service) || 'N/A'}}</p>
          <p><strong>Servicio Usual</strong> {{ servants.usual_rol || 'N/A' }}</p>
          <p><strong>Correo electrónico</strong> {{ servants.email || 'N/A' }}</p>
          <div class="flex items-center justify-center mb-4 gap-4">
           <button @click="$emit('close')" class="bg-second-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105 text-sm sm:text-base flex items-center gap-2">
             Volver
             <i class="material-symbols-outlined text-primary-50">arrow_back</i>
           </button>
        </div>
        </div>
      </div>
   </div>
    <div class="w-full mb-4">      
      <h2 class="text-2xl text-second-800 font-semibold mb-4" >Estadisticas por sus Servicios</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">       
        <div v-for="item in services" :key="item.rol_servant" class="flex-grow">
          <div class="bg-white shadow-lg shadow-gray-300 rounded-lg p-4 mb-4">          
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.rol_servant }}</h3>
            <Rating v-model="item.average_rating" :readonly="true" :stars="5" :cancel="false" />
          </div>
        </div>
      </div>    
    </div>

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
    <!-- Ovejas a cargo -->
   <div>
    <h2 class="text-2xl text-second-800 font-semibold mb-4">Ovejas a Cargo</h2>
   </div>
   <div class="flex flex-col w-full overflow-x-auto mb-4">
      <DataView
        :value="sheeps"
        :paginator="true"
        :rows="8"
        :emptyMessage="'No hay asistentes disponibles'"
        :pt="{
          paginatorPageButton: 'custom-paginator-button'
        }"
      >
        <template #list="slotProps">
          <!-- Contenedor con un grid para ajustar el ancho -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            <div
              v-for="(item, index) in slotProps.items"
              :key="index"
              class="bg-white shadow-lg rounded-lg"
            >
              <div class="bg-primary-50 shadow-lg shadow-primary-300 rounded-lg overflow-hidden">
                <div class="bg-gradient-to-r from-primary-500 to-primary-800 h-20"></div>
                <div class="px-4 py-6 -mt-14 relative">
                  <div class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="flex items-center space-x-4">
                      <!-- Avatar o iniciales de laa -->
                      <div class="w-16 h-16 rounded-full overflow-hidden">
                        <Avatar
                          v-if="item.avatar"
                          :image="item.avatar"
                          size="xlarge"
                          shape="circle"
                        />
                        <Avatar
                          v-else
                          :label="getInitials(item.first_name, item.last_name)"
                          class="bg-primary-100 flex items-center justify-center text-primary-800"
                          size="xlarge"
                          shape="circle"
                        />
                      </div>
                      <!-- Información de laa -->
                       
                      <div>
                        <h2 class="text-xl font-bold text-gray-900">
                          {{ item.first_name + ' ' + item.last_name }}
                        </h2>
                        <p class="text-sm text-gray-600">{{ item.email }}</p>
                        <p class="text-sm text-gray-600">{{ item.phone }}</p>
                        <p class="text-sm text-gray-600">{{ item.type }}</p>
                        <p class="text-sm text-gray-600">
                          <strong>Cantidad de Visitas:</strong> {{ item.cuantity_visits }}
                        </p>
                        <p class="text-sm text-gray-600">
                          <strong>Descripcion:</strong> {{ item.description }}
                        </p>
                        <!-- Servicio asignado -->                                                
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </section>  
    
</template>
  
  <script>
  import  Avatar  from 'primevue/avatar';
  import DataView from 'primevue/dataview';
  import { getSheepsByServant,getRatingByServant,getCoursesByPeople } from '@/apiServices';
  import Rating from 'primevue/rating';
  
  export default {
    name: 'ServerCard',
    components: {
      Avatar,  
      DataView,
      Rating,
    },
    props: {
      servants: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        sheeps: [],        
        services: [],
        curses: []
      };
    },
    methods: {
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
      },
      getInitials(first_name, last_name) {
        return first_name.charAt(0) + last_name.charAt(0);
      },
      async getSheeps() {
          // Lógica para obtener las ovejas a cargo de un servidor
        if(!this.servants && this.servants.cuantity_sheeps_guide <= 0){
          return
        }
        const id = this.servants.id;
        const sheeps = await getSheepsByServant(id);
        this.sheeps = sheeps;
      },
      async getRating() {
        if(!this.servants){
          return
        }
        const id = this.servants.id;
        const services = await getRatingByServant(id);
        this.services = services;
      },
      async getCourses() {
        if(!this.servants){
          return
        }
        const id = this.servants.id;
        const curses = await getCoursesByPeople(id);
        this.curses = curses.filter((item) => item.status !== 'Reprobado');
      },
    },
    async mounted() {
      try{        
        await this.getSheeps();
        await this.getRating();
        await this.getCourses();
      }catch(e){
        await this.getSheeps();
        await this.getRating();
        await this.getCourses();
      }
    },
  };
  </script>
  
  <style scoped>
  /* Puedes agregar estilosalizados aquí si es necesario */
  </style>
  