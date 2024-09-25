<template>
  <Dialog 
    header="Editar Asignación" 
    :visible="visible"
    @update:visible="updateVisibility"
    modal
    class="bg-white p-8 rounded-lg shadow-lg flex flex-col max-w-md mx-auto"
  >
    <!-- Card para mostrar la información de la persona -->
    <div class="p-8 rounded-lg shadow-md shadow-gray-200 bg-gray-50">
      <div class="flex flex-col items-center justify-center gap-4 mb-4">
        <div class="w-20 h-20 rounded-full overflow-hidden">
          <Avatar
            v-if="editSelectedServant && editSelectedServant.avatar"
            :image="editSelectedServant.avatar"
            size="xlarge"
            shape="circle"
          />
          <Avatar
            v-else
            :label="editSelectedServant ? getInitials(editSelectedServant) : ''"
            class="bg-primary-100 flex items-center justify-center text-primary-800"
            size="xlarge"
            shape="circle"
          />
        </div>
        <div class="flex flex-col gap-1 items-center">
          <h5 v-if="editSelectedServant" class="text-xl font-semibold text-gray-800">{{ editSelectedServant.first_name }} {{ editSelectedServant.last_name }}</h5>
          <p v-if="editSelectedServant" class="text-sm text-gray-600">Correo: {{ editSelectedServant.email }}</p>
          <p v-if="editSelectedServant" class="text-sm text-gray-600">Teléfono: {{ editSelectedServant.phone }}</p>
        </div>
      </div>

      <!-- Dropdown para seleccionar el servicio a editar -->
      <div>
        <label for="editService" class="block text-gray-700 text-sm font-bold mb-2">Servicio</label>
        <Dropdown 
          v-model="editSelectedService" 
          :options="services" 
          optionLabel="name" 
          placeholder="Seleccione un servicio"
          class="w-full shadow appearance-none border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
        />
      </div>
    </div>

    <div class="flex justify-end mt-8 space-x-4">
      <Button 
        label="Guardar Cambios" 
        icon="pi pi-check" 
        class="p-button-success bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded transition-all duration-200 ease-in-out"
        @click="save"
        :loading="isSaving"
      />
      <Button 
        label="Cancelar" 
        icon="pi pi-times" 
        class="p-button-secondary bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded transition-all duration-200 ease-in-out"
        @click="cancel"
        :disabled="isSaving"
      />
    </div>
  </Dialog>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Dialog from 'primevue/dialog';
import { updateAssingServices } from '@/apiServices/index';
import { mapGetters } from 'vuex';

export default {
  components: {
    Dropdown,
    Button,
    Avatar,
    Dialog
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    services: {
      type: Array,
      required: true
    },
    assignedService: {
      type: Object,
      required: true
    },
    existingAssignments: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      editSelectedService: null,
      editSelectedServant: null,
      eventId: null,
      serviceId: null,
      isSaving: false // Indicador de estado para guardar
    };
  },
  mounted() {
    this.serviceId = this.assignedService.service ? this.assignedService.service.service_id : null;
    this.eventId = this.storedCulto ? this.storedCulto.id : null;
  },
  computed: {
    ...mapGetters({
      storedCulto: 'worshipService'
    }),
  },
  watch: {
    storedCulto(newCulto) {
      this.eventId = newCulto.id || this.eventId;
    },
    assignedService: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.editSelectedService = newValue.service || null;
          this.editSelectedServant = newValue.person || null;
          this.serviceId = newValue.service ? newValue.service.service_id : null;
        } else {
          this.editSelectedService = null;
          this.editSelectedServant = null;
          this.serviceId = null;
        }
      }
    }
  },
  methods: {
    getInitials(person) {
      const initials = person.first_name.charAt(0) + person.last_name.charAt(0);
      return initials.toUpperCase();
    },
    async save() {
      if (this.isServiceAlreadyAssigned()) {
        alert("Este servicio ya está asignado a esta persona. No puede asignarlo nuevamente.");
        return;
      }
      
      this.isSaving = true; // Activamos el estado de guardado

      const updatedAssignment = {
        service: {
          ...this.editSelectedService,
          service_id: this.serviceId
        },
        person: this.editSelectedServant
      };
      
      try {
        if (!this.assignedService.new) {
          await this.updateService(updatedAssignment);
        }

        this.$emit('save', updatedAssignment);
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Asignación guardada correctamente.', life: 3000 });
        this.updateVisibility(false); // Cerramos el diálogo solo si la operación es exitosa
      } catch (e) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar la asignación.', life: 3000 });
      } finally {
        this.isSaving = false; // Desactivamos el estado de guardado independientemente del resultado
      }
    },
    cancel() {
      if (!this.isSaving) {
        this.updateVisibility(false);
      }
    },
    updateVisibility(value) {
      this.$emit('update:visible', value);
    },
    isServiceAlreadyAssigned() {
      return this.existingAssignments.some(
        assignment =>
          assignment.service.id === this.editSelectedService.id &&
          assignment.person.id === this.editSelectedServant.id
      );
    },
    async updateService(service) {
      const updatedService = {
        ...service,
        eventId: this.eventId,
        service: {
          ...this.editSelectedService,
        },
        person: this.editSelectedServant,
        serviceId: this.serviceId
      };
      const response = await updateAssingServices(updatedService);
      return response;
    }
  }
};
</script>
