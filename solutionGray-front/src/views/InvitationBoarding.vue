<template>
  <section 
   class="w-full h-screen flex items-center justify-center right-0 ctn-cllg">
     <div
       class="w-[65vh] h-auto md:h-[50vh] shadow-lg shadow-primary-900 rounded-lg bg-gradient-to-b from-primary-800 to-primary-600 p-8 flex flex-col items-center container"
     >
     <div class="flex justify-center mb-4">
       <img src="https://s3.us-east-2.amazonaws.com/viddefe.com/photos/register-removebg.png" class="h-[30vh] w-[30vh]" />
     </div>
     <div class="w-full flex flex-col items-center">
       <h1 class="text-center text-primary-50 text-2xl mb-8">     
         Espera estamos verificando tu invitacion pronto te redireccionaremos
       </h1>
       <i class="material-symbols-outlined text-4xl text-primary-50 animate-spin animate-infinite">rotate_right</i>
     </div>
   </div>
  </section>
</template>

<script>
import { verifyInvitationBoarding } from '@/apiServices';
import store from '@/store';

export default {
 data() {
   return {
     token: null,
     message: null,
     email: null,  // Nueva variable para almacenar el email
   };
 },
 methods: {
   async catchToken() {
     try {
       const url = window.location.href;
       const tokenParam = url.split('token=')[1];
       this.token = tokenParam;

       const response = await verifyInvitationBoarding({ token: this.token });

      document.cookie = `emailToken=${this.token}`; // Guarda el token en las cookies

       this.message = response.message; // Asigna el mensaje de la respuesta
       this.email = response.email; // Asigna el email de la respuesta

       // Muestra el mensaje en el toast
       this.$toast.add({
         severity: 'info',
         summary: 'Invitación',
         detail: this.message,
         life: 5000,
       });
       console.log('Respuesta de la invitación: ', response);

       if (this.message === 'Ya Haz sido aceptado') {
         store.dispatch('loadInvitation', true);
         // Redireccionar y pasar el email usando state
         store.dispatch('setTempEmail', this.email);
         this.$router.push({ 
           path: '/sing-in', 
         });
       }
     } catch (error) {
       console.log('Error en la invitación: ', error);
     }
   },   
 },
 mounted() {
   this.catchToken();
 },
};
</script>

<style scoped>
.ctn-cllg {
 background-image: url('https://s3.us-east-2.amazonaws.com/viddefe.com/photos/vid.png');
 background-position: left;
 background-size: cover;
 background-repeat: no-repeat;
 max-height: 50%;
 max-width: 100%;
}
</style>
