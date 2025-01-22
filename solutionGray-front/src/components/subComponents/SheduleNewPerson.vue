<template>
  <form @submit.prevent="createPerson">
    <div class="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 md:min-w-[80vh] mb-2">
      <!-- Columna 1: Campos de texto -->
      <div class="w-3/4 md:w-full">
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
      <div class="w-3/4 md:w-full">
        <!-- Dropdown País -->
        <div class="flex flex-col mb-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">País</label>
          <Dropdown
            id="countries"
            v-model="newPerson.country_id"
            :options="countries"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione un país"
            required
            class="w-full min-w-[200px] max-w-[400px] shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            @change="onCountryChange"
          />
        </div>

        <!-- Dropdown Estado/Provincia -->
        <div class="flex flex-col mb-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado/Provincia</label>
          <Dropdown
            id="states"
            v-model="newPerson.state_id"
            :options="states"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione un estado/provincia"
            required
            class="w-full min-w-[200px] max-w-[400px] shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            :disabled="!states.length"
          />
        </div>

        <!-- Dropdown Tipo de Persona -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de persona</label>
          <Dropdown
            id="types_people"
            v-model="newPerson.type_person_id"
            :options="typesPeople"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione un tipo de persona"
            required
            class="w-full min-w-[200px] max-w-[400px] shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-end">
      <button type="submit" class="text-white text-lg font-bold px-4 py-2 rounded-md bg-second-500 shadow-lg hover:shadow-xl transition-shadow">
        Registrar
      </button>
    </div>
  </form>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import { getTypesPeople, getCountries, getStatesByCountry, savePeople } from '@/apiServices';

export default {
  components: {
    Dropdown,
  },
  data() {
    return {
      newPerson: {
        cc: null,
        first_name: null,
        last_name: null,
        email: null,
        phone: null,
        country_id: '',
        state_id: '',
        type_person_id: '',
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
      } catch (e) {
        if(e.response.status === 401 && e.response.message === 'Token Expired'){
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo paso, intentalo nuevamente', life: 3000 });
        }
      }
    },
    async loadCountries() {
      try {
        const response = await getCountries(); // Obtener países desde la BD
        this.countries = response;
      } catch (e) {
        if(e.response.status === 401 && e.response.message === 'Token Expired'){
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo paso, intentalo nuevamente', life: 3000 });
        }
      }
    },
    async onCountryChange() {
      const countryId = this.newPerson.country_id;
      try {
        const response = await getStatesByCountry(countryId); // Obtener estados según el país seleccionado
        this.states = response;
      } catch (e) {
        if(e.response.status === 401 && e.response.message === 'Token Expired'){
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo paso, intentalo nuevamente', life: 3000 });
        }
      }
    },
    async createPerson() {
      // Emitir evento de persona creada con los datos
      try {          
        if (!this.newPerson.country_id || !this.newPerson.state_id || !this.newPerson.type_person_id || !this.newPerson.cc || !this.newPerson.first_name || !this.newPerson.last_name || !this.newPerson.email || !this.newPerson.phone) {
          alert('Por favor, complete todos los campos');
          return;
        }
        const response = await savePeople(this.newPerson);
        this.$toast.add({ severity: 'success', summary: 'Persona creada', detail: 'La persona ha sido exitosamente guardada', life: 3000 });
        this.newPerson = null
        this.$emit('personCreated', response);                
      } catch (error) {       
        if (error.response && error.response.status === 400) {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 3000 });
        }
      }
    }
  },
  mounted() {
    this.getTypesPeople();
    this.loadCountries(); // Cargar la lista de países al montar el componente
  }
};
</script>
