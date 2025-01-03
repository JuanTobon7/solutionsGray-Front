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
  
      <!-- Notification Preferences Section -->
      <div class="w-full bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Preferencias de Notificaciones</h3>
        <form @submit.prevent="updateNotifications">
          <div class="mb-4 flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              v-model="notifications.email"
              class="mr-2"
            />
            <label for="emailNotifications" class="text-gray-600">Notificaciones por Email</label>
          </div>
          <div class="mb-4 flex items-center">
            <input
              type="checkbox"
              id="smsNotifications"
              v-model="notifications.sms"
              class="mr-2"
            />
            <label for="smsNotifications" class="text-gray-600">No enviar notificaciones</label>
          </div>
          <button
            type="submit"
            class="w-full bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
          >
            Guardar Preferencias
          </button>
        </form>
      </div>
  
      <!-- Account Deletion Section -->
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
      changePassword() {
        if (this.passwords.new !== this.passwords.confirm) {
          alert('Las contraseñas no coinciden.');
          return;
        }
        // Perform password change logic here
        alert('Contraseña actualizada exitosamente.');
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
  