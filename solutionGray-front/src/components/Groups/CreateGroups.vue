<template>
  <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
    <div class="container h-auto md:h-[95vh] w-full sm:px-6 flex items-center justify-center">
      <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
        <div class="flex justify-between items-center mb-4 sm:mb-6">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-800">
            Formulario de Creación de Cultos
          </h2>
          <button
            @click="closeMap"
            class="material-symbols-outlined text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200"
          >
            close
          </button>
        </div>

        <!-- Sección de Ubicación -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-700 mb-2">
            Escoger Ubicación
          </h3>
          <p class="text-sm text-gray-600 mb-2">
            Haz clic en el mapa para seleccionar una ubicación. La latitud y longitud aparecerán automáticamente.
          </p>
          <div id="map" style="height: 400px;" class="rounded-md mb-4"></div>
        </div>

        <!-- Sección de Información del Grupo -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-700 mb-2">
            Información del Grupo
          </h3>
          <label for="name" class="block text-sm text-gray-600 mb-1">
            Nombre del Grupo
          </label>
          <input
            id="name"
            type="text"
            v-model="groupName"
            class="p-2 rounded-md border border-gray-300 w-full mb-4"
            placeholder="Nombre del grupo"
          />
          <label for="strategieName" class="block text-sm text-gray-600 mb-1">
            Nombre de la estrategia
          </label>
          <textarea
            id="strategieName"
            type="text"
            v-model="strategyName"
            class="p-2 rounded-md border border-gray-300 w-full mb-4"
            placeholder="Nombre d la estrategia"
          ></textarea>
          <label class="block text-sm text-gray-600 mb-1">
            Selecciona al Líder o Encargado
          </label>
          <Dropdown
            v-model="selectedPerson"
            :options="people"
            optionLabel="name"
            placeholder="Selecciona a un Líder o Encargado del Grupo"
            class="w-full"
          >
            <!-- Template para el valor seleccionado -->
            <template #value="slotProps">
              <div
                v-if="slotProps.value"
                class="flex items-center gap-2 flex-wrap sm:flex-nowrap"
              >
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
                <div
                  class="text-sm sm:text-base flex flex-col sm:flex-row gap-1 sm:gap-2"
                >
                  <span>{{ slotProps.value.first_name + ' ' + slotProps.value.last_name }}</span>
                  <span class="hidden sm:inline">-</span>
                  <span>CC: {{ slotProps.value.cc }}</span>
                  <span class="hidden sm:inline">-</span>
                  <span>Phone: {{ slotProps.value.phone }}</span>
                </div>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>

            <!-- Template para las opciones -->
            <template #option="slotProps">
              <div
                class="flex items-center gap-2 flex-wrap sm:flex-nowrap py-2 px-3 hover:bg-gray-100 rounded"
              >
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
                <div
                  class="text-sm sm:text-base flex flex-col sm:flex-row gap-1 sm:gap-2"
                >
                  <span>{{ slotProps.option.first_name + ' ' + slotProps.option.last_name }}</span>
                  <span class="hidden sm:inline">-</span>
                  <span>CC: {{ slotProps.option.cc }}</span>
                  <span class="hidden sm:inline">-</span>
                  <span>Phone: {{ slotProps.option.phone }}</span>
                </div>
              </div>
            </template>
          </Dropdown>
        </div>

        <!-- Botón de Guardar -->
        <div class="flex justify-end">
          <Button
            label="Guardar"
            icon="pi pi-save"
            class="p-button-success"
            @click="createGroup"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import L from "leaflet";
import Dropdown from "primevue/dropdown";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { getPeople, createGroups,addPersonStrategy } from "@/apiServices";

export default {
  components: {
    Dropdown,
    Avatar,
    Button,
  },
  data() {
    return {
      map: null,
      marker: null,
      groupName: '',
      strategyName: '',
      people: [],
      selectedPerson: null,
      selectedLocation: { lat: null, lng: null },
    };
  },
  mounted() {
    this.initializeMap();
    this.getPeople();
  },
  methods: {
    // Inicialización simplificada del mapa
    initializeMap() {
      const defaultLocation = { lat: 4.570868, lng: -74.297333 }; // Coordenadas predeterminadas (Colombia)
      this.loadMap(defaultLocation.lat, defaultLocation.lng);
    },
    // Lógica de carga del mapa
    loadMap(lat, lng) {
      this.map = L.map("map").setView([lat, lng], 6 ); // Ajusta el zoom inicial a 13
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(this.map);
      this.map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        this.selectedLocation = { lat, lng };
        if (this.marker) {
          this.marker.setLatLng(e.latlng);
        } else {
          this.marker = L.marker(e.latlng).addTo(this.map);
        }
      });
    },
    async addPersonStrategy (data) {
      try {
        const {  selectedPerson } = this;
        console.log(data);
        if(!selectedPerson || !data.groupId || !data.id){ 
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Por favor completa todos los campos",
            life: 3000,
          });
          return;
        }
        const strategy = {
          personId: selectedPerson.id,
          strategyId: data.id,
          groupId: data.groupId,
          rol: 'Lider'
        };
        await addPersonStrategy(strategy);
        this.$toast.add({
          severity: "success",
          summary: "Estrategia Creada",
          detail: "La estrategia ha sido creada exitosamente",
          life: 3000,
        });
      }catch (e) {
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Ha ocurrido un error al crear el grupo",
          life: 3000,
        });
      }
    },
    // Método para obtener las personas
    async getPeople() {
      try {
        const response = await getPeople();
        this.people = response;
      } catch (error) {
        console.error("Error al cargar personas:", error);
      }
    },
    // Método para crear el grupo
    async createGroup() {
      try {
        const { groupName, selectedPerson, selectedLocation ,strategyName} = this;
        if (!groupName || !selectedPerson || !selectedLocation.lat || !selectedLocation.lng || !strategyName) {
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Por favor completa todos los campos",
            life: 3000,
          });
          return;
        }
        const group = {
          name: groupName,
          leaderId: selectedPerson.id,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          strategyName: strategyName
        };
        const response = await createGroups(group);
        this.$toast.add({
          severity: "success",
          summary: "Grupo Creado",
          detail: "El grupo ha sido creado exitosamente",
          life: 3000,
        });
        await this.addPersonStrategy({id:response.id,groupId:response.groupId});
      } catch (e) {
        console.error("Error al crear grupo:", e);
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Ha ocurrido un error al crear el grupo",
          life: 3000,
        });
      }
    },
    // Método para cerrar el mapa
    closeMap() {
      if (this.map) this.map.remove();
      this.$emit("close");
    },
    // Obtener iniciales de una persona
    getInitials(person) {
      return person.first_name[0] + person.last_name[0];
    },
  },
};
</script>


