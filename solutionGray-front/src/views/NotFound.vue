<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <!-- Título -->
      <h1 class="text-8xl font-extrabold text-primary">404</h1>
      <!-- Subtítulo -->
      <p class="mt-4 text-xl text-gray-600">Lo sentimos, la página que buscas no existe 😢</p>
      <!-- Imagen opcional -->
      <img src="/images/404-illustration.svg" alt="Página no encontrada" class="w-64 h-64 mt-8" />
      <!-- Botón para volver al inicio -->
      <router-link
        to="/"
        class="mt-6 px-6 py-3 text-white bg-secondary rounded-lg shadow-md hover:bg-secondary-dark hover:shadow-lg transition duration-300"
      >
        Volver al inicio
      </router-link>
    </div>
</template>  