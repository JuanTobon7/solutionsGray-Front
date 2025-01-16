<template>
    <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
        <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-xl font-bold text-gray-800">
              ¡Bienvenido! Registra tu iglesia y comienza a organizar tus cultos con Viddefe.
            </h2>
            <button @click="$emit('close')">
              <i class="material-symbols-outlined text-gray-800">close</i>
            </button>
          </div>
          <div>
            <Stepper linear v-model:activeIndex="activeIndex">
              <!-- Información de la iglesia -->
              <StepperPanel header="Información de la iglesia">
                <template #content="{ nextCallback }">
                  <div class="flex-grow mb-4 sm:mb-8">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">Nombre de la iglesia</label>
                      <input id="name" type="text" v-model="churchData.name" class="mt-1 p-2 block w-full border rounded-md" placeholder="Nombre de la iglesia" />
                    </div>
                  </div>
                  <div class="flex justify-end">
                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" class="p-button-primary" @click="nextCallback" />
                  </div>
                </template>
              </StepperPanel>
  
              <!-- Ubicación -->
              <StepperPanel header="Ubicación">
                <template #content="{ prevCallback, nextCallback }">
                  <div >
                    <div id="map" class="rounded-md container max-h-[80vh] z-0" style="height: 600px;"></div>

                    <div>
                      <label for="parent_church" class="block text-sm font-medium text-gray-700">Iglesia Padre</label>
                      <select id="parent_church" v-model="churchData.parent_church_id" class="mt-1 p-2 block w-full border rounded-md">
                        <option value="" disabled>Seleccione una iglesia</option>
                        <option v-for="church in churches" :key="church.id" :value="church.id">{{ church.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="flex justify-between mt-4 sm:mt-6">
                    <Button label="Atrás" icon="pi pi-arrow-left" class="p-button-secondary" @click="prevCallback" />
                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" class="p-button-primary" @click="nextCallback" />
                  </div>
                </template>
              </StepperPanel>
  
              <!-- Confirmación -->
              <StepperPanel header="Confirmación">
                <template #content="{ prevCallback }">
                  <div class="flex-grow flex flex-col">
                    <p class="text-gray-800">
                      Verifique la información antes de continuar.
                    </p>
                    <ul class="mt-4">
                      <li><strong>Nombre:</strong> {{ churchData.name }}</li>
                      <li><strong>Ubicación:</strong> {{ churchData.latitude }}, {{ churchData.longitude }}</li>
                      <li><strong>Iglesia Padre:</strong> {{ getParentChurchName() }}</li>
                    </ul>
                  </div>
                  <div class="flex justify-between mt-4 sm:mt-6">
                    <Button label="Atrás" icon="pi pi-arrow-left" class="p-button-secondary" @click="prevCallback" />
                  </div>
                </template>
              </StepperPanel>
            </Stepper>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
import Stepper from "primevue/stepper";
import StepperPanel from "primevue/stepperpanel";
import Button from "primevue/button";
import L from "leaflet";

export default {
    components: {
        Stepper,
        StepperPanel,
        Button,
    },
  data() {
    return {
      activeIndex: 0, // Índice del paso actual
      churchData: {
        name: "",
        latitude: null,
        longitude: null,
        parent_church_id: null,
      },
      churches: [],
      map: null,
      marker: null,
    };
  },
  watch: {
    activeIndex(newIndex) {
      if (newIndex === 1 && !this.map) {
        this.initializeMap();
      }
    },
  },
  methods: {
    initializeMap() {
      const defaultLocation = { lat: 4.570868, lng: -74.297333 }; // Coordenadas predeterminadas (Colombia)
      this.loadMap(defaultLocation.lat, defaultLocation.lng);
    },
    loadMap(lat, lng) {
      this.map = L.map("map").setView([lat, lng], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Manejar clics en el mapa para actualizar las coordenadas
      this.map.on("click", (event) => {
        const { lat, lng } = event.latlng;
        this.churchData.latitude = lat;
        this.churchData.longitude = lng;

        // Si ya existe un marcador, lo movemos
        if (this.marker) {
          this.marker.setLatLng([lat, lng]);
        } else {
          // Crear un nuevo marcador
          this.marker = L.marker([lat, lng]).addTo(this.map);
        }
      });
    },
  },
  mounted() {
    // Simular carga de iglesias desde la API
    this.churches = [
      { id: 1, name: "Iglesia Central" },
      { id: 2, name: "Iglesia Norte" },
      { id: 3, name: "Iglesia Sur" },
    ];
  },
};
</script>


<style>
/* Estilos de Leaflet */
@import 'leaflet/dist/leaflet.css';

/* Estilo para el popup */
#map {
  width: 100%;
  border-radius: 8px;
}
</style>
