<template>
    <aside class="fixed h-full w-[40vh] bg-primary-700 z-10 py-2 flex flex-col gap-2">
      <div class="flex flex-col items-center p-4">
          <img src="../assets/solutionGrayLOGO-removebg.png" class="w-[25vh] h-[25vh]">
          <h2 class="text-2xl font-semibold text-primary-50">Super Admin</h2>
      </div>
      <nav>
        <ul class="text-primary-50 text-xl">
          <li class=" px-4 py-2 hover:bg-primary-600 flex items-center gap-4">
            <i class="material-icons">home</i>
            <router-link to="/" class="block">Inicio</router-link>
          </li>
          <li class="px-4 py-2 hover:bg-primary-600 flex items-center gap-4">
            <i class="material-icons">info</i>
            <router-link to="/about" class="block">Acerca de</router-link>
          </li>
          <li class="px-4 py-2 hover:bg-primary-600 flex items-center gap-4">
            <i class="material-icons">contacts</i>
            <router-link to="/contact" class="block">Contacto</router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'MenuUser',
  };
  </script>
  
  <style scoped>
  /* Puedes añadir estilos personalizados aquí */
  </style>
  