<template>
    <div class="w-full max-w-4xl mx-auto flex flex-col items-center">
      <h2 class="text-2xl font-bold text-gray-800 text-center mb-4">Configuración</h2>
  
      <!-- Change Password Section -->
      <div class="w-full bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Cambiar Contraseña</h3>
        <form @submit.prevent="changePassword">
          <div class="mb-4">
            <label for="currentPassword" class="block text-gray-600 mb-1">Contraseña Actual</label>
            <input
              type="password"
              id="currentPassword"
              v-model="passwords.current"
              class="input-opt"
              required
            />
          </div>
          <div class="mb-4">
            <label for="newPassword" class="block text-gray-600 mb-1">Nueva Contraseña</label>
            <input
              type="password"
              id="newPassword"
              v-model="passwords.new"
              class="input-opt"
              required
            />
          </div>
          <div class="mb-4">
            <label for="confirmPassword" class="block text-gray-600 mb-1">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="passwords.confirm"
              class="input-opt"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
  
      <div class="w-full bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-red-600 mb-4">Eliminar Cuenta</h3>
        <p class="text-gray-600 mb-4">
          Esta acción es irreversible. Si eliminas tu cuenta, toda tu información será permanentemente borrada.
        </p>
        <button
          @click="deleteAccount"
          class="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Eliminar Cuenta
        </button>
      </div>
    </div>
  </template>
  
  <script>
import { resetPassword } from '@/apiServices';

  export default {
    name: 'ConfigurationView',
    data() {
      return {
        passwords: {
          current: '',
          new: '',
          confirm: '',
        },
        notifications: {
          email: false,
          sms: false,
        },
      };
    },
    methods: {
      async changePassword() {
        try{          
          if (this.passwords.new !== this.passwords.confirm) {
            this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Las contraseñas no coinciden.',
            life: 3000
          });
          return;
        }
        const payload = {
          password: this.passwords.current, 
          newPassword: this.passwords.new, 
          personId: this.$store.getters.user.id
        }
        await resetPassword(payload)
        this.passwords = {
          current: '',
          new: '',
          confirm: '',
        }
        this.$toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Contraseña actualizada exitosamente.',
          life: 3000
        });
        }catch(e){
          if(e.response.status === 401 && e.response.data.message === 'Token Expired'){
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ups algo paso, intentalo de nuevo',
              life: 3000
            });
          }else{
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Contraseña actual incorrecta',
              life: 3000
            });
          }
        }
      },
      updateNotifications() {
        // Perform notification preferences update logic here
        alert('Preferencias de notificaciones actualizadas.');
      },
      deleteAccount() {
        if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
          // Perform account deletion logic here
          alert('Cuenta eliminada exitosamente.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .input-opt {
    @apply mb-1 p-2 w-full border rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500;
  }
  </style>
  