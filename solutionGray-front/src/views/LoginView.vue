<template>
  <section class="w-full h-screen flex items-center justify-center ctn-cllg">
    <VerifyCodePassword v-if="codePasswd" @resendCode="forgetPassword" @close="codePasswd = null"/>
    <div v-else
      class="w-[60vh] h-auto shadow-lg shadow-primary-900 rounded-lg bg-gradient-to-b from-primary-800 to-primary-600 p-8 flex flex-col items-center container"
    >
      <div class="flex justify-center mb-4">
        <img src="https://s3.us-east-2.amazonaws.com/viddefe.com/photos/solutionGrayLOGO-removebg.png" class="h-[30vh] w-[30vh]" />
      </div>
      <div class="w-full flex flex-col items-center">
        <h1 class="text-center font-serif text-primary-50 text-5xl mb-8">
          <strong>Iniciar Sesión</strong>
        </h1>
        <form class="w-full max-w-sm">
          <div class="mb-4">
            <label class="block text-primary-50 text-md font-bold mb-2" for="email"> Email </label>
            <input
            v-model="email"
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div class="mb-6">
            <label class="block text-primary-50 text-md font-bold mb-2" for="password">
              Contraseña
            </label>
            <input
            v-model="password"
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="***********"
            />
          </div>
          <div class="flex items-center justify-around mb-8">
           
            <button
            @click="loginUser"
              class="bg-primary-400 hover:bg-primary-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
        <button @click="forgetPassword" class="text-primary-50 mb-1">¿Olvidaste tu contraseña?</button>
        <a href="/terms" target="_blank"  class="text-primary-50 hover:">Terminos y Condiciones de Privacidad</a>
      </div>
    </div>
  </section>
</template>

<script>
import {login,forgetPassword} from '../apiServices/index'
import VerifyCodePassword from '@/components/VerifyCodePassword.vue';

export default{
  components: {
    VerifyCodePassword
  },
  data(){
    return {
      message: null,
      email: null,
      password: null,
      codePasswd: false
    }
  },
  methods: {
    async loginUser(){
      try{        
        if(!this.email || !this.password){
          this.$toast.add({
            severity:'error', 
            summary: 'Error', 
            detail: 'Por favor llene todos los campos',
            life: 3000});
          return 
        }
        const email = this.email
        const password = this.password
        
        await login({email,password})
        this.$router.push('/home')

      }catch(e){
        if(e.response.status === 401){
          this.$toast.add({
            severity:'error', 
            summary: 'Error', 
            detail: e.response.data.message,
            life: 3000});
        }else if(e.response.status === 404){
          this.$toast.add({
            severity:'error', 
            summary: 'Error', 
            detail: e.response.data.message,
            life: 3000});
        }
      }
    },
    async forgetPassword(){
      try{
        if(!this.email){
          this.$toast.add({
            severity:'error', 
            summary: 'Error', 
            detail: 'Por favor llene el campo de email',
            life: 3000});
          return 
        }
        const email = this.email
        await forgetPassword({email})
        this.$toast.add({
          severity:'success', 
          summary: 'Exito', 
          detail: 'Se ha enviado un correo para restablecer tu contraseña',
          life: 3000});
        this.$store.dispatch('setTempEmail',email)
        this.codePasswd = true
      }catch(e){
        if(e.response.status === 401){
          this.$toast.add({
            severity:'error', 
            summary: 'Error', 
            detail: e.response.data.message,
            life: 3000});
        }
      }
    }
  }
}
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