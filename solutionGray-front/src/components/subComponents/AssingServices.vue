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
          @change="getRatingsByServiceFun"
          optionLabel="name" 
          placeholder="Seleccione un servicio"
          class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div class="mb-4">
        <label for="person" class="block text-gray-700 text-sm font-bold mb-2">Persona</label>
        <Dropdown
          v-model="selectedServant"
          :disabled="selectedService === null"
          :options="computedServants"
          optionLabel="name"
          placeholder="Seleccione una persona"
          class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <template #option="slotProps">
            <div
              v-if="selectedService !== null"
              class="w-full flex items-center justify-between"
            >
            <div class="flex items-center gap-4">
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
                <p>{{ slotProps.option.first_name + ' ' + slotProps.option.last_name }}</p>
                <Rating v-model="slotProps.option.rating" readonly :stars="5" :cancel="false"/>
                <p>Cantidad de Servicios: {{slotProps.option.cuantity_services || 0}}</p>
              </div>
              <button
                class="material-symbols-outlined text-gray-600 hover:scale-110"
                @click.stop="showInfo(slotProps.option)"
              >
                info
              </button>
            </div>
          </template>
        </Dropdown>
       
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
    <div class="mt-6 max-w-[130vh]">
      <h4 class="text-xl font-semibold text-gray-800 mb-4">Servicios Asignados</h4>
      <div>
        <Carousel 
          v-if="assignedServices.length" 
          :value="assignedServices" 
          :numVisible="numVisible"
          :containerClass="'flex justify-center items-center bg-gray-100 p-2 rounded-md'"
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
              <p class="text-lg font-semibold text-center">{{ slotProps.data.person.first_name + ' ' + slotProps.data.person.last_name }}</p>
              <p>Rating: {{slotProps.data.rating}}</p>
              <p class="text-sm text-center text-gray-600">{{ slotProps.data.service.name }}</p>
              <div class="flex space-x-2 mt-4">
                <button @click="editAssignment(slotProps.index)" class="material-symbols-outlined text-orange-500 cursor-pointer">
                  edit
                </button>
                <button @click="removeAssignment(slotProps.index)" class="material-symbols-outlined text-red-500 cursor-pointer">
                  delete
                </button>
              </div>
            </div>
          </template>
        </Carousel>
        <p v-else class="text-gray-600">No hay servicios asignados todavía.</p>
      </div>
    </div>

    <!-- Componente para editar la asignación -->
    <EditAssignedService
      v-if="editingIndex !== null && assignedServices[editingIndex]"
      :visible="editDialogVisible"
      :services="services"
      :assignedService="assignedServices[editingIndex]"
      :existingAssignments="assignedServices"
      @save="saveEditedAssignment"
      @cancel="cancelEdit"
      @update:visible="editDialogVisible = $event"
    />

  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Carousel from 'primevue/carousel';
import Avatar from 'primevue/avatar';
import Rating from 'primevue/rating';
import EditAssignedService from './EditedAssignedService.vue'; // Import the new component
import { getServants, getRolesServices, deleteAssingServices,getRatingsByService } from '@/apiServices/index';
import { mapGetters } from 'vuex';

export default {
  components: {
    Dropdown,
    Button,
    Carousel,
    Avatar,
    Rating,
    EditAssignedService, // Register the component
  },
  data() {
    return {
      selectedService: null,
      selectedServant: null,
      services: [],
      servants: [],
      assignedServices: [],
      numVisible: 3,
      editDialogVisible: false,
      editingIndex: null
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
      storedAssignedServices: 'assignedServices',
    })
  },
  watch: {    
    storedAssignedServices(newAssignedServices) {
      this.assignedServices = newAssignedServices;
    },
  },
  methods: {
    getInitials(person) {
      const initials = person.first_name.charAt(0) + person.last_name.charAt(0);
      return initials.toUpperCase();
    },
    assignService() {
      if (this.selectedService && this.selectedServant) {
        const count = this.assignedServices.filter(
          (assignment) => assignment.person.id === this.selectedServant.id
        ).length;
        
        if (count >= 3) {
          alert(`${this.selectedServant.first_name} ${this.selectedServant.last_name} ya ha sido asignado(a) 3 veces. No se le puede asignar más servicios.`);
        } else {
          const newAssignment = {
            service: {
              ...this.selectedService,  // Asegúrate de que service_id esté aquí
              service_id: this.selectedService.service_id
            },
            person: this.selectedServant,
            new: true
          };
          this.assignedServices.push(newAssignment);
          console.log("Assigned services:", this.assignedServices);
          this.$store.dispatch('addAssignedServices', [...this.assignedServices]);
          this.selectedService = null;
          this.selectedServant = null;
        }
      }
    },
    editAssignment(index) {
      if (index >= 0 && index < this.assignedServices.length) {
        this.editingIndex = index;
        this.editDialogVisible = true;
      } else {
        console.error("Invalid index for assigned service:", index);
      }
    },
    saveEditedAssignment(updatedAssignment) {
      if (this.editingIndex !== null) {
        this.assignedServices[this.editingIndex].service = updatedAssignment.service;
        this.assignedServices[this.editingIndex].person = updatedAssignment.person;
        this.$store.dispatch('addAssignedServices', [...this.assignedServices]);
        this.cancelEdit();
      }
    },
    cancelEdit() {
      this.editDialogVisible = false;
      this.editingIndex = null;
    },
    async removeAssignment(index) {
      try {        
        const assignment = this.assignedServices[index];
        
        if (assignment.new) {
          this.assignedServices.splice(index, 1);
          this.$store.dispatch('addAssignedServices', [...this.assignedServices]);
          return;
        }      
        const response = await deleteAssingServices(assignment.service.service_id);
        
        if (response) {
          this.assignedServices.splice(index, 1);
          this.$store.dispatch('addAssignedServices', [...this.assignedServices]);
          this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Assigned service deleted successfully', life: 5000 });
        }
      } catch (error) {
        console.error("Error deleting assigned service:", error);
        if (error.response && error.response.status === 400) {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 5000 });
        }
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
    },
    async getRatingsByServiceFun() {
      if (!this.selectedService) return;

      try {
        console.log("Selected service:", this.selectedService.id);
        
        // Obtener respuesta
        const response = await getRatingsByService(this.selectedService.id);
        console.log("Ratings by service:", response);

        // Verifica si response tiene una estructura esperada
        const ratingsArray = Array.isArray(response) ? response : Array(response); // Ajusta según estructura
        console.log("Ratings array:", ratingsArray);

        // Actualizar los sirvientes con ratings
        this.servants = this.servants.map((servant) => {
          const rating = ratingsArray.find((rating) => rating.servant_id	 === servant.id);
          return {
            ...servant,
            cuantity_services: rating ? rating.cuantity_services : 0,
            rating: rating ? Math.round(rating.average_rating) : 0,
          };
        });
        console.log("Servants with ratings:", this.servants);
      } catch (e) {
        this.servants = this.servants.map((servant) => ({ ...servant, rating: 0 }));
        console.error("Error fetching ratings:", e);
      }
    },

  },
  async mounted() {
    await this.getRolesServices();
    await this.getServants();    
  }
};
</script>
