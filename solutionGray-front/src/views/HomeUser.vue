<template>
    <section class="w-full container mx-auto px-4">
      <!-- Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl sm:text-5xl font-bold text-second-700 mb-4">
          Bienvenido al Portal de Mi Iglesia 🙏
        </h1>
        <p class="text-gray-600 text-lg">
          Aquí encontrarás información actualizada sobre tus servicios y privilegios asignados.
        </p>
      </div>
  
      <!-- Sección de Servicios -->
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-semibold text-second-600 mb-4">Tus Próximos Servicios</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Servicio ejemplo -->
          <div
            class="border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
          >
            <h3 class="text-xl font-bold text-second-700 mb-2">Primicia</h3>
            <p class="text-gray-600">
              <strong>Fecha:</strong> Sábado 7 de diciembre - 10:00 AM
            </p>
            <p class="text-gray-600">
              <strong>Descripción:</strong> Culto especial de Primicia.
            </p>
            <p class="text-gray-600">
              <strong>Lugar:</strong> Iglesia Principal.
            </p>            
          </div>
          <!-- Añadir más servicios si es necesario -->
        </div>
      </div>
  
      <!-- Sección de Privilegios -->
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-semibold text-second-600 mb-4">Tus Privilegios Asignados</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Privilegio ejemplo -->
          <div
            class="border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
          >
            <h3 class="text-xl font-bold text-second-700 mb-2">Juan Tobón</h3>
            <p class="text-gray-600">
              <strong>Correo:</strong> jctobon@unillanos.edu.co
            </p>
            <p class="text-gray-600">
              <strong>Teléfono:</strong> 3212527494
            </p>
            <p class="text-gray-600">
              <strong>Rol:</strong> Predicador
            </p>
          </div>
          <!-- Añadir más privilegios si es necesario -->
        </div>
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
import {checkQualifiedRating,getMyLastServices} from '@/apiServices/'
import spanRatingService from '@/components/spanRatingService.vue';
import { format } from 'date-fns';
export default {
    components: {
        spanRatingService
    },
    data(){
        return {
            serviceWorshipId: null,
            checkQualified: true,
            messageServices: ''
        }
    },
        methods: {
            async checkQualifiedRatingFun() {
                try {
                    const response = await checkQualifiedRating();
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
    }
}
</script>