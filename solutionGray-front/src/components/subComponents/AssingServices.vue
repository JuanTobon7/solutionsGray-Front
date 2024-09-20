<template>
  <div class="p-6">
    <h3 class="text-2xl font-semibold text-gray-800 mb-4">Asignar Servicios</h3>

    <!-- Formulario para asignar servicios -->
    <div class="mb-6">
      <div class="mb-4">
        <label for="service" class="block text-gray-700 text-sm font-bold mb-2">Servicio</label>
        <Dropdown 
          v-model="selectedService" 
          :options="services" 
          optionLabel="name" 
          placeholder="Seleccione un servicio"
          class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div class="mb-4">
        <label for="person" class="block text-gray-700 text-sm font-bold mb-2">Persona</label>
        <Dropdown 
          v-model="selectedServant" 
          :options="computedServants" 
          optionLabel="name" 
          placeholder="Seleccione una persona"
          class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div class="flex justify-end">
        <Button 
          label="Asignar" 
          icon="pi pi-plus" 
          class="p-button-success" 
          @click="assignService"
          :disabled="!selectedService || !selectedServant"
        />
      </div>
    </div>

    <!-- Lista de servicios asignados -->
    <div class="mt-6 max-w-[100vh]">
      <h4 class="text-xl font-semibold text-gray-800 mb-4">Servicios Asignados</h4>
      <div>
        <Carousel 
          v-if="allAssignedServices.length" 
          :value="allAssignedServices" 
          :numVisible="numVisible"
          :containerClass="'flex justify-center items-center w-full'"
          :showNavigators="allAssignedServices.length > numVisible"
        >
          <template #item="slotProps">
            <div class="p-4 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center mr-4 max-w-[50vh]">
              <div class="w-20 h-20 rounded-full overflow-hidden mb-2">
                <Avatar
                  v-if="slotProps.data.person.avatar"
                  :image="slotProps.data.person.avatar"
                  size="xlarge"
                  shape="circle"
                />
                <Avatar
                  v-else
                  :label="getInitials(slotProps.data.person)"
                  class="bg-primary-100 flex items-center justify-center text-primary-800"
                  size="xlarge"
                  shape="circle"
                />
              </div>
              <p class="text-lg font-semibold text-center">{{ slotProps.data.person.first_name + ' ' + slotProps.data.person.last_name }}</p>
              <p class="text-sm text-center text-gray-600">{{ slotProps.data.service.name }}</p>
              <div class="flex items-center justify-center gap-2"> 
                <button @click="removeAssignment(slotProps.index, slotProps.data.isNew)" class="material-symbols-outlined text-orange-500 cursor-pointer mt-4">
                  edit
                </button>
                <button @click="removeAssignment(slotProps.index, slotProps.data.isNew)" class="material-symbols-outlined text-red-500 cursor-pointer mt-4">
                  delete
                </button>
              </div>
            </div>
          </template>
        </Carousel>
        <p v-else class="text-gray-600">No hay servicios asignados todavía.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Carousel from 'primevue/carousel';
import Avatar from 'primevue/avatar';
import { getServants, getRolesServices } from '@/apiServices/index';
import { mapGetters } from 'vuex';

export default {
  components: {
    Dropdown,
    Button,
    Carousel,
    Avatar
  },
  data() {
    return {
      selectedService: null,
      selectedServant: null,
      services: [],
      servants: [],
      newAssignedServices: [], // Array para manejar los nuevos servicios
      numVisible: 3,
    };
  },
  computed: {
    computedServants() {
      return this.servants.map(servant => ({
        ...servant,
        name: `${servant.first_name} ${servant.last_name}`
      }));
    },
    ...mapGetters({
      storedAssignedServices: 'assignedServices', // Servicios ya persistidos en Vuex
    }),
    allAssignedServices() {
      return [
        ...this.storedAssignedServices.map(service => ({ ...service, isNew: false })),
        ...this.newAssignedServices.map(service => ({ ...service, isNew: true }))
      ];
    },
  },
  methods: {
    getInitials(person) {
      const initials = person.first_name.charAt(0) + person.last_name.charAt(0);
      return initials.toUpperCase();
    },
    assignService() {
      if (this.selectedService && this.selectedServant) {
        const count = this.newAssignedServices.filter(
          (assignment) => assignment.person.id === this.selectedServant.id
        ).length + this.storedAssignedServices.filter(
          (assignment) => assignment.person.id === this.selectedServant.id
        ).length;

        if (count >= 3) {
          alert(`${this.selectedServant.first_name} ${this.selectedServant.last_name} ya ha sido asignado(a) 3 veces. No se le puede asignar más servicios.`);
        } else {
          const newAssignment = {
            service: this.selectedService,
            person: this.selectedServant
          };

          this.newAssignedServices.push(newAssignment); // Añade al array de nuevos
          this.selectedService = null;
          this.selectedServant = null;
        }
      }
    },
    removeAssignment(index, isNew) {
      if (isNew) {
        this.newAssignedServices.splice(index, 1); // Elimina del array de nuevos
      } else {
        this.$store.dispatch('removeAssignedService', index); // Elimina del array persistido
      }
    },
    async getRolesServices() {
      try {
        const response = await getRolesServices();
        this.services = response;
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },
    async getServants() {
      try {
        const response = await getServants();
        this.servants = response;
      } catch (error) {
        console.error("Error fetching servants:", error);
      }
    }
  },
  async mounted() {
    await this.getRolesServices();
    await this.getServants();    
  }
};
</script>
