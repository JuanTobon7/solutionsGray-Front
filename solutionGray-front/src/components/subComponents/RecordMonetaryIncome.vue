<template>
  <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="container h-[95vh] w-full flex items-center justify-center sm:px-6">
      <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
        <!-- Header del modal -->
        <div class="flex justify-between items-center mb-4 sm:mb-6">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Registro de Ingresos</h2>
          <span @click="$emit('close')" class="material-symbols-outlined text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200">close</span>
        </div>

        <!-- Formulario de ingreso de datos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Selección de Moneda -->
          <div class="flex flex-col">
            <label for="currency" class="text-gray-600 mb-2 font-semibold">Tipo de Moneda</label>
            <Dropdown 
            v-model="selectedCurrency" 
            :options="currencies" 
            filter 
            optionLabel="name" 
            placeholder="Selecciona el Tipo de Moneda" 
            class="w-full md:w-14rem">
              <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex align-items-center gap-2">
                    <span style="width: 18px" :class="`fi fi-${slotProps.value.id.toLowerCase()}`"></span>
                      <div>{{ slotProps.value.currency + ' - ' +  slotProps.value.name }}</div>
                  </div>
                  <span v-else>
                      {{ slotProps.placeholder }}
                  </span>
              </template>
              <template #option="slotProps">
                  <div class="flex align-items-center gap-2">
                    <span style="width: 18px" :class="`fi fi-${slotProps.option.id.toLowerCase()}`"></span>
                      <div>{{  slotProps.option.currency + ' - ' + slotProps.option.name }}</div>
                  </div>
              </template>
            </Dropdown>
          </div>

          <!-- Selección del Donante -->
          <div class="flex flex-col">
            <label for="person" class="text-gray-600 mb-2 font-semibold">Seleccionar Donante</label>
            <Dropdown
              v-model="selectedPerson"
              :options="people"
              optionLabel="name"
              placeholder="Selecciona un Donante"
              class="w-full"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center gap-2">
                  <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center">
                      <Avatar
                        v-if="slotProps.value.avatar"
                        :image="slotProps.value.avatar"
                        shape="circle"
                      />
                      <Avatar
                        v-else
                        :label="getInitials(slotProps.value)"
                        class="bg-primary-100 flex items-center justify-center text-primary-800"
                        shape="circle"
                      />
                    </div>
                  <div>{{ slotProps.value.first_name + ' ' +slotProps.value.last_name }} - CC: {{ slotProps.value.cc }} - Phone: {{ slotProps.value.phone }}</div>
                </div>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>

              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center">
                      <Avatar
                        v-if="slotProps.option.avatar"
                        :image="slotProps.option.avatar"
                        shape="circle"
                      />
                      <Avatar
                        v-else
                        :label="getInitials(slotProps.option)"
                        class="bg-primary-100 flex items-center justify-center text-primary-800"
                        shape="circle"
                      />
                    </div>
                  <div>{{ slotProps.option.first_name + ' ' +slotProps.option.last_name }} - CC: {{ slotProps.option.cc }} - Phone: {{ slotProps.option.phone }}</div>
                </div>
              </template>
            </Dropdown>
          </div>

          <!-- Ofrenda General -->
          <div class="flex flex-col">
            <label for="general" class="text-gray-600 mb-2 font-semibold">Ofrenda General</label>
            <input
              type="number"
              v-model="donor.generalOffer"
              id="general"
              min="0"
              class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-second-500"
              placeholder="0.00"
            />
          </div>

          <!-- Ofrenda Especial -->
          <div class="flex flex-col">
            <label for="special" class="text-gray-600 mb-2 font-semibold">Ofrenda Especial</label>
            <input
              type="number"
              v-model="donor.specialOffer"
              id="special"
              min="0"
              class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-second-500"
              placeholder="0.00"
            />
          </div>

          <!-- Ofrenda para Misión -->
          <div class="flex flex-col">
            <label for="mission" class="text-gray-600 mb-2 font-semibold">Ofrenda para Misión</label>
            <input
              type="number"
              v-model="donor.missionOffer"
              id="mission"
              min="0"
              class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-second-500"
              placeholder="0.00"
            />
          </div>

          <!-- Mejoras del Templo -->
          <div class="flex flex-col">
            <label for="improvements" class="text-gray-600 mb-2 font-semibold">Mejoras del Templo</label>
            <input
              type="number"
              v-model="donor.improvementsOffer"
              id="improvements"
              min="0"
              class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-second-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="mt-6 flex justify-between items-center">
          <button
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
            @click="$emit('close')"
          >
            Cancelar
          </button>
          <button
            class="bg-second-600 text-white px-4 py-2 rounded-md hover:bg-second-700 transition duration-200 flex items-center gap-2"
            @click="saveDonorData"
          >
            <i class="material-symbols-outlined">save</i>
            Guardar Ingresos en {{ selectedCurrency?.label }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import { getCurrencies, getPeople } from '@/apiServices/index';

export default {
  components: {
    Dropdown,
    Avatar
  },
  data() {
    return {
      selectedCurrency: null, // Moneda seleccionada
      selectedPerson: null, // Donante seleccionado
      donor: {
        name: '', // Nombre del donante
        generalOffer: 0, // Ofrenda general
        specialOffer: 0, // Ofrenda especial
        missionOffer: 0, // Ofrenda para misión
        improvementsOffer: 0 // Mejoras del templo
      },
      currencies: [], // Lista de monedas desde la API
      people: [] // Lista de personas desde la API
    };
  },
  methods: {
    async getTypesMoney() {
      try {
        const response = await getCurrencies();
        // Suponiendo que la respuesta ya tiene el formato adecuado
        this.currencies = response;
      } catch (e) {
        console.log(e);
      }
    },
    async getPeopleFun() {
      try {
        const response = await getPeople();
        // Suponiendo que la respuesta tiene `id`, `name`, y `avatar` de las personas
        this.people = response;
      } catch (e) {
        console.log(e);
      }
    },
    saveDonorData() {
      console.log('Datos del Donante:', this.donor);
      console.log('Moneda Seleccionada:', this.selectedCurrency);
      console.log('Donante Seleccionado:', this.selectedPerson);
    },
    getInitials(person){
      return person.first_name.charAt(0) + person.last_name.charAt(0);
    }
  },
  async mounted() {
    await this.getTypesMoney();
    await this.getPeopleFun();
  }
};
</script>

<style scoped>
/* Estilos opcionales */
</style>
