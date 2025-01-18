<template>
    <div
      class="container mx-auto p-8 flex flex-col items-center rounded-lg shadow-lg bg-gradient-to-b from-primary-800 to-primary-600 w-auto  md:w-[60vh]"
    >
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img
          src="https://s3.us-east-2.amazonaws.com/viddefe/photos/solutionGrayLOGO-removebg.png"
          alt="Solution Gray Logo"
          class="h-[20vh] w-[20vh] object-contain"
        />
      </div>
  
      <!-- Contenedor de verificación -->
      <div v-if="step===1" class="flex flex-col items-center">
        <h2 class="text-2xl font-bold mb-4 text-center text-white">Código de Verificación</h2>
        <p class="mb-6 text-center text-white">
          Ingresa el código de verificación que enviamos a tu correo electrónico.
        </p>
  
        <!-- Casillas para el código -->
        <div class="flex gap-2 mb-6">
            <InputOtp v-model="code" integerOnly />
        </div>
  
        <!-- Botón para enviar -->
        <button
          @click="verifyCode"
          class="mt-6 bg-primary-500 text-white py-2 px-6 rounded-md hover:bg-primary-400 transition-colors"
        >
          Verificar
        </button>
      </div>
      <div v-else-if="step===2">
        <h2 class="text-2xl font-bold mb-4 text-center text-white">Nueva Contraseña</h2>
        <div class="flex flex-col mb-2 w-full">
            <label class="block text-primary-50 text-md font-bold mb-2" for="password">
              Contraseña
            </label>
            <Password 
              v-model="password" 
              placeholder="***********" 
              toggleMask 
              input-class="py-2 px-3 w-full"
            />
          </div>
          <div class="flex flex-col mb-6 w-full">
            <label class="block text-primary-50 text-md font-bold mb-2" for="password-confirmation">
              Confirmar Contraseña
            </label>
            <Password 
              v-model="passwordConfirmation" 
              placeholder="***********" 
              toggleMask 
              :feedback="false"
              input-class="py-2 px-3 w-full"
            />
          </div>
        <!-- Botón para enviar -->
        <button
          @click="resetForgetPassword"
          class="mt-6 bg-primary-500 text-white py-2 px-6 rounded-md hover:bg-primary-400 transition-colors"
        >
          Verificar
        </button>
      </div>
    </div>
  </template>
  
  <script>
import InputOtp from 'primevue/inputotp';
import Password from 'primevue/password';
import { updatePassword, verifyCode } from '../apiServices/';
  export default {
    components: {
      InputOtp,
      Password
    },
    data() {
      return {
        code: null,
        step: 1,
        password: null,
        passwordConfirmation: null
      };
    },
    methods: {
        async verifyCode(){
            try{
                const code = this.code
                if(!code){
                    this.$toast.add({severity: 'error',summary:'Error', detail: 'Datos Incompletos',life:3000})
                    return                    
                }
                const data = {
                    code,
                    email: this.$store.getters.tempEmail
                }
                await verifyCode(data)
                this.$toast.add({severity: 'success',summary:'Exito', detail: 'Código Verificado',life:3000})
                this.step = 2
            }catch(e){
                if(e.response.status === 401 && e.respons.data.message === 'Token Expired'){
                    this.$toast.add({severity: 'error',summary:'Error', detail: 'Ups algo ocurrio, intentalo de nuevo',life:3000})    
                }else{
                    this.$toast.add({severity: 'error',summary:'Error', detail: e.response.data.message,life:3000})
                }
            }
        },
        async resetForgetPassword(){
          try{
            if (this.password !== this.passwordConfirmation) {
              this.$toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Las contraseñas no coinciden',
                life: 3000,
              });
              return;
            }
            await updatePassword({
            email: this.$store.getters.tempEmail,
            password: this.password,
            passwordConfirmation: this.passwordConfirmation
          })
          }catch(e){
            if(e.response.status === 401 && e.respons.data.message === 'Token Expired'){
                    this.$toast.add({severity: 'error',summary:'Error', detail: 'Ups algo ocurrio, intentalo de nuevo',life:3000})    
            }else{
                this.$toast.add({severity: 'error',summary:'Error', detail: e.response.data.message,life:3000})
            }
          }
        }
    }
  };
  </script>
  