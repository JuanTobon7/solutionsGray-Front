<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="container bg-primary-50 dark:bg-primary-700 p-6 rounded-lg shadow-lg max-w-lg w-full animate-fade-down animate-once animate-duration-[300ms] animate-ease-linear">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-primary-900 dark:text-white">Programar Culto</h2>
        <img src="../../assets/shepPNG-removebg-preview.png" class="w-16 h-16" alt="Shepherd Icon" />
      </div>
      <div class="space-y-4">
        <!-- Nombre del Culto -->
        <div class="flex flex-col">
          <label for="nombre" class="text-primary-900 dark:text-white font-medium">Nombre</label>
          <input
            type="text"
            id="nombre"
            placeholder="Ej: Culto Dominical de Jóvenes"
            class="mt-1 rounded-md bg-white p-3 text-primary-950 focus:outline-none focus:ring-2 focus:ring-stone-700"
            v-model="formData.name"
            required
          />
        </div>
        <!-- Nombre del Sermon -->
        <div class="flex flex-col">
          <label for="sermon_tittle" class="text-primary-900 dark:text-white font-medium">Titulo del Sermon</label>
          <input
            type="text"
            id="sermon_tittle"
            placeholder="Ej: La importancia de la oración"
            class="mt-1 rounded-md bg-white p-3 text-primary-950 focus:outline-none focus:ring-2 focus:ring-stone-700"
            v-model="formData.sermonTittle"
            required
          />
        </div>
        <!-- Descripción -->
        <div class="flex flex-col">
          <label for="descripcion" class="text-primary-900 dark:text-white font-medium">Descripción</label>
          <textarea
            id="descripcion"
            placeholder="Ej: Enfoque del culto"
            class="mt-1 rounded-md bg-white p-3 text-primary-950 focus:outline-none focus:ring-2 focus:ring-stone-700"
            v-model="formData.description"
            required
          ></textarea>
        </div>
        <!-- Fecha y Hora -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label for="fecha" class="text-primary-900 dark:text-white font-medium">Fecha</label>
            <input
              type="date"
              id="fecha"
              class="mt-1 rounded-md bg-white p-3 text-primary-950 focus:outline-none focus:ring-2 focus:ring-stone-700"
              v-model="formData.date"
              required
            />
          </div>
          <div class="flex flex-col">
            <label for="hora" class="text-primary-900 dark:text-white font-medium">Hora</label>
            <input
              type="time"
              id="hora"
              class="mt-1 rounded-md bg-white p-3 text-primary-950 focus:outline-none focus:ring-2 focus:ring-stone-700"
              v-model="formData.hora"
              required
            />
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-6 space-x-2">
        <button @click="$emit('close')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">Cerrar</button>
        <button @click="submitForm" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script>
import {createWorshipService} from '@/apiServices/index'

export default {
  emits: ['close', 'toast-status'],
  data() {
    return {
      formData: {
        name: '',
        sermonTittle: '',
        description: '',
        date: null,
        hora: null,
      },
      message: null,
    };
  },
  methods: {
    async submitForm() {
      try{        
        if (!this.formData.date || !this.formData.hora || !this.formData.name || !this.formData.sermonTittle || !this.formData.description) {
          this.message = 'Por favor, complete todos los campos';
        return this.showToast('error');
      }      
      const dateUser = new Date(`${this.formData.date}T${this.formData.hora}:00.000Z`);

      if (isNaN(dateUser.getTime())) {
          console.error('Invalid Date:', `${this.formData.date}T${this.formData.hora}:00.000Z`);
          this.message = 'Error: Invalid date or time';
          return this.showToast('error');
      }

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('userTimezone', userTimezone);
      const data = {
        ...this.formData,
        date: dateUser.toISOString(),
        userTimezone,
      };
      console.log('data send', data);
      const response = await createWorshipService(data);
    
      this.message = response;
      this.showToast('success');
      this.$emit('worshipServiceAdded');
    }catch(error){
      console.log('here in addWorshipError',error);
      this.message = error.response.data.message;
      this.showToast('error');
    }},
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
