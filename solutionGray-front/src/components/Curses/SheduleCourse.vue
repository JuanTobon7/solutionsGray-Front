<template>
    <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="container max-w-3xl bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">Horarios de Atención</h2>
          <button @click="$emit('close')" class="text-gray-600 hover:text-gray-800 transition">
            <i class="material-symbols-outlined">close</i>
          </button>
        </div>
  
        <!-- Grid de Profesores -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <!-- Tarjetas de Profesores -->
          <div 
            v-for="(professor, index) in professors" 
            :key="index" 
            class="bg-white shadow-md rounded-lg p-6 cursor-pointer transition-transform duration-200 hover:-translate-y-2 hover:shadow-lg hover:bg-gray-50 flex flex-col justify-between h-full">
            
            <!-- Información del Profesor -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800">{{ professor.name }}</h3>
              <p class="text-gray-500">{{ professor.title }}</p>
    
              <!-- Lista de Horarios -->
              <div class="mt-4">
                <h4 class="text-md font-semibold text-gray-700">Horarios:</h4>
                <ul class="mt-2 space-y-2">
                  <li v-for="(schedule, idx) in professor.schedules" :key="idx" class="flex flex-col justify-between items-center bg-gray-100 p-2 rounded-md">
                    <span class="text-gray-700 font-medium">{{ schedule.day }}</span>
                    <span class="text-gray-600">{{ schedule.time }}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Botón Agendar Cita -->
            <div class="flex items-end justify-end mt-4">
              <button class="bg-second-500 text-white py-2 px-4 rounded-md hover:bg-second-600 transition-colors shadow-md w-full">
                Agendar Cita
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // Datos simulados de profesores y sus horarios de atención
        professors: [
          {
            name: 'Juan Pérez',
            title: 'Profesor de Teología',
            schedules: [
              { day: 'Lunes', time: '9:00 AM - 11:00 AM' },
              { day: 'Miércoles', time: '2:00 PM - 4:00 PM' },
            ],
          },
          {
            name: 'Ana González',
            title: 'Profesora de Estudios Bíblicos',
            schedules: [
              { day: 'Martes', time: '10:00 AM - 12:00 PM' },
              { day: 'Jueves', time: '1:00 PM - 3:00 PM' },
            ],
          },
          {
            name: 'Carlos Martínez',
            title: 'Profesor de Historia Cristiana',
            schedules: [
              { day: 'Viernes', time: '3:00 PM - 5:00 PM' },
            ],
          },
          {
            name: 'Juan Pérez',
            title: 'Profesor de Teología',
            schedules: [
              { day: 'Lunes', time: '9:00 AM - 11:00 AM' },
              { day: 'Miércoles', time: '2:00 PM - 4:00 PM' },
            ],
          },
          {
            name: 'Ana González',
            title: 'Profesora de Estudios Bíblicos',
            schedules: [
              { day: 'Martes', time: '10:00 AM - 12:00 PM' },
              { day: 'Jueves', time: '1:00 PM - 3:00 PM' },
            ],
          },
          {
            name: 'Carlos Martínez',
            title: 'Profesor de Historia Cristiana',
            schedules: [
              { day: 'Viernes', time: '3:00 PM - 5:00 PM' },
            ],
          },
          {
            name: 'Juan Pérez',
            title: 'Profesor de Teología',
            schedules: [
              { day: 'Lunes', time: '9:00 AM - 11:00 AM' },
              { day: 'Miércoles', time: '2:00 PM - 4:00 PM' },
            ],
          },
          {
            name: 'Ana González',
            title: 'Profesora de Estudios Bíblicos',
            schedules: [
              { day: 'Martes', time: '10:00 AM - 12:00 PM' },
              { day: 'Jueves', time: '1:00 PM - 3:00 PM' },
            ],
          },
          
        ],
      };
    },
  };
</script>