<template>
  <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="container h-[95vh] w-full flex items-center justify-center sm:px-6">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full flex flex-col max-h-full overflow-y-auto">
        <div class="flex justify-between items-center mb-4 sm:mb-6">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Registro de Ingresos</h2>
          <span @click="$emit('close')" class="material-symbols-outlined text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200">close</span>
        </div>
        <div class="flex flex-col mb-4">
          <label for="currency" class="text-gray-600 mb-2 font-semibold">Tipo de Moneda</label>
          <Dropdown 
            v-model="selectedCurrency" 
            :options="currencies" 
            filterMatchMode="contains" 
            filterBy="currency_type,currency_symbol,country_id" 
            optionLabel="currency_type" 
            placeholder="Buscar por tipo, símbolo o país" 
            class="max-w-3/4 md:w-full"
            :panelClass="['w-3/4 overflow-x-auto']"
          >
            <!-- Personalización del valor seleccionado -->
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center gap-2 max-w-3/4">
                <span :class="`fi fi-${slotProps.value.country_id.toLowerCase()}`"></span>
                <p>
                  {{ slotProps.value.currency_symbol + ' ' + slotProps.value.currency_type + ' ' + slotProps.value.country_name }}
                </p>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>

            <!-- Personalización de las opciones desplegables -->
            <template #option="slotProps">
              <div class="flex items-center gap-2 max-w-3/4">
                <span :class="`fi fi-${slotProps.option.country_id.toLowerCase()}`"></span>
                <p>
                  {{ slotProps.option.currency_symbol + ' - ' + slotProps.option.currency_type + ' (' + slotProps.option.country_id + ')' + ' ' + slotProps.option.country_name }}
                </p>
              </div>
            </template>
          </Dropdown>
        </div>


        <!-- Selección del Donante -->
        <div class="flex flex-col mb-4">
          <label for="person" class="text-gray-600 mb-2 font-semibold">Seleccionar Donante</label>
          <Dropdown
            v-model="selectedPerson"
            :options="people"
            optionLabel="name"
            placeholder="Selecciona un Donante"
            class="max-w-3/4 md:w-full"
            :panelClass="['w-3/4 overflow-x-auto']"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex flex-col md:flex-row items-center gap-4">
                <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
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

                <!-- Información -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm">
                  <p class="font-semibold text-gray-800">
                    {{ slotProps.value.first_name + ' ' + slotProps.value.last_name }}
                  </p>
                  <p class="text-gray-600">
                    CC: {{ slotProps.value.cc }}
                  </p>
                  <p class="text-gray-600">
                    Phone: {{ slotProps.value.phone }}
                  </p>
                </div>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>

            <template #option="slotProps">
              <div class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
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

                <!-- Información -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2 text-sm">
                  <p>
                    {{ slotProps.option.first_name + ' ' + slotProps.option.last_name }}
                  </p>
                  <p>
                    CC: {{ slotProps.option.cc }}
                  </p>
                  <p>
                    Phone: {{ slotProps.option.phone }}
                  </p>
                </div>
              </div>
            </template>
          </Dropdown>
        </div>

        <!-- Listado de Ofrendas -->
        <div class="flex flex-col mb-4">
          <label class="mb-2 font-semibold flex items-center gap-2">
            <span class="text-gray-600 ">Registro de Ofrendas</span>
            <button @click="addOffering" class="text-white cursor-pointer bg-green-500 p-1 rounded-md material-symbols-outlined">
              add
            </button>
          </label>
          <div v-for="(offering, index) in offeringsList" :key="index" class="flex items-center gap-2 mb-2">
            <Dropdown 
              v-model="offering.type" 
              :options="types_offerings" 
              optionValue="id" 
              optionLabel="name" 
              placeholder="Tipo de Ofrenda" 
              class="w-3/4 md:w-full"
            />
            <input
              type="number"
              v-model="offering.amount"
              placeholder="Monto"
              min="0"
              class="w-full md:w-1/2 px-2 py-1 border border-gray-300 rounded-md"
            />
            <button @click="removeOffering(index)" class="text-red-500 hover:text-red-700 material-symbols-outlined">
              delete
            </button>
          </div>      
        </div>
        <div>
          <label class="mb-2 font-semibold flex items-center gap-2">
            <span>Total</span> 
            <i class="material-symbols-outlined">trending_up</i>
          </label>    
          <div class="flex items-center gap-2">
            <span class="text-gray-600">Total de Ofrendas:</span>
            <span class="text-gray-800 font-semibold">{{ offeringsList.reduce((acc, curr) => acc + curr.amount, 0) }}</span>            
        </div>
        <!-- Botones de acción -->
        <div class="mt-6 flex justify-between items-center">
          <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200" @click="$emit('close')">
            Cancelar
          </button>
          <button
            v-if="selectedCurrency && selectedPerson && offeringsList.length > 0"
            class="bg-second-600 text-white px-4 py-2 rounded-md hover:bg-second-700 transition duration-200 flex items-center gap-2"
            @click="saveDonorData"
          >
            <i class="material-symbols-outlined">save</i>
            Guardar Ofrenda
          </button>
        </div>
      </div>
    </div>
  </div>

  </section>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import { getCurrencies, getPeople, getTypesContributions,saveContribution } from '@/apiServices/index';

export default {
  components: {
    Dropdown,
    Avatar
  },
  props: ['worshipService'],
  data() {
    return {
      selectedCurrency: null,
      selectedPerson: null,
      offeringsList: [
        { type: null, amount: 0 }
      ],
      currencies: [],
      people: [],
      types_offerings: []
    };
  },
  methods: {
    async getTypesMoney() {
      try {
        const response = await getCurrencies();
        this.currencies = response;
      } catch (e) {
        console.log(e);
      }
    },
    async getPeopleFun() {
      try {
        const response = await getPeople();
        this.people = response;
      } catch (e) {
        console.log(e);
      }
    },
    async getTypesOfferings() {
      try {
        const response = await getTypesContributions();
        this.types_offerings = response;
      } catch (e) {
        console.log(e);
      }
    },
    addOffering() {
      this.offeringsList.push({ type: null, amount: 0 });
    },
    removeOffering(index) {
      this.offeringsList.splice(index, 1);
    },
    async saveDonorData() {      
     try{
      if(!this.selectedCurrency || !this.selectedPerson || this.offeringsList.length === 0) return;
      const result  = await saveContribution({
        currencyId: this.selectedCurrency.id,
        personId: this.selectedPerson.id,
        offerings: this.offeringsList,
        eventId: this.worshipService.id
      });
      this.$toast.add({ severity: 'success', summary: 'Éxito', detail: result.message, life: 3000 });
      this.$emit('saved');
     }catch(e){
      if(e.response.message !== 'Token Expired' && e.response.status !== 401){
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al registrar los ingresos', life: 3000 });
      }
     }
    },
    getInitials(person) {
      return person.first_name.charAt(0) + person.last_name.charAt(0);
    }
  },
  async mounted() {
    await this.getTypesMoney();
    await this.getPeopleFun();
    await this.getTypesOfferings();
  }
};
</script>

<style scoped>
/* Estilos opcionales para ajustes de diseño */
</style>
