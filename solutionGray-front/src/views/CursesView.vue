<template>
    <section class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-primary-800">{{ course.title }}</h1>
        <p class="text-gray-700">{{ course.description }}</p>
      </div>
      
      <!-- Barra de progreso general del curso -->
      <div class="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div class="bg-green-500 h-3 rounded-full" :style="{ width: course.progress + '%' }"></div>
      </div>
  
      <!-- Listado de módulos del curso -->
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Módulos del Curso</h2>
      <div class="grid grid-cols-1 gap-4">
        <div 
          v-for="module in course.modules" 
          :key="module.id" 
          class="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 class="text-md font-semibold text-gray-800">{{ module.title }}</h3>
            <p class="text-sm text-gray-500">{{ module.description }}</p>
          </div>
          <button @click="startModule(module.id)" class="bg-primary-500 text-white py-1 px-4 rounded-md">
            {{ module.completed ? 'Revisar' : 'Iniciar' }}
          </button>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        course: {
          id: 1,
          title: 'Discipulado 1',
          description: 'Curso introductorio de discipulado',
          progress: 50,
          modules: [
            { id: 1, title: 'Módulo 1', description: 'Introducción al discipulado', completed: true },
            { id: 2, title: 'Módulo 2', description: 'El corazón del discipulado', completed: false }
          ]
        }
      };
    },
    methods: {
      startModule(id) {
        // Lógica para iniciar o continuar el módulo
        console.log('Iniciando módulo', id);
      }
    }
  };
  </script>
  