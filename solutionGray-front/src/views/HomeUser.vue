<template>
    <section class="w-full container mx-auto px-4">
      <!-- Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl sm:text-5xl font-bold text-second-800 mb-4">
          Bienvenido al Portal de {{ churchName }} 🌱
        </h1>
        <p class="text-gray-600 text-lg">
          Aquí encontrarás información actualizada sobre tus servicios y privilegios asignados.
        </p>
      </div>
  
      <!-- Sección de Servicios -->
      <DataView
        :value="worshipServices"
        :paginator="true"
        :rows="12"
      >        
        <!-- Template para renderizar elementos en la lista -->
         <template #header>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl sm:text-3xl  text-second-800">Servicios Programados</h2>
            <i class="material-symbols-outlined text-second-800 text-3xl">event</i>
          </div>
         </template>
        <template #list="slotProps">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <div
        v-for="(items, index) in slotProps.items"
        :key="index" class="w-full full">
           
              <div
                class="transition-transform duration-200 hover:-translate-y-2 shadow-md shadow-gray-400 rounded-lg sm:rounded-2xl overflow-hidden w-full h-full"
              >
                <!-- Imagen de fondo -->
                <div
                  class="relative w-full h-36 sm:h-48 bg-cover bg-center bg-image"                  
                ></div>

                <!-- Contenido del card -->
                <div class="p-4">
                  <!-- Título -->
                  <h2 class="text-lg sm:text-2xl font-semibold text-second-900">
                    {{ items.sermon_tittle }}
                  </h2>

                  <!-- Subtítulo -->
                  <h3 class="text-base sm:text-xl text-second-800">
                    {{ items.worship_name }}
                  </h3>

                  <!-- Detalles -->
                  <div class="flex flex-col mt-2">
                    <!-- Fecha -->
                    <div class="flex items-center gap-2 sm:gap-3 mb-2">
                      <i class="material-symbols-outlined text-gray-700">event</i>
                      <span class="text-base sm:text-xl text-gray-800">
                        {{ formatDate(items.date) }}
                      </span>
                    </div>

                    <!-- Descripción -->
                    <div class="flex items-center gap-2 text-gray-800">
                      <span class="material-symbols-outlined">book</span>
                      <p class="whitespace-normal break-words overflow-hidden text-sm sm:text-base">
                        {{ items.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
  
      <!-- Sección de Privilegios -->
      <div class="mb-8">
         
          <!-- Privilegio ejemplo -->
          <DataView
          :value="privileges"
          :paginator="true"
          :rows="5"
          >
          <template #header>
            <div class="flex items-center gap-2">
              <h2 class="text-2xl sm:text-3xl  text-second-800">Tus Privilegios Asignados</h2>
              <i class="material-symbols-outlined text-second-800 text-3xl">pinboard</i>
            </div>

          </template>
          <template #list="slotProps">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                <div
                  v-for="(items, index) in slotProps.items"
                  :key="index" class="flex w-full h-full">
                  <div
                    class="border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition w-full"
                    >
                      <h3 class="text-xl font-bold text-second-700 mb-2">{{ items.type_service }} </h3>
                      <p class="text-gray-600">
                        <strong>Fecha:</strong> {{ formatDate(items.date) }}
                      </p>
                      <p class="text-gray-600">
                        <strong>Rol:</strong> {{ items.rol_servant}}
                      </p>
                    </div>
                  </div>        
                </div>
            </template>
          </DataView>
          <!-- Añadir más privilegios si es necesario -->
        </div>
  
      <!-- Pie de página -->
      <footer class="text-center mt-8">
        <p class="text-gray-500 text-sm">
          © {{ new Date().getFullYear() }} Mi Iglesia. Todos los derechos reservados.
        </p>
      </footer>
    </section>
  
    <spanRatingService v-if="!checkQualified" :serviceWorshipId = "serviceWorshipId" @close="checkQualified=true"/>    
</template>

<script>
import {checkQualifiedRating,getMyLastServices,getWorshipServices} from '@/apiServices/'
import spanRatingService from '@/components/spanRatingService.vue';
import DataView from 'primevue/dataview';
import { format } from 'date-fns';
export default {
    components: {
        spanRatingService,
        DataView
    },
    data(){
        return {
            serviceWorshipId: null,
            checkQualified: true,
            messageServices: '',
            privileges: [],
            worshipServices: [],
            churchName: 'Mi Iglesia'
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
            async getServicesWorhsip (){
                try {
                  const today = new Date();
                  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                  const date30DaysAfter = new Date()
                  date30DaysAfter.setDate(today.getDate() + 30);
                  const minDate = format(today, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
                  const maxDate = format(date30DaysAfter, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });                
                  const response = await getWorshipServices({minDate, maxDate});
                  this.worshipServices = response;                  
                } catch (e) {
                    console.log('heyyy',e.response.data)
                    console.log(e.response.status)
                    console.log(e.response.data.message)
                    if (e.response.status !== 401 && e.response.data.message === 'Token has expired') {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Intentalo de nuevo.', life: 3000 });
                    }
                }
            },
            async checkQualifiedRatingFun() {
                try {
                    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const currentDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
                    const response = await checkQualifiedRating(currentDate);
                    console.log('heloo',response);
                    this.checkQualified = true
                } catch (e) {
                    console.log('heyyy',e.response.data)
                    console.log(e.response.status)
                    console.log(e.response.data.message)
                    if (e.response.status !== 401 && e.response.data.message === 'Token has expired') {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Intentalo de nuevo.', life: 3000 });
                    }else if(e.response.status === 400 && e.response.data.message === 'No ha calificado'){
                        this.serviceWorshipId = e.response.data.id
                        console.log('serviceWorshipId in Home',this.serviceWorshipId)
                        this.checkQualified = false
                    }
                }
            },
            async getMyLastServicesFun() {
                try {
                    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const date = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
                    console.log('date',date);
                    const response = await getMyLastServices(date);
                    this.privileges = response
                    console.log('heloo',response);
                } catch (e) {
                    console.log('heyyy',e.response.data)
                    console.log(e.response.status)
                    console.log(e.response.data.message)
                    if (e.response.status !== 401 && e.response.data.message === 'Token has expired') {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Intentalo de nuevo.', life: 3000 });
                    }else if(e.response.status === 400 && e.response.data.message === 'No hay servicios asignados'){
                        this.messageServices = e.response.data.message                    
                    }
            }
       
        },
    },
    mounted() {
        this.checkQualifiedRatingFun();
        this.getMyLastServicesFun();
        this.getServicesWorhsip();
        const session = this.$store.getters.userSession;
        if (session) this.churchName = JSON.parse(session).churchName;
    }
}
</script>

<style scoped>
.bg-image {
  background-image: url('../assets/vid.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}
</style>