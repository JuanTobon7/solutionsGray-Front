<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-lg min-w-[70%] flex flex-col">
      <!-- Imagen de cabecera con botón de cerrar -->
      <div class="relative w-full min-h-[35vh] bg-cover bg-center rounded-t-2xl bg-image">
        <div class="absolute top-0 right-0 p-2">
          <!-- Botón de cerrar -->
          <button
            @click="$emit('close')"
            class="bg-white text-primary-600 border border-primary-500 py-1 px-2 rounded-full shadow-md hover:bg-primary-50 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-1 focus:ring-primary-300">
            <i class="material-symbols-outlined text-2xl">close</i>
          </button>
        </div>
      </div>

      <!-- Información del servicio de culto -->
      <div class="flex flex-col p-6 mb-6">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">{{ worshipService.worship_name }}</h2>

        <div class="mb-4 text-lg">
          <strong class="text-gray-700">Título del sermón:</strong> {{ worshipService.sermon_title }}
        </div>

        <div class="mb-4 text-lg">
          <strong class="text-gray-700">Fecha y hora:</strong> {{ formattedDate }}
        </div>

        <div class="mb-4 text-lg">
          <strong class="text-gray-700">Descripción:</strong> {{ worshipService.description }}
        </div>

        <div class="mb-4 text-lg">
          <strong class="text-gray-700">Lugar:</strong> {{ placeName }}
        </div>

        <!-- Espacio para el carrusel -->
        <div>
          <h3 class="text-2xl font-bold text-gray-700 mb-4">Personas con servicio asignado:</h3>
          <!-- Aquí irá el carrusel de las personas con servicio -->
          <div>
            <Carousel 
              v-if="servicesAssigned.length" 
              :value="servicesAssigned" 
              :numVisible="numVisible"
              :containerClass="'flex justify-center items-center w-full bg-gray-100 p-2 rounded-md'"
              :showNavigators="servicesAssigned.length > numVisible"
            >
              <template #item="slotProps">
                <div class="p-4 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center mr-4 max-w-[50vh]">
                  <div class="w-20 h-20 rounded-full overflow-hidden mb-2">
                    <Avatar
                      v-if="slotProps.data.person.avatar"
                      :image="slotProps.data.person.avatar"
                      size="xlarge"
                      shape="circle"
                    />
                    <Avatar
                      v-else
                      :label="getInitials(slotProps.data.person)"
                      class="bg-primary-100 flex items-center justify-center text-primary-800"
                      size="xlarge"
                      shape="circle"
                    />
                  </div>
                  <p class="text-lg font-semibold text-center">{{ slotProps.data.person.first_name + ' ' + slotProps.data.person.last_name }}</p>
                  <p class="text-sm text-center text-gray-600">{{ slotProps.data.service.name }}</p>      
                </div>
              </template>
            </Carousel>
            <p v-else class="text-gray-600">No hay servicios asignados todavía.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getServices } from '@/apiServices/index';
import Carousel from 'primevue/carousel';
import Avatar from 'primevue/avatar';

export default {
  props: ['worshipService'],
  components: {
    Carousel,
    Avatar
  },
  data() {
    return {
      servicesAssigned: [],
      numVisible: 3 // Número de elementos visibles en el carrusel, ajustable según el diseño
    }
  },
  methods: {
    async getServicesAssigned() {
      try {
        const response = await getServices(this.worshipService.id);
        const service = response.map((service) => ({
          person: {
            id: service.id,
            first_name: service.first_name,                        
            last_name: service.last_name,
            avatar: service.avatar, // Assuming you have an avatar field
            email: service.email,
            phone: service.phone,
            type_person_id: service.type_person_id,
            state_id: service.state_id,
            church_id: service.church_id,
          },
          service: {
            id: service.rol_id,
            name: service.rol_servant,
          }
        }));
        this.servicesAssigned = service;
      } catch (e) {
        console.log(e);
      }
    },
    getInitials(person) {
      if (!person) return '';
      return person.first_name.charAt(0) + person.last_name.charAt(0);
    },    
  },
  computed: {
    formattedDate() {
      const date = new Date(this.worshipService.date);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
    },
    placeName() {
      return this.worshipService.church_id ? 'Nombre de la iglesia' : 'Lugar no especificado';
    }
  },
  mounted() {
    this.getServicesAssigned();
  }
}
</script>

<style scoped>
.bg-image {
  background-image: url('../../assets/vid.png'); /* Cambia esta URL según tu imagen */
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  border-radius: 1rem 1rem 0 0; /* Redondeado solo en las esquinas superiores */
}

.carousel-placeholder {
  min-height: 200px; /* Ajusta la altura según lo que necesites para el carrusel */
}
</style>
