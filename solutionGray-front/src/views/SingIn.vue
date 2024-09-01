<template>
    <section 
    class="w-full h-screen flex items-center justify-center right-0 ctn-cllg">
      <div
        v-if="isAuthInvitation"
        class="w-[60vh] h-auto md:h-[90vh] shadow-lg shadow-primary-900 rounded-lg bg-gradient-to-b from-primary-800 to-primary-600 p-8 flex flex-col items-center container"
      >
        <div class="flex justify-center mb-2">
          <img src="../assets/register-removebg.png" class="h-[30vh] w-[30vh]" />
        </div>
        <div class="w-full flex flex-col items-center">
          <h1 class="text-center font-serif text-primary-50 text-5xl mb-8">
            <strong>Registrarme</strong>
          </h1>
          <form class="w-full max-w-sm">
            <div class="mb-2">
              <label class="block text-primary-50 text-md font-bold mb-2" for="email"> Email </label>
              <input
              v-model="email"
                class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
              />
            </div>
            <div class="mb-2">
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
            <div class="mb-2">
              <label class="block text-primary-50 text-md font-bold mb-2" for="password-confirmation">
                Confirmar Contraseña
              </label>
              <input
              v-model="passwordConfirmation"
                class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password-confirmation"
                type="password"
                placeholder="***********"
              />
            </div>
            <div class="flex flex-grow items-center  justify-center mb-2 gap-4">
              <div class="flex flex-col">
                <label class="block text-primary-50 text-md font-bold mb-2" for="birthday">Fecha de Nacimiento</label>
                <input
                  v-model="birdthday"
                  class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="birthday"
                  type="date"
                  placeholder="dd-mm-yyyy"
              />
              </div>
              <div class="flex flex-col"> 
                <label class="block text-primary-50 text-md font-bold mb-2" for="genero">Genero</label>
                <input
                v-model="genero"
                class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="genero"
                type="gender"
                placeholder="Masculino/Femenino"
                />
              </div>
            </div>
            <div class="flex items-center justify-around mb-8">            
              <button
              @click="loginUser"
                class="bg-primary-400 hover:bg-primary-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Crear Usuario
              </button>
            </div>
          </form>
          <span>{{message}}</span>
          <span class="text-primary-50 hover:">Terminos y Condiciones de Privacidad</span>
        </div>
      </div>
    </section>
  </template>

<script>
import vidImage from '../assets/vid.png';
export default {
    data() {
        return {
            name: null,
            email: null,
            password: null,
            passwordConfirmation: null,
            birdthday: null,
            genero: null,
            backgroundImage: vidImage,
            isAuthInvitation: null
        }
    },
    mounted(){
      this.isAuthInvitation = this.$store.getters.authInvitation ? true : false;
    }
}
</script>

<style scoped>
.ctn-cllg {
  background-image: url('../assets/vid.png');
  background-position: left;
  background-size: cover;
  background-repeat: no-repeat;
  max-height: 50%;
  max-width: 100%;
}
</style>