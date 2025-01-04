<template>
  <footer class="bg-primary-800 text-white">
    <section class="container py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Foto de la app -->
        <div class="flex justify-center md:justify-start">
          <img 
            src="../assets/solutionGrayLOGO-removebg.png" 
            alt="Logo de Ekklesia" 
            class="w-32 h-32 rounded-full" 
          />
        </div>

        <!-- Sección de información -->
        <div class="text-center md:text-left">
          <h3 class="text-2xl font-semibold mb-4 text-primary-50">Sobre Ekklesia</h3>
          <p class="text-sm md:text-base">
            Ekklesia es una plataforma diseñada para gestionar cultos cristianos y 
            facilitar la organización de la iglesia. ¡Conoce más sobre nosotros!
          </p>
        </div>

        <!-- Sección de desarrolladores -->
        <div class="text-center md:text-left">
          <h3 class="text-2xl font-semibold mb-4 text-primary-50">Conéctate con los desarrolladores</h3>
          <div class="flex justify-center md:justify-start space-x-6">
            <a href="https://github.com/JuanTobon7" target="_blank" class="flex items-center text-lg hover:text-primary-400 gap-2">
              <i class="pi pi-github text-xl"></i> 
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/juan-carlos-tobon-montoya" target="_blank" class="flex items-center text-lg hover:text-primary-400 gap-2">
              <i class="pi pi-linkedin text-xl"></i> 
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </footer>
</template>

<script>
import 'primeicons/primeicons.css'; // Asegúrate de importar los estilos de PrimeIcons

export default {
  name: "FooterComponent", // Nombre del componente, por si lo necesitas reutilizar
};
</script>

