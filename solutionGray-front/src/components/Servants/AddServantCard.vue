<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-[40vh] p-8 bg-second-50 rounded-md shadow-md shadow-second-700">
        <div class="flex flex-col items-center justify-center  mb-4">
          <h2 class="text-3xl mb-2 font-bold text-second-900"><strong>Invitar nuevo servidor</strong></h2>          
          <p class="text-second-900">Aqui podrás digitar el correo electronico de la persona a la cual quieres invitar a ser parte de este ministerio</p>
        </div>
        <div class="relative mb-4">
            <i class="absolute left-3 top-1/2 transform -translate-y-1/2 material-symbols-outlined text-second-700 text-md">email</i>
            <input
                type="text"
                id="email"
                class="pl-10 p-2 border border-second-200 rounded-md outline-none focus:bg-second-100 hover:bg-second-100"
                v-model="email"
            />
        </div>
        <button @click="$emit('close')" class="mr-4 bg-red-500 text-white p-2 rounded">Cerrar</button>
        <button @click="sendInvitation" class=" bg-green-500 text-white p-2 rounded">Enviar</button>
        <span>{{ message }}</span>
    </div>
    </div>
  </template>
    
<script>
import { sendInvitationBoarding } from '@/apiServices';
export default {
  data() {
    return {
      email: null,
      message: null
    }
  },
  methods: {
    async sendInvitation() {
      try {
        if(this.email === null) {
          this.message = 'Por favor digita un correo electronico';
          return;
        }
        const email = this.email;
        console.log(email);
        const response = await sendInvitationBoarding({email});
        this.message = response;
        this.$emit('close');
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>