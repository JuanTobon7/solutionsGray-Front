<template>
  <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50 inline-flex items-center justify-center">
    <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
      <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
        <div class="flex items-center justify-between gap-4 mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            ¡Bienvenido! Registra tu iglesia y comienza a organizar tus cultos con Viddefe.
          </h2>
          <button @click="$emit('close')">
            <i class="material-symbols-outlined text-gray-800">close</i>
          </button>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Información de la iglesia</h3>
          <div class="flex flex-col flex-grow mb-2 sm:mb-4 gap-2">
            <label for="name" class="block text-sm font-medium text-gray-700">Nombre de la iglesia</label>
            <input id="name" type="text" v-model="churchData.name" class="p-2 block w-full border rounded-md" placeholder="Nombre de la iglesia" />

            <label for="parent_church" class="block text-sm font-medium text-gray-700">Iglesia Padre (Opcional)</label>
            <select id="parent_church" v-model="churchData.parentChurchId" class="p-2 block w-full border rounded-md">
              <option value="" disabled>Seleccione una iglesia</option>
              <option v-for="church in churches" :key="church.id" :value="church.id">{{ church.name }}</option>
            </select>
            <p v-if="churches.length === 0" class="text-sm text-red-500 mt-2">No hay iglesias disponibles para seleccionar.</p>
          </div>
          <div class="mb-2">
              <label class="block text-sm font-medium mb-1">País</label>
              <Dropdown
                id="countries"
                v-model="churchData.countryId"
                :options="countries"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione un país"
                required
                class="w-80 md:w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-second-500 focus:border-second-500 sm:text-sm"
                @change="onCountryChange"
              />
          </div>
          <!-- Estado/Provincia -->
          <div>
              <label class="block text-sm font-medium mb-1">Estado/Provincia</label>
              <Dropdown
                id="states"
                v-model="churchData.stateId"
                :options="states"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione un estado/provincia"
                required
                class="w-80 md:w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-second-500 focus:border-second-500 sm:text-sm"
                :disabled="!states.length"
              />
          </div>
        </div>

        <!-- Ubicación -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-700">Ubicación</h3>
          <div id="map" class="rounded-md container max-h-[80vh] z-0" style="height: 400px; margin-right: 16px; margin-bottom: 16px;"></div>
        </div>

        <div class="flex justify-end mt-6">
          <button @click="createChurch" class="p-2 bg-second-500 text-white rounded-md">Registrar iglesia</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import L from 'leaflet';
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { getCountries, getStatesByCountry,getParentsChurches,createChurch } from '@/apiServices';

export default {
  components: {
    Button,
    Dropdown,
  },
  data() {
    return {
      churchData: {
        name: "",
        latitude: null,
        longitude: null,
        parentChurchId: null,
        countryId: null,
        stateId: null,
      },
      churches: [],
      countries: [],
      states: [],
      map: null,
      marker: null,
      selectedLocation: { lat: null, lng: null },
    };
  },
  methods: {
    initializeMap() {
      this.map = L.map('map').setView([4.11447990, -73.58533949], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      this.map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        this.churchData.latitude = lat
        this.churchData.longitude = lng
        if (this.marker) {
          this.marker.setLatLng(e.latlng);
        } else {
          this.marker = L.marker(e.latlng).addTo(this.map);
        }
      });
    },
    async loadCountries() {
      try {
        this.countries = await getCountries();
      } catch (e) {
        if(e){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }
      }
    },
    async onCountryChange() {
      try {
        this.states = await getStatesByCountry(this.churchData.countryId);
        } catch (e) {
        if(e){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }
      }
    },
    async loadParentChurches() {
      try {
        this.churches = await getParentsChurches();
      } catch (e) {
        if(e){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }
      }      
    },
    async createChurch(){
      try {
        if(!this.churchData.name || !this.churchData.countryId || !this.churchData.stateId || !this.churchData.latitude || !this.churchData.longitude){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Todos los campos son obligatorios',life: 3000 });
          return;
        }
        const payload = this.churchData;
        const result = await createChurch(payload);
        const user = this.$store.getters.user;
        user.churchName = result.name;
        this.$store.commit('setUser', user);
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Iglesia registrada correctamente',life: 3000 });
      } catch (e) {
        if(e.response.status === 401 && e.response.data.message === 'Token has expired'){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }
      }
    }
  },
  async mounted() {
    this.initializeMap();
    await this.loadCountries();
    await this.loadParentChurches();
  },
};
</script>

<style>
#map {
  width: 100%;
  border-radius: 8px;
}
</style>
