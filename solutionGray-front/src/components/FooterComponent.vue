<template>
  <footer class="bg-primary-800 text-white">
    <section class="container py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Logo de la app -->
        <div class="flex justify-center md:justify-start">
          <img 
            src="https://s3.us-east-2.amazonaws.com/viddefe.com/photos/solutionGrayLOGO-removebg.png" 
            alt="Logo de VidDeFe" 
            class="w-36 h-36 rounded-full" 
          />
        </div>

        <!-- Sección de información -->
        <div class="text-center md:text-left">
          <h3 class="text-2xl font-semibold mb-4 text-primary-50">Sobre VidDeFe</h3>
          <p class="text-sm md:text-base leading-relaxed">
            VidDeFe es una plataforma diseñada para gestionar cultos cristianos y 
            facilitar la organización de la iglesia. ¡Conoce más sobre nosotros!
          </p>
        </div>

        <!-- Sección de desarrolladores -->
        <div class="text-center md:text-left">
          <div class="text-center md:text-left">
            <h3 class="text-2xl font-semibold text-primary-50 flex items-center gap-2">
              <span>Conéctate con los desarrolladores</span>
              <button 
                @click="toggleDevs" 
                class="material-symbols-outlined text-2xl text-white rounded-full p-1 ">
                visibility
              </button>
            </h3>
          </div>
          <Dialog 
            v-model:visible="showDevs" 
            modal  
            header="Contacto de Desarrolladores" 
            class="w-3/4 md:w-1/2 transition-all transform duration-200">    
            <p class="mb-2">VidDeFe nació como una solución para los desafíos de organización en las iglesias, combinando tecnología con nuestra fe en Dios para facilitar su gestión diaria.</p> 
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div 
                v-for="dev in developers" 
                :key="dev.name" 
                class="w-full p-4 rounded-lg shadow-md shadow-gray-300 hover:-translate-y-1 hover:shadow-gray-400 transition-transform">
                <div class="flex items-center gap-4 mb-4">
                  <img 
                    :src="dev.avatar" 
                    :alt="dev.name" 
                    class="w-20 h-20 rounded-full border-3 border-primary-800 object-cover" />
                  <div>
                    <h4 class="text-lg font-bold" >{{ dev.name }}</h4>
                    <p class="text-sm font-medium">{{ dev.role }}</p>
                  </div>
                </div>
                <p class="text-sm mb-4">{{ dev.description }}</p>
                <div class="flex flex-wrap justify-start gap-1 md:gap-3">
                  <a 
                    v-if="dev.github" 
                    :href="dev.github" 
                    target="_blank" 
                    class="flex items-center gap-2 hover:text-gray-800">
                    <i class="pi pi-github text-xl"></i>
                    <span>GitHub</span>
                  </a>
                  <a 
                    v-if="dev.linkedin" 
                    :href="dev.linkedin" 
                    target="_blank" 
                    class="flex items-center gap-2 hover:text-gray-800">
                    <i class="pi pi-linkedin text-xl"></i>
                    <span>LinkedIn</span>
                  </a>
                  <a 
                    v-if="dev.gmail" 
                    :href="dev.gamil" 
                    target="_blank" 
                    class="flex items-center gap-2 cursor-pointer hover:text-gray-800">
                    <i class="pi pi-google text-xl"></i>
                    <span>Gmail</span>
                  </a>
                </div>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </section>
  </footer>
</template>

<script>
import 'primeicons/primeicons.css'; // Asegúrate de importar los estilos de PrimeIcons
import Dialog from 'primevue/dialog';

export default {
  components: {
    Dialog
  },
  name: "FooterComponent",
  data() {
    return {
      showDevs: false,
      developers: [
          {
            name: "Juan Carlos Tobón Montoya",
            github: 'https://github.com/JuanTobon7',
            linkedin: 'https://linkedin.com/in/juan-carlos-tobon-montoya',
            gmail: 'jctobon11.2@gmail.com',
            role: "Desarrollador Full Stack",
            description: 'Ingeniero de Sistemas y Computación de la Universidad de los Llanos. Lideré el desarrollo de VidDeFe, encargándome de construir la infraestructura de la base de datos, el backend y el frontend.',
            avatar: 'https://s3.us-east-2.amazonaws.com/viddefe.com/photos/JuanT.jpeg'
          },
          {
            name: 'Jhon Matthew Vanegas',
            github: 'https://github.com/jhonmatt811',
            linkedin: 'https://linkedin.com/in/jhon-matthew-vanegas-buitrago',
            gmail: 'j.m.v.b811@gmail.com',
            role: 'Desarrollador Front-end',
            description: 'Ingeniero de Sistemas y Computación de la Universidad de los Llanos. Participé en el desarrollo de la aplicación web, enfocándome en implementar funcionalidades clave y mejoras de accesibilidad.',
            avatar: 'https://s3.us-east-2.amazonaws.com/viddefe.com/photos/Matthew.jpeg'
          },
          
      ]
    };
  },
  methods: {
    toggleDevs() {
      this.showDevs = !this.showDevs;
    }
  }
};
</script>
