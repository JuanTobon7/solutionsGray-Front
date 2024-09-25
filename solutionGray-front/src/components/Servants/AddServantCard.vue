<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 min-h-screen mx-auto">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-full personal-animated relative">      
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-700 hover:text-gray-800 material-symbols-outlined text-3xl">
        close
      </button>
      <div class="text-center">        
        <img src="../../assets/shepPNG-removebg-preview.png" alt="Logo" class="w-28 mx-auto" shape="circle">
        <h2 class="text-4xl font-bold text-second-800">
          Invitar a un nuevo voluntario
        </h2>
      </div>
      <!-- Mensaje de selección de opción -->
      <p v-if="!optionSelected" class="text-lg mb-4">¿Deseas invitar a alguien ya registrado en la aplicación o alguien nuevo?</p>
      <div v-if="!optionSelected" class="flex gap-4 mb-6">
        <button @click="selectOption('new')" class="text-white text-lg font-bold px-3 py-2 rounded-md bg-second-500">
          Invitar nuevo
        </button>
        <button @click="selectOption('registered')" class="text-white text-lg font-bold px-3 py-2 rounded-md bg-second-500">
          Invitar ya registrado
        </button>
      </div>
      
      <!-- Formulario para invitar nuevo voluntario -->
      <div v-if="optionSelected === 'new'" class="px-8 pt-8 pb-2">
        <SheduleNewPerson @personCreated="handlePersonCreated" @close="resetSelection" />
        <div v-if="isLoading" class="flex justify-center mt-4">
          <span>Cargando...</span>
        </div>
      </div>
      
      <!-- Tabla para invitar personas ya registradas -->
      <div v-if="optionSelected && optionSelected === 'registered'" class="p-8">
        <DataTable
          :value="people" 
          class="w-full border-collapse" 
          paginator 
          :rows="10" 
          filterDisplay="menu"
          selectionMode="single"
          v-model:selection="selectedPerson"         
          @update:selection="onPersonSelected" 
          dataKey="id"
          tableStyle="min-width: 50rem"
          :disabled="isLoading"
        >
          <Column field="first_name" header="Nombre" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="last_name" header="Apellido" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="email" header="Email" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="phone" header="Teléfono" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
          <Column field="type_person" header="Tipo de Persona" class="p-4 text-center border-b border-primary-200 text-second-800"></Column>
        </DataTable>
      </div>
      
      <!-- Diálogo de confirmación para enviar invitación -->
      <Dialog v-if="selectedPerson" header="Confirmar invitación" visible="true" @hide="selectedPerson = null" :modal="true" :closable="false">
        <div class="flex flex-col items-center gap-4 py-8 px-10 bg-gray-100 rounded-lg shadow">
          <Avatar
            v-if="selectedPerson.avatar"
            :image="selectedPerson.avatar"
            size="xlarge"
            shape="circle"
            class="shadow-md"
          />
          <Avatar
            v-else
            :label="getInitials(selectedPerson)"
            class="bg-primary-100 flex items-center justify-center text-primary-800 shadow-md"
            size="xlarge"
            shape="circle"
          />
          <div class="text-center">
            <p class="text-lg font-bold text-gray-800">{{ selectedPerson.first_name }} {{ selectedPerson.last_name }}</p>
            <p class="text-gray-600">{{ selectedPerson.email }}</p>
            <p class="text-gray-600">{{ selectedPerson.phone }}</p>
            <p class="text-gray-600">{{ selectedPerson.type_person }}</p>
          </div>
        </div>
        <div class="flex justify-end mt-6 gap-4">
          <button @click="selectedPerson = null" class="text-second-500 text-lg font-bold px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
            Cancelar
          </button>
          <button @click="sendInvitationToSelectedPerson" class="text-white text-lg font-bold px-3 py-2 rounded-md bg-second-500 shadow-lg hover:shadow-xl transition-shadow">
            Confirmar
          </button>
        </div>
      </Dialog>

      <!-- Botón de Volver -->
      <div v-if ="optionSelected" class="flex justify-end mt-6">
        <button @click="resetSelection" class="flex items-center justify-center px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
          <i class="material-symbols-outlined mr-2">arrow_back</i>
          Volver
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { sendInvitationBoarding,getPeople } from '@/apiServices';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Avatar from 'primevue/avatar';
import SheduleNewPerson from '../subComponents/SheduleNewPerson.vue';

export default {
  emits: ['close', 'toast-status'],
  components: {
    DataTable,
    Column,
    Dialog,
    Avatar,
    SheduleNewPerson
  },
  data() {
    return {
      people: [],
      selectedPerson: null,
      optionSelected: null,
      newPerson: null,
      isLoading: false // Para manejar el estado de carga
    };
  },
  methods: {
    async sendInvitationToPerson(person) {
      try {
        const response = await sendInvitationBoarding(person);
        this.setMessage(response.message, response.status === 200 ? 'Success' : 'Error');
      } catch (error) {
        this.setMessage(error.response.data.message, 'Error');
      }
    },
    async getPeopleNew() {
      try {
        const response = await getPeople();
        this.people = response;
      } catch (error) {
        this.setMessage('Error al cargar los datos', 'Error');
      }
    },
    selectOption(option) {
      this.optionSelected = option;
      if (option === 'registered') {
        this.getPeopleNew();
      }
    },
    resetSelection() {
      this.optionSelected = null;
      this.selectedPerson = null;
      this.newPerson = null;
    },
    setMessage(message, severity) {
      this.$emit('toast-status', severity);
      this.$toast.add({
        severity,
        summary: severity,
        detail: message,
        life: 4000,
        closable: true,
      });
    },
    onSelectionChange(event) {
      this.selectedPerson = event.value;
    },
    getInitials(person) {
      if (!person) return '';
      return person.first_name.charAt(0) + person.last_name.charAt(0);
    }
  }
};
</script>
