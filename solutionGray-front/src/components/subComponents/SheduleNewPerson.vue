<template>
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Cédula</label>
          <input v-model="newPerson.cc" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-second-500 focus:border-second-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input v-model="newPerson.first_name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-second-500 focus:border-second-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Apellido</label>
          <input v-model="newPerson.last_name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-second-500 focus:border-second-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="newPerson.email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-second-500 focus:border-second-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input v-model="newPerson.phone" type="tel" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-second-500 focus:border-second-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de persona</label>
          <Dropdown
            id="types_people"
            v-model="newPerson.type_person_id"
            :options="typesPeople"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione un tipo de persona"
            required
            class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div class="flex justify-end gap-4">
        <button @click="$emit('close')" type="button" class="text-second-500 text-lg font-bold px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancelar
        </button>
        <button type="submit" class="text-white text-lg font-bold px-4 py-2 rounded-md bg-second-500 shadow-lg hover:shadow-xl transition-shadow">
          Registrar
        </button>
      </div>
    </form>
  </template>
  
  
  <script>
  import Dropdown from 'primevue/dropdown';
  import { getTypesPeople } from '@/apiServices';
  
  export default {
    components: {
      Dropdown,
    },
    data() {
      return {
        newPerson: {
          cc: '',
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          type_person_id: '',
          state_id: '',
          church_id: ''
        },
        typesPeople: []
      };
    },
    methods: {
      async getTypesPeople() {
        try {
          const response = await getTypesPeople();
          this.typesPeople = response;
        } catch (error) {
          console.error(error);
        }
      },
      handleSubmit() {
        // Emitir evento de persona creada con los datos
        this.$emit('personCreated', this.newPerson);
      }
    },
    mounted() {
      this.getTypesPeople();
    }
  };
  </script>
  