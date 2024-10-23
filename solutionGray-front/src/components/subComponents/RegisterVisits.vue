<template>
    <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
        <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-auto sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
          <!-- Header del formulario -->
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-800">
              Registro de Visita para {{ sheepInfo.first_name + ' ' + sheepInfo.last_name }}
            </h2>
            <button @click="$emit('close')" class="material-symbols-outlined text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200">close</button>
          </div>
          
          <!-- Formulario de Registro de Visita -->
          <form @submit.prevent="submitVisit">
            <div class="flex flex-col gap-4">
              <!-- Campo para seleccionar la fecha con PrimeVue Calendar -->
              <label class="text-sm font-semibold text-gray-800">Fecha de Visita:</label>
              <Calendar 
                v-model="visitDate" 
                required 
                dateFormat="dd/mm/yy"
                showTime 
                hourFormat="24"
                placeholder="Seleccionar fecha"
                input-class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-second-500"
                panel-class="shadow shadow-gray-400"
              />
              
              <!-- Campo de texto para el avance o actitud -->
              <label class="text-sm font-semibold text-gray-800">Descripción del Avance o Actitud:</label>
              <textarea 
                v-model="progressDescription" 
                rows="4" 
                required 
                class="border rounded-md p-2 text-gray-700 resize-none"
                placeholder="Describe el avance o actitud de la persona"
              ></textarea>
              
              <!-- Botón para guardar -->
              <div class="flex justify-end mt-4">
                <button type="submit" class="bg-second-600 text-white py-2 px-4 rounded-md transition duration-200 hover:bg-second-700">
                  Guardar Registro
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { registerVisits } from '@/apiServices/index';
  import Calendar from 'primevue/calendar';
  import { format } from 'date-fns-tz';

  export default {
    props: {
      sheepInfo: {
        type: Object,
        required: true
      }
    },
    components: {
      Calendar
    },
    data() {
      return {
        visitDate: null, // Fecha de la visita
        progressDescription: '', // Descripción cualitativa del avance
      };
    },
    methods: {
      async submitVisit() {
        // Emitimos el evento con la información del registro de la visita
        try{
          console.log('aqui toi jeje')
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const date = new Date(this.visitDate);            
            const visitDateISO = format(date, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
            console.log(visitDateISO);
            const visit = {
                date: visitDateISO,
                description: this.progressDescription,
                sheepId: this.sheepInfo.id,
                userTimeZone
            }
            const response = await registerVisits(visit);
            this.$toast.add({severity: 'success', summary: 'Exito', detail: response.message, life: 3000});
            this.$emit('update');
            this.visitDate = null;
            this.progressDescription = '';
        }catch(e){
            if(e.response.status === 401 || e.response.status === 400 || e.response.data.message === 'Token Expired'){
                this.$toast.add({severity: 'error', summary: 'Error', detail: 'Ups, intentalo nuevamente', life: 3000});
            }
        }
      },
    },
  };
  </script>
  