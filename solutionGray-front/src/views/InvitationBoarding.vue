<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full animate-fadeIn">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Espera, estamos verificando...
      </h2>
      <p class="text-gray-700 dark:text-gray-300 mb-6">
        Aquí podrás digitar el correo electrónico de la persona a la cual quieres invitar a ser parte de este ministerio.
      </p>
      <div class="relative">
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          class="w-full p-3 pl-10 text-gray-700 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          v-model="email"
        />
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
          <svg class="h-5 w-5 text-gray-400 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12h1m-8-8v1m0 14v1m-8-8h1M4.93 4.93l1.414 1.414M18.36 18.36l1.414 1.414M15 12a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3z" />
          </svg>
        </span>
      </div>
      <div class="flex justify-end mt-4">
        <button 
          @click="closeModal" 
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
import { verifyInvitationBoarding } from '@/apiServices';

export default {
  name: 'InvitationBoarding',
  data() {
    return {
      token: null,
      message: null
    };
  },
  methods: {
    async catchToken() {
      try {
        const url = window.location.href;
        const tokenParam = url.split('token=')[1];
        this.token = tokenParam;
        const response = await verifyInvitationBoarding({ token: this.token });
        this.message = response.message;
        if (this.message === 'Ya Haz sido aceptado') {
          this.$router.push({path: '/sing-in'});
        }
        console.log(response);
        console.log(this.token);
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.catchToken();
  }
};
</script>