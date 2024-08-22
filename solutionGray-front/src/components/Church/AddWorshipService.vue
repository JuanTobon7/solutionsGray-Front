<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-primary-50 dark:bg-primary-700 p-8 rounded-lg shadow-lg max-w-4xl animate-fade-down animate-once animate-duration-[300ms] animate-ease-linear">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white"><strong>Programar Culto</strong></h2>
          <img src="../../assets/shepPNG-removebg-preview.png" class="w-28 right-0" alt="Shepherd Icon"/>
        </div>
        <div>
          <!-- Nombre del Culto -->
          <div class="flex flex-col mb-4">
            <label for="nombre" class="text-gray-900 dark:text-white mb-2"><strong>Nombre</strong></label>
            <input
              type="text"
              id="nombre"
              placeholder="Ej: Culto Dominical de Jóvenes"
              class="rounded-md bg-white p-2 text-second-950 focus:outline-none focus:ring-2 focus:ring-stone-700"
              v-model="formData.nombre"
              required
            />
          </div>
          <!-- Descripción -->
          <div class="flex flex-col mb-4">
            <label for="descripcion" class="text-gray-900 dark:text-white mb-2"><strong>Descripción</strong></label>
            <input
              type="text"
              id="descripcion"
              placeholder="Ej: Enfoque del culto"
              class="rounded-md bg-white p-2 text-second-950 focus:outline-none focus:ring-2 focus:ring-stone-700"
              v-model="formData.descripcion"
              required
            />
          </div>
          <!-- Fecha y Hora -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="flex flex-col">
                <label for="fecha" class="text-gray-900 dark:text-white mb-2"><strong>Fecha</strong></label>
            <DatePicker
              id="datepicker-12h"
              v-model="formData.fecha"
              showTime
              hourFormat="12"
              class="rounded-md bg-white p-2 focus:outline-none focus:ring-2 focus:ring-stone-700 w-full"
            >
              <template #date="slotProps">
                <strong
                  v-if="slotProps.date.day > 10 && slotProps.date.day < 15"
                  class="line-through"
                >
                  {{ slotProps.date.day }}
                </strong>
                <template v-else>{{ slotProps.date.day }}</template>
              </template>
            </DatePicker>
            </div>           
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="$emit('close')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">Cerrar</button>
          <button @click="submitForm" class="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">Guardar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import DatePicker from 'primevue/datepicker';
  
  export default {
    emits: ['close', 'toast-status'],
    components: { 
        DatePicker 
    },
    data() {
      return {
        formData: {
          nombre: '',
          descripcion: '',
          fecha: null,
          hora: null,
        },
        message: null,
        dateFormat: 'dd/mm/yy'
      };
    },
    methods: {   
      showToast(severity) {
        this.$emit('toast-status', severity);
        this.$toast.add({
          severity,
          summary: severity,
          detail: this.message,
          life: 4000,
          closable: false
        });
      }
    }
  };
  </script>
  