<template>
  <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 min-h-screen flex items-center justify-center">
    <div class="container px-2 mx-auto max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl overflow-hidden flex items-center justify-center">
      <div class="relative bg-white sm:px-10 pt-4 sm:pt-2 pb-3 rounded-lg shadow-lg max-h-[95vh] overflow-auto px-3">
        
        <!-- Close Button -->
        <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-700 hover:text-gray-800 material-symbols-outlined text-3xl">
          close
        </button>

        <!-- Header Section with Logo and Title -->
        <div class="text-center mb-4">
          <img src="https://s3.us-east-2.amazonaws.com/viddefe.com/photos/shepPNG-removebg-preview.png" alt="Logo" class="w-24 sm:w-32 mx-auto">
          <h2 class="text-2xl sm:text-3xl font-bold text-second-800">
            Invitar a un nuevo voluntario
          </h2>
        </div>

        <!-- Selection Message -->
        <p v-if="!optionSelected" class="text-lg mb-4 text-center">
          ¿Deseas invitar a alguien ya registrado en la aplicación o alguien nuevo?
        </p>

        <!-- Option Selection Buttons -->
        <div v-if="!optionSelected" class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button @click="selectOption('new')" class="text-white text-lg font-bold px-3 py-2 rounded-md bg-second-500">
            Invitar nuevo
          </button>
          <button @click="selectOption('registered')" class="text-white text-lg font-bold px-3 py-2 rounded-md bg-second-500">
            Invitar ya registrado
          </button>
        </div>

        <!-- New Volunteer Form -->
        <div v-if="optionSelected === 'new'" class="p-1">
          <SheduleNewPerson @personCreated="handlePersonCreated" @close="resetSelection" />
          <div v-if="isLoading" class="flex justify-center mt-4">
            <span>Cargando...</span>
          </div>
        </div>

        <!-- Registered Volunteers Table -->
        <div v-if="optionSelected === 'registered'" class="p-2 sm:p-8">
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

        <!-- Invitation Confirmation Dialog -->
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
            <button @click="sendInvitationToPerson" class="text-white text-lg font-bold px-3 py-2 rounded-md bg-second-500 shadow-lg hover:shadow-xl transition-shadow">
              Confirmar
            </button>
          </div>
        </Dialog>

        <!-- Back Button -->
        <div v-if="optionSelected" class="flex justify-end mt-4">
          <button @click="resetSelection" class="flex items-center justify-center px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
            <i class="material-symbols-outlined mr-2">arrow_back</i>
            Volver
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { sendInvitationBoarding, getPeople } from '@/apiServices';
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
    SheduleNewPerson,
  },
  data() {
    return {
      people: [],
      selectedPerson: null,
      optionSelected: null,
      newPerson: null,
      isLoading: false,
    };
  },
  methods: {
    async sendInvitationToPerson() {
      try {
        const response = await sendInvitationBoarding(this.selectedPerson);
        this.$toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message,
          life: 4000,
          closable: true,
        });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.message,
          life: 4000,
          closable: true,
        });
      }
    },
    async getPeopleNew() {
      try {
        const response = await getPeople();
        // Filtra las personas con `type_person_id` igual a 4 o 5
        console.log(response);
        const people = response.filter((person) => person.type_person_id == 5 || person.type_person_id == 4);
        console.log(people);
        this.people = people;
      } catch (error) {
        if(error.response.status === 401 && error.response.message === 'Token has expired') {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
            life: 4000,
            closable: true,
          });
          this.$emit('close');
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response.data.message,
            life: 4000,
            closable: true,
          });
        }
        console.error(error); // Añade esto para ver el error detallado
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
    handlePersonCreated(person) {
      this.people.push(person);
      this.selectedPerson = person;
      this.optionSelected = 'registered';
    },
    getInitials(person) {
      if (!person) return '';
      return person.first_name.charAt(0) + person.last_name.charAt(0);
    },
  },
};
</script>
