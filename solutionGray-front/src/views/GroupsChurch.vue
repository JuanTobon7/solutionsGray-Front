<template>
  <section v-if="!showInfoGroup" class="w-full container">
    <div class="mb-4">
      <h2 class="text-3xl sm:text-5xl text-center text-second-800 mb-2">
        <strong>Grupos de la iglesia</strong>
      </h2>
      <span class="text-primary-900 text-xl sm:text-3xl font-serif mb-4 block text-center">
        <strong>
          Y perseverando unánimes cada día en el templo, y partiendo el pan en las casas, comían juntos con alegría y sencillez de corazón. Hechos 2:46
        </strong>
      </span>
    </div>

    <div>
      <!-- Sección del encabezado -->
      <div class="flex flex-wrap gap-2 justify-between items-center mb-4">
        <div>
          <h3 class="text-2xl text-second-800 font-semibold">
            Ubicaciones de Grupos de la iglesia
          </h3>
          <p class="text-gray-700 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, ipsam placeat beatae voluptatum eos aliquam dolor excepturi voluptate.
          </p>
        </div>
        <!-- Botón mejorado -->
        <button 
          @click="stepper"
          class="flex items-center gap-2 bg-second-500 hover:bg-second-600 px-2 py-1 rounded-lg text-white shadow-md">
          <i class="material-symbols-outlined text-lg">add</i>
          Crear Grupo
        </button>
      </div>

      <!-- Mapa: Renderiza solo si showStepper es false -->
      <div id="map" v-if="!showStepper" class="rounded-md container max-h-[80vh] z-0" style="height: 600px;"></div>
      
    </div>
  </section>
  <InfoGroups v-else @close="closeInfoGroup" />
  <CreateGroups v-if="showStepper" @close="closeStepper" />
</template>
<script>
import L from 'leaflet';
import CreateGroups from '@/components/Groups/CreateGroups.vue';
import InfoGroups from '@/components/Groups/InfoGroups.vue';
import Avatar from 'primevue/avatar';
import { getGroups } from '../apiServices';

export default {
  name: 'MapWithLeaflet',
  components: {
    CreateGroups,
    InfoGroups,
    Avatar,
  },
  data() {
    return {
      map: null,
      showStepper: false,
      showInfoGroup: false,
      groups: [], // Datos de los grupos
    };
  },
  methods: {
    initializeMap() {
      // Centrar el mapa en una ubicación predeterminada
      this.map = L.map('map').setView([4.11447990, -73.58533949], 15);

      // Añadir capa base de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Agregar marcadores dinámicamente desde los datos de `groups`
      this.groups.forEach((group) => {
        const lat = parseFloat(group.latitude);
        const lng = parseFloat(group.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng]).addTo(this.map);
          marker.bindPopup(this.createPopup(group)); // Crear popup dinámico
        } else {
          console.warn(`Coordenadas inválidas para el grupo ${group.name}`);
        }
      });
    },
    createPopup(group) {
      // Crear el contenedor del popup
      const container = L.DomUtil.create('div', 'popup-content p-2');
      // Título
      const title = L.DomUtil.create('h3', 'text-xl text-second-800 font-semibold', container);
      title.textContent = group.name;
      // Líder
      const leader = L.DomUtil.create('p', '', container);
      leader.innerHTML = `<strong>Líder:</strong> ${group.first_name} ${group.last_name}`;
      // Teléfono
      const phone = L.DomUtil.create('p', '', container);
      phone.innerHTML = `<strong>Teléfono:</strong> ${group.phone}`;
      // Email
      const email = L.DomUtil.create('p', '', container);
      email.innerHTML = `<strong>Email:</strong> ${group.email}`;
      // Botón "Ver más"
      const button = L.DomUtil.create('button', 'flex items-center justify-center px-2 py-1 rounded-md gap-2 bg-second-500 hover:bg-second-600 text-white w-full text-xl', container);
      button.textContent = 'Ver más';

      // Evento para el botón
      button.addEventListener('click', () => this.groupById(group.id));

      return container;
    },
    groupById(id) {
      this.showInfoGroup = true;
      console.log('ID del grupo seleccionado:', id);
      // Aquí podrías navegar a una vista específica o abrir un modal
    },
    async getGroups() {
      try {
        const response = await getGroups();
        this.groups = response.filter((group) => group.latitude && group.longitude); // Filtrar grupos válidos
        console.log('Grupos cargados:', this.groups);
        this.initializeMap(); // Inicializa el mapa después de cargar los datos
      } catch (e) {
        console.error('Error al cargar los grupos:', e);
        if (e.response && e.response.status !== 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al obtener los grupos',
            life: 3000,
          });
        }
      }
    },
    stepper() {
      this.showStepper = true;
      if (this.map) this.map.remove(); // Eliminar el mapa actual
    },
    closeStepper() {
      this.showStepper = false;
      this.$nextTick(() => {
        this.initializeMap();
      });
    },
  },
  mounted() {
    this.getGroups(); // Cargar datos y configurar el mapa al montar el componente
  },
};
</script>


<style>
/* Estilos de Leaflet */
@import 'leaflet/dist/leaflet.css';

/* Estilo para el popup */

</style>
