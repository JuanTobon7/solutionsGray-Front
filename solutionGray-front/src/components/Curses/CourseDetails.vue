<template>
    <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="container max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <!-- Header -->
        <div class="flex justify-between items-center border-b pb-4 mb-4">
          <h2 class="text-2xl font-bold text-second-800">{{ courseData.title }}</h2>
          <button @click="$emit('close')" class="text-gray-600 hover:text-gray-800 transition">
            <i class="material-symbols-outlined">close</i>
          </button>
        </div>
  
        <!-- Course Description -->
        <div class="mb-4">
          <p class="text-gray-700">{{ courseData.description }}</p>
        </div>
  
        <!-- Chapter List -->
        <div>
          <h3 class="text-xl font-semibold text-second-700 mb-2">Capítulos del Curso ({{ courseData.chapters.length }})</h3>
          <ul class="space-y-2">
            <li v-for="(chapter, index) in courseData.chapters" :key="index" class="border rounded-md p-3 bg-second-50">
              <p class="text-lg font-medium text-second-800">Capítulo {{ index + 1 }}: {{ chapter.title }}</p>
            </li>
          </ul>
        </div>
  
        <!-- Footer Button -->
        <div class="mt-6 flex justify-end">
          <button @click="$emit('close')" class="bg-second-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-second-600 transition">
            Cerrar
          </button>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    props: {
      courseData: {
        type: Object,
        default: () => ({
          title: "Curso de Discipulado Avanzado",
          description: "Un curso avanzado para profundizar en el discipulado, abarcando temas teóricos y prácticos.",
          chapters: [
            { title: "Introducción al Discipulado" },
            { title: "El Corazón del Discipulado" },
            { title: "Herramientas de Enseñanza" },
            { title: "Técnicas de Liderazgo" },
            { title: "Cómo Discipular a Otros" }
          ]
        })
      }
    }
  };
  </script>
  
  <style scoped>
  /* Opcionales estilos para mejorar la interfaz */
  .container {
    max-height: 90vh;
    overflow-y: auto;
  }
  .material-symbols-outlined {
    font-size: 24px;
  }
  </style>
  