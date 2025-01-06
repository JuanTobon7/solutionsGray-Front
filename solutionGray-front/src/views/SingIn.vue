<template>
  <section 
    class="w-full h-screen flex items-center justify-center right-0 ctn-cllg contain">
    <div
      v-if="isAuthInvitation"
      class="w-[60vh] sm:h-[95vh] md:h-[85vh] shadow-lg shadow-primary-900 rounded-lg bg-gradient-to-b from-primary-800 to-primary-600 p-8 flex flex-col items-center container"
    >
      <div class="flex justify-center mb-2">
        <img src="https://vid-de-fe.s3.us-east-2.amazonaws.com/photos/register-removebg.png" class="h-[30vh] w-[30vh]" />
      </div>
      <div class="w-full flex flex-col items-center">
        <h1 class="text-center font-serif text-primary-50 text-5xl mb-4 lg:mb-8">
          <strong>Registrarme</strong>
        </h1>
        <form class="w-full max-w-sm" @submit.prevent="validateForm">
          <div class="mb-2">
            <label class="block text-primary-50 text-md font-bold mb-2" for="email"> Email </label>
            <input
              v-model="email"
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              readonly
            />
          </div>
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
          <div v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</div>          
          <div class="flex items-center justify-around mb-8">
            <button
              @click="validateForm"
              class="bg-primary-400 hover:bg-primary-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Crear Usuario
            </button>
          </div>
        </form>
        <span>{{message}}</span>
        <span class="text-primary-50 text-center cursor-pointer">Términos y Condiciones de Privacidad</span>
      </div>
    </div>
  </section>
</template>

<script>
import Password from 'primevue/password';
import { createUsers } from '@/apiServices';

export default {
  components: {
    Password
  },
  data() {
    return {
      name: null,
      email: this.$store.getters.tempEmail ,  // Obtener el email desde el state
      password: null,
      passwordConfirmation: null,
      birdthday: null,
      genero: null,
      backgroundImage: 'https://vid-de-fe.s3.us-east-2.amazonaws.com/photos/vid.png',
      isAuthInvitation: null,
      error: '',  // Para mostrar mensajes de error
      message: '',  // Para mostrar mensajes de éxito
    };
  },
  mounted(){
    this.isAuthInvitation = this.$store.getters.authInvitation ? true : false;
    console.log(this.$route.state?.email);
  },
  methods: {
    async validateForm() {
      this.error = '';  // Limpiar mensajes de error anteriores
      if(!this.email || !this.password || !this.passwordConfirmation){
        this.error = 'Por favor, completa todos los campos.';
        return;
      }
      // Verificación de que las contraseñas coincidan
      if (this.password !== this.passwordConfirmation) {
        this.error = 'Las contraseñas no coinciden.';
        return;
      }

      // Si las contraseñas coinciden, se puede continuar con el registro
      await this.registerUser();
    },
    async registerUser() {
      // Aquí puedes proceder con el registro (por ejemplo, enviar los datos a la API)
      console.log('Registrando usuario con los datos:', {
        email: this.email,
        password: this.password,
        birthday: this.birdthday,
        genero: this.genero
      });

      const response = await createUsers({
        email: this.email,
        password: this.password,
        birthday: this.birdthday,
        genero: this.genero
      });

      this.$toast.add({
        severity: 'info',
        summary: 'Registro',
        detail: response.message,
        life: 5000,
      });
      this.$router.push({ path: '/login' });
      console.log(response);
    }
  }
}
</script>

<style scoped>
.ctn-cllg {
  background-image: url('https://vid-de-fe.s3.us-east-2.amazonaws.com/photos/vid.png');
  background-position: left;
  background-size: cover;
  background-repeat: no-repeat;
  max-height: 50%;
  max-width: 100%;
}
</style>
