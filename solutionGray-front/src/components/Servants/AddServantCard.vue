<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-primary-50 dark:bg-primary-700 p-8 rounded-lg shadow-lg max-w-md w-full personal-animated">
      <h2 class="text-3xl font-bold text-primary-900 dark:text-white mb-4">
        Invitar a un nuevo voluntario
      </h2>
      <p class="text-gray-700 dark:text-gray-100 mb-6">
        Aquí podrás digitar el correo electrónico de la persona a la cual quieres invitar a ser parte de este ministerio.
      </p>
      <div class="relative">
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          class="w-full p-3 pl-10 text-primary-50 bg-white dark:bg-primary-900 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-700 placeholder:text-primary-200"
          v-model="email"
        />
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
          <svg class="h-5 w-5 text-primary-400 dark:text-primary-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12h1m-8-8v1m0 14v1m-8-8h1M4.93 4.93l1.414 1.414M18.36 18.36l1.414 1.414M15 12a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3z" />
          </svg>
        </span>
      </div>
      <div class="flex justify-end mt-4">
        <button 
           @click="$emit('close')"
          class="mr-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm">
          Cerrar
        </button>
        <button 
          @click="sendInvitation" 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-sm">
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>
    
<script>
import { sendInvitationBoarding } from '@/apiServices';
export default {  
  emits: ['close','toast-status'], 
  data() {
    return {
      email: null,
      message: null
    }
  },
  methods: {
    async sendInvitation() {
      let status
      try {
        if (this.email === null) {
          this.message = 'Por favor digita un correo electronico';
          return;
        }
        const email = this.email;
        const response = await sendInvitationBoarding({ email });
        status = response.status;
        this.message = response.message;
      } catch (error) {      
        this.message = error.response.data.message;
        console.log('message: ', this.message);
        status = error.response.status;
      } finally {
        this.showResponse(status);
        this.$emit('close');
      }
    },
    showResponse(status) {
     let severity = 'Success'
      if(status === 400){
        severity = 'Error'
      }else if(status === 401){
        severity = 'Info'
      }
     this.$emit('toast-status',severity)

      this.$toast.add({
        severity,
        summary: severity,
        detail: this.message,
        life: 4000,
        closable: true
      });
      return this.message;
    },
  },

     
  computed: {
  }
}
</script>