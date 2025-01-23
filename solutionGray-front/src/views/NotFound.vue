<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-primary-50">
      <!-- Título -->
      <h1 class="text-8xl font-extrabold text-primary-900">404</h1>
      <!-- Subtítulo -->
      <p class="mt-4 text-xl text-gray-600">Lo sentimos, la página que buscas no existe 😢</p>
      <!-- Imagen opcional -->
       <i class="material-symbols-outlined text-9xl text-primary-900">
        sentiment_dissatisfied
       </i>
      <!-- Botón para volver al inicio -->
      <router-link
        to="/"
        class="mt-6 px-6 py-3  bg-primary-500 rounded-lg shadow-md hover:bg-primary-600 hover:shadow-lg transition duration-300"
      >
        Volver al inicio
      </router-link>
    </div>
</template>  