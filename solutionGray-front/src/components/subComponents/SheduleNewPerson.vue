<template>
  <form @submit.prevent="handleSubmit">
    <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Columna 1: Campos de texto -->
      <div>
        <!-- Campo Cédula -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Cédula</label>
          <input v-model="newPerson.cc" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-second-500 focus:border-second-500">
        </div>

        <!-- Campo Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input v-model="newPerson.first_name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-second-500 focus:border-second-500">
        </div>

        <!-- Campo Apellido -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Apellido</label>
          <input v-model="newPerson.last_name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-second-500 focus:border-second-500">
        </div>

        <!-- Campo Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="newPerson.email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-second-500 focus:border-second-500">
        </div>

        <!-- Campo Teléfono -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input v-model="newPerson.phone" type="tel" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-second-500 focus:border-second-500">
        </div>
      </div>

      <!-- Columna 2: Dropdowns -->
      <div>
        <!-- Dropdown País -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">País</label>
          <Dropdown
            id="countries"
            v-model="newPerson.country_id"
            :options="countries"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione un país"
            required
            class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            @change="onCountryChange"
          />
        </div>

        <!-- Dropdown Estado/Provincia -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado/Provincia</label>
          <Dropdown
            id="states"
            v-model="newPerson.state_id"
            :options="states"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione un estado/provincia"
            required
            class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            :disabled="!states.length"
          />
        </div>

        <!-- Dropdown Tipo de Persona -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de persona</label>
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
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-4 mt-4">
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
  import { getTypesPeople, getCountries, getStatesByCountry } from '@/apiServices';
  
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
          country_id: '',
          state_id: '',
          type_person_id: '',
          church_id: ''
        },
        countries: [], // Lista de países
        states: [], // Lista de estados filtrados según el país seleccionado
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
      async loadCountries() {
        try {
          const response = await getCountries(); // Obtener países desde la BD
          this.countries = response;
        } catch (error) {
          console.error('Error al cargar los países:', error);
        }
      },
      async onCountryChange() {
        const countryId = this.newPerson.country_id;
        try {
          const response = await getStatesByCountry(countryId); // Obtener estados según el país seleccionado
          this.states = response;
        } catch (error) {
          console.error('Error al cargar los estados:', error);
        }
      },
      handleSubmit() {
        // Emitir evento de persona creada con los datos
        this.$emit('personCreated', this.newPerson);
      }
    },
    mounted() {
      this.getTypesPeople();
      this.loadCountries(); // Cargar la lista de países al montar el componente
    }
  };
  </script>
  