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
          v-if="assignedServices.length" 
          :value="assignedServices" 
          :numVisible="numVisible"
          :containerClass="'flex justify-center items-center w-full'"
          :showNavigators="assignedServices.length > numVisible"
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
              <p class="text-lg font-semibold text-center">{{ slotProps.data.person.name }}</p>
              <p class="text-sm text-center text-gray-600">{{ slotProps.data.service.name }}</p>
              <button @click="removeAssignment(slotProps.index)" class="material-symbols-outlined text-red-500 cursor-pointer mt-4">
                delete
              </button>
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
      assignedServices: [],
      numVisible: 3
    };
  },
  computed: {
    computedServants() {
      return this.servants.map(servant => ({
        ...servant,
        name: `${servant.first_name} ${servant.last_name}`
      }));
    }
  },
  methods: {
  getInitials(person) {
    const initials = person.first_name.charAt(0) + person.last_name.charAt(0);
    return initials.toUpperCase();
  },
  assignService() {
    if (this.selectedService && this.selectedServant) {
      // Contar cuántas veces la persona ya ha sido asignada
      const count = this.assignedServices.filter(
        (assignment) => assignment.person.id === this.selectedServant.id
      ).length;

      // Si la persona ya ha sido asignada 3 veces, mostrar un mensaje
      if (count >= 3) {
        alert(`${this.selectedServant.first_name} ${this.selectedServant.last_name} ya ha sido asignado(a) 3 veces. No se le puede asignar más servicios.`);
      } else {
        // De lo contrario, asignar el servicio
        this.assignedServices.push({
          service: this.selectedService,
          person: this.selectedServant
        });
        this.$store.dispatch('addAssignedServices', this.assignedServices);
        this.selectedService = null;
        this.selectedServant = null;
      }
    }
  },
  removeAssignment(index) {
    this.assignedServices.splice(index, 1);
  },
  async getRolesServices() {
    const response = await getRolesServices();
    this.services = response;
  },
  async getServants() {
    try {
      const response = await getServants();
      this.servants = response;
    } catch(e) {
      console.log(e.response.data);
    }
  }
},
  async mounted() {
    await this.getRolesServices();
    await this.getServants();
  }
};
</script>
