<template>
  <section class="container w-full">
    <div class="flex flex-wrap w-full items-center justify-between gap-6 mb-10">
      <!-- Card de Culto (1/4 del ancho en pantallas medianas y grandes) -->
      <Card class="flex-grow shadow-md shadow-gray-400 rounded-lg cursor-pointer">
        <div class="relative w-full h-48 bg-cover bg-center bg-image rounded-t-lg">          
        </div>

        <!-- Contenido del culto -->
        <div class="p-4">
          <h2 class="text-2xl font-semibold text-second-900">{{ worshipService.sermon_tittle }}</h2>
          <h3 class="text-xl text-second-800">{{ worshipService.worship_name }}</h3>

          <!-- Fecha y Descripción -->
          <div class="flex items-center gap-2 mt-4 text-gray-800">
            <i class="material-symbols-outlined">event</i>
            <span class="text-lg">{{ formatDate(worshipService.date) }}</span>
          </div>
          <p class="mt-2 text-sm text-gray-600 whitespace-normal break-words overflow-hidden">
            {{ worshipService.description }}
          </p>
        </div>
      </Card>

      <!-- Resumen del Culto (3/4 del ancho en pantallas medianas y grandes) -->
      <div class="w-3/4 bg-second-50 p-6 rounded-lg shadow-md shadow-gray-300 flex-grow">
        <h2 class="text-2xl font-semibold text-second-800 mb-4 text-center">Resumen del Culto</h2>

        <div class="grid grid-cols-2 gap-4 text-second-900 mb-4">
          <p><strong>Título del Sermón:</strong> {{ worshipService.sermon_tittle }}</p>
          <p><strong>Descripción:</strong> {{ worshipService.description }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(worshipService.date) }}</p>
          <p><strong>Nombre del Culto:</strong> {{ worshipService.worship_name }}</p>
          <p><strong>Ubicación:</strong> {{ worshipService.location || 'Ubicación no definida' }}</p>
          <p><strong>Capacidad:</strong> 50</p>
          <p><strong>Asistentes:</strong> 13</p>
          <p><strong>Ofrenda Recaudada:</strong> $ 100.00</p>
          <p><strong>Ofrenda para:</strong> <span class="font-semibold">Misión</span></p>
          <p><strong>Ofrenda Especial:</strong> $ 50.00</p>
          <p><strong>Ofrenda Especial para:</strong> <span class="font-semibold">Misión</span></p>
        </div>

         <!-- Botón para editar culto y servicios -->
         <div class="flex items-center justify-center mb-4 gap-4">
           <button @click="$emit('close')" class="bg-second-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105 text-sm sm:text-base flex items-center gap-2">
             Volver
             <i class="material-symbols-outlined text-primary-50">arrow_back</i>
           </button>
          <button @click="editServiceAndWorship" class="bg-second-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:bg-second-600 hover:scale-105 text-sm sm:text-base flex items-center gap-2">
            Editar Culto y Servicios
            <i class="material-symbols-outlined">edit</i>
          </button>

        </div>
      </div>
    </div>

    <!-- Carrusel de Privilegios asignados -->
    <div class="flex flex-col w-full h-auto mb-4">
      <div class="flex items-center gap-2 mb-1">        
        <i class="material-symbols-outlined text-second-800">event</i>
        <h3 class="text-2xl text-second-800 font-semibold">Privilegios Asignados</h3>
      </div>
      <Carousel 
        v-if="servicesAssigned.length" 
        :value="servicesAssigned" 
        :numVisible="numVisible"
        :showNavigators="servicesAssigned.length > numVisible"
        :responsiveOptions="[
           {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }          
        ]"
      >
        <template #item="slotProps">
          <!-- Tarjeta de la persona asignada -->
           <div 
           class="py-8 px-1 w-[30vh] md:w-full"
           :class="{'md:w-1/4': servicesAssigned.length === 1}"
           >
            <div class="bg-second-50 shadow-lg shadow-primary-300 rounded-lg overflow-hidden">
              <div class="bg-gradient-to-r from-primary-500 to-primary-800 h-20"></div>
              <div class="px-4 py-6 -mt-14">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                  <div class="flex flex-col md:flex-row items-center space-x-4">
                    <!-- Avatar o iniciales de la persona -->
                    <div class="w-16 h-16 rounded-full overflow-hidden">
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
                    <!-- Información de la persona -->
                    <div>
                      <h2 class="text-xl font-bold text-gray-900">
                        {{ slotProps.data.person.first_name + ' ' + slotProps.data.person.last_name }}
                      </h2>
                      <p class="text-sm text-gray-600">{{ slotProps.data.person.email }}</p>
                      <p class="text-sm text-gray-600">{{ slotProps.data.person.phone }}</p>
                      <p class="text-sm text-gray-600">{{ slotProps.data.person.type_person }}</p>
                      <!-- Servicio asignado -->
                      <p class="text-sm text-primary-900 font-semibold mt-2">
                        {{ slotProps.data.service.name }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </template>
      </Carousel>
    </div>
    
    <!-- Gráfico Pie para los datos de las Ofrendas -->
      <div class="mb-6 bg-second-50 shadow-lg rounded-lg py-6">
        <div class="flex items-center gap-2 mb-6">
          <i class="material-symbols-outlined text-second-800">attach_money</i>
          <h2 class="text-2xl text-second-800 font-semibold">Detalle de Ofrendas</h2>
        </div>

        <!-- Contenido del mini dashboard -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6">
          <!-- Gráfica Pie -->
          <div class="flex items-center justify-center">
            <Chart type="pie" :data="chartData" />
          </div>

          <!-- Indicadores KPIs -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div class="bg-gray-50 p-4 rounded-md shadow-md text-center">
              <p class="text-sm font-semibold text-gray-800">Total General</p>
              <p class="text-2xl text-second-500">$200.00</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-md shadow-md text-center">
              <p class="text-sm font-semibold text-gray-800">Especial</p>
              <p class="text-2xl text-second-500">$50.00</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-md shadow-md text-center">
              <p class="text-sm font-semibold text-gray-800">Misión</p>
              <p class="text-2xl text-second-500">$100.00</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-md shadow-md text-center">
              <p class="text-sm font-semibold text-gray-800">Mejoras Templo</p>
              <p class="text-2xl text-second-500">$75.00</p>
            </div>
          </div>
        </div>

        <!-- Botón para gestionar ofrendas -->
        <div class="flex flex-col sm:flex-row items-center justify-center mt-8 gap-4">
          <!-- Botón de descarga -->
          <button class="bg-second-500 text-white px-5 py-2 rounded-md transition-all duration-200 hover:bg-second-600 hover:scale-105 text-sm sm:text-base flex items-center gap-2">
            Descargar Reporte
            <i class="material-symbols-outlined">download</i>
          </button>

          <!-- Botón de gestionar ofrendas -->
          <button @click="showMonetaryIncome = !showMonetaryIncome" class="bg-second-500 text-white px-5 py-2 rounded-md transition-all duration-200 hover:bg-second-600 hover:scale-105 text-sm sm:text-base flex items-center gap-2">
            Gestionar Ofrendas
            <i class="material-symbols-outlined">payments</i>
          </button>
        </div>
      </div>
      
      <!-- Título de la sección de Asistentes al Culto -->
    <div class="flex items-center gap-2 mb-6">
      <i class="material-symbols-outlined text-second-800">people</i>
      <h2 class="text-xl text-second-800 font-semibold">
        Asistentes al Culto
      </h2>
    </div>

    <!-- Carrusel de Asistentes al Culto -->
    <div class="flex flex-col w-full overflow-x-auto mb-4">
      <DataView
        :value="attends"
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
                      <!-- Avatar o iniciales de la persona -->
                      <div class="w-16 h-16 rounded-full overflow-hidden">
                        <Avatar
                          v-if="item.person.avatar"
                          :image="item.person.avatar"
                          size="xlarge"
                          shape="circle"
                        />
                        <Avatar
                          v-else
                          :label="getInitials(item.person)"
                          class="bg-primary-100 flex items-center justify-center text-primary-800"
                          size="xlarge"
                          shape="circle"
                        />
                      </div>
                      <!-- Información de la persona -->
                      <div>
                        <h2 class="text-xl font-bold text-gray-900">
                          {{ item.person.first_name + ' ' + item.person.last_name }}
                        </h2>
                        <p class="text-sm text-gray-600">{{ item.person.email }}</p>
                        <p class="text-sm text-gray-600">{{ item.person.phone }}</p>
                        <p class="text-sm text-gray-600">{{ item.person.type_person }}</p>
                        <!-- Servicio asignado -->
                        <p class="text-sm text-primary-900 font-semibold mt-2">
                          {{ item.service.name }}
                        </p>
                        <div class="flex flex-col">                            
                          <label for="asistencia">¿Asistió?</label>
                          <InputSwitch id="asistencia" v-model="item.person.isAttend" />
                        </div>
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
  <RecordMonetaryIncome v-if="showMonetaryIncome" @close="showMonetaryIncome = !showMonetaryIncome" />
  <EditWorshipService :worshipService="this.worshipService" v-if="showEditService" @close="showEditService = !showEditService" />
</template>

<script>
import { getServices } from '@/apiServices/index';
import Carousel from 'primevue/carousel';
import Avatar from 'primevue/avatar';
import DataView from 'primevue/dataview';
import InputSwitch from 'primevue/inputswitch';
import Chart from 'primevue/chart';
import RecordMonetaryIncome from '../subComponents/RecordMonetaryIncome.vue';
import EditWorshipService from './EditWorshipService.vue';

export default {
  props: ['worshipService'],
  components: {
    Carousel,
    Avatar,
    DataView,
    InputSwitch,
    Chart,
    RecordMonetaryIncome,
    EditWorshipService
  },
  data() {
    return {
      servicesAssigned: [],
      numVisible: 3, // Número de elementos visibles en pantallas grandes
      showMonetaryIncome: false,
      showEditService: false,
      chartData: {
        labels: ['General', 'Especial', 'Misión', 'Mejoras del Templo'],
        datasets: [
          {
            data: [200, 50, 100, 75], // Datos de las ofrendas
            backgroundColor: ['#6b9c7a', '#8b7d6b', '#524741', '#a3c4ac'], // Colores más suaves y en armonía con la paleta
            hoverBackgroundColor: ['#4b7e5c', '#756759', '#483e3b', '#6b9c7a'] // Colores para el hover, más oscuros pero no intensos
          }
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#4A4A4A' // Color del texto de la leyenda
              }
            }
          }
        }
      },  
      attends: [
      {
        person: {
          id: 1,
          first_name: 'Carlos',
          last_name: 'Ramírez',
          avatar: '', // No tiene avatar, se mostrarán las iniciales
          email: 'carlos.ramirez@example.com',
          phone: '555-1234',
          type_person: 'Predicador',
          isAttend: null
        },
        service: {
          id: 101,
          name: 'Sermón'
        }
      },
      {
        person: {
          id: 2,
          first_name: 'Laura',
          last_name: 'Martínez',
          avatar: '', // No tiene avatar, se mostrarán las iniciales
          email: 'laura.martinez@example.com',
          phone: '555-5678',
          type_person: 'Corista',
          isAttend: null
        },
        service: {
          id: 102,
          name: 'Coro'
        }
      },
      {
        person: {
          id: 3,
          first_name: 'Santiago',
          last_name: 'López',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg', // URL del avatar
          email: 'santiago.lopez@example.com',
          phone: '555-9101',
          type_person: 'Diácono',
           isAttend: null
        },
        service: {
          id: 103,
          name: 'Ofrendas'
        }
      },
      {
        person: {
          id: 4,
          first_name: 'Isabel',
          last_name: 'Gómez',
          avatar: '', // No tiene avatar, se mostrarán las iniciales
          email: 'isabel.gomez@example.com',
          phone: '555-1213',
          type_person: 'Lectura',
           isAttend: null
        },
        service: {
          id: 104,
          name: 'Lectura de la Biblia'
        }
      },
      {
        person: {
          id: 5,
          first_name: 'Pedro',
          last_name: 'Pérez',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg', // URL del avatar
          email: 'pedro.perez@example.com',
          phone: '555-1415',
          type_person: 'Músico',
           isAttend: null
        },
        service: {
          id: 105,
          name: 'Piano'
        }
      },
      {
        person: {
          id: 6,
          first_name: 'Ana',
          last_name: 'Fernández',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg', // URL del avatar
          email: 'ana.fernandez@example.com',
          phone: '555-1617',
          type_person: 'Oración',
           isAttend: null
        },
        service: {
          id: 106,
          name: 'Oración'
        }
      },{
        person: {
          id: 1,
          first_name: 'Carlos',
          last_name: 'Ramírez',
          avatar: '', // No tiene avatar, se mostrarán las iniciales
          email: 'carlos.ramirez@example.com',
          phone: '555-1234',
          type_person: 'Predicador',
          isAttend: null
        },
        service: {
          id: 101,
          name: 'Sermón'
        }
      },
      {
        person: {
          id: 2,
          first_name: 'Laura',
          last_name: 'Martínez',
          avatar: '', // No tiene avatar, se mostrarán las iniciales
          email: 'laura.martinez@example.com',
          phone: '555-5678',
          type_person: 'Corista',
          isAttend: null
        },
        service: {
          id: 102,
          name: 'Coro'
        }
      },
      {
        person: {
          id: 3,
          first_name: 'Santiago',
          last_name: 'López',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg', // URL del avatar
          email: 'santiago.lopez@example.com',
          phone: '555-9101',
          type_person: 'Diácono',
           isAttend: null
        },
        service: {
          id: 103,
          name: 'Ofrendas'
        }
      },
      {
        person: {
          id: 4,
          first_name: 'Isabel',
          last_name: 'Gómez',
          avatar: '', // No tiene avatar, se mostrarán las iniciales
          email: 'isabel.gomez@example.com',
          phone: '555-1213',
          type_person: 'Lectura',
           isAttend: null
        },
        service: {
          id: 104,
          name: 'Lectura de la Biblia'
        }
      },
      {
        person: {
          id: 5,
          first_name: 'Pedro',
          last_name: 'Pérez',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg', // URL del avatar
          email: 'pedro.perez@example.com',
          phone: '555-1415',
          type_person: 'Músico',
           isAttend: null
        },
        service: {
          id: 105,
          name: 'Piano'
        }
      },
      {
        person: {
          id: 6,
          first_name: 'Ana',
          last_name: 'Fernández',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg', // URL del avatar
          email: 'ana.fernandez@example.com',
          phone: '555-1617',
          type_person: 'Oración',
           isAttend: null
        },
        service: {
          id: 106,
          name: 'Oración'
        }
      },
      {
        person: {
          id: 1,
          first_name: 'Carlos',
          last_name: 'Ramírez',
          avatar: '', // No tiene avatar, se mostrarán las iniciales
          email: 'carlos.ramirez@example.com',
          phone: '555-1234',
          type_person: 'Predicador',
           isAttend: null
        },
        service: {
          id: 101,
          name: 'Sermón'
        }
      },
      {
        person: {
          id: 2,
          first_name: 'Laura',
          last_name: 'Martínez',
          avatar: '', // No tiene avatar, se mostrarán las iniciales
          email: 'laura.martinez@example.com',
          phone: '555-5678',
          type_person: 'Corista',
           isAttend: null
        },
        service: {
          id: 102,
          name: 'Coro'
        }
      },
      {
        person: {
          id: 3,
          first_name: 'Santiago',
          last_name: 'López',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg', // URL del avatar
          email: 'santiago.lopez@example.com',
          phone: '555-9101',
          type_person: 'Diácono',
           isAttend: null
        },
        service: {
          id: 103,
          name: 'Ofrendas'
        }
      },
      {
        person: {
          id: 4,
          first_name: 'Isabel',
          last_name: 'Gómez',
          avatar: '', // No tiene avatar, se mostrarán las iniciales
          email: 'isabel.gomez@example.com',
          phone: '555-1213',
          type_person: 'Lectura',
           isAttend: null
        },
        service: {
          id: 104,
          name: 'Lectura de la Biblia'
        }
      },
      {
        person: {
          id: 5,
          first_name: 'Pedro',
          last_name: 'Pérez',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg', // URL del avatar
          email: 'pedro.perez@example.com',
          phone: '555-1415',
          type_person: 'Músico',
          isAttend: null
        },
        service: {
          id: 105,
          name: 'Piano'
        }
      },
      {
        person: {
          id: 6,
          first_name: 'Ana',
          last_name: 'Fernández',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg', // URL del avatar
          email: 'ana.fernandez@example.com',
          phone: '555-1617',
          type_person: 'Oración',
          isAttend: null
        },
        service: {
          id: 106,
          name: 'Oración'
        }
      }
    ],
    }
  },
  methods: {
    editServiceAndWorship() {
      this.showEditService = true;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' };
      let dateFormated = date.toLocaleDateString('es-ES', options);
      dateFormated = dateFormated.charAt(0).toUpperCase() + dateFormated.slice(1);
      return dateFormated.replace(/,/g, ' ');
    },
    async getServicesAssigned() {
      try {
        const response = await getServices(this.worshipService.id);
        const service = response.map((service) => ({
          person: {
            id: service.id,
            first_name: service.first_name,
            last_name: service.last_name,
            avatar: service.avatar || '', // Si no tiene avatar, no mostrar imagen
            email: service.email,
            phone: service.phone
          },
          service: {
            id: service.rol_id,
            name: service.rol_servant
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
    }
  },
  async mounted() {
    await this.getServicesAssigned();
  },
}
</script>

<style scoped>
.bg-image {
  background-image: url('../../assets/vid.png'); /* Imagen de fondo del culto */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 1rem 1rem 0 0; /* Esquinas superiores redondeadas */
}
.custom-paginator-button {
  @apply p-2 text-primary-800;
}
</style>
