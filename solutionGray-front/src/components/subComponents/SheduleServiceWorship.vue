<template>
  <div class="p-6">
    <div class="flex items-center gap-2 mb-6 text-second-800">      
      <h3 class="text-3xl font-semibold ">
        {{ worshipService ? 'Editar Culto' : 'Agendar Culto' }}    
      </h3>
      <span 
        class="material-symbols-outlined text-3xl">
        {{ worshipService ? 'edit': 'event' }}
      </span>
    </div>
    <!-- Validation Error Message -->
    <div v-if="errorMessage" class="bg-red-100 text-red-600 p-2 mb-4 rounded">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="scheduleWorshipService">
      <div class="mb-4">
        <Dropdown 
          v-model="selectedTypeWorship" 
          :options="typesWorship" 
          filter 
          filterPlaceholder="Buscar tipo de culto..."
          optionLabel="name" 
          placeholder="Seleccione un tipo de culto" 
          class="shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-second-500"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </Dropdown>
      </div>

      <div class="mb-4">
        <label for="sermonTitle" class="block text-second-700 text-sm font-bold mb-2">Nombre del Culto</label>
        <input
          type="text"
          id="sermonTitle"
          v-model="worshipName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-second-500"
          placeholder="Ej. Importancia de la Oración"
          required
        />
      </div>

      <div class="card flex flex-wrap gap-3 p-fluid mb-4">
        <div class="flex-auto">
          <label for="date" class="block text-second-700 text-sm font-bold mb-2">Fecha</label>
          <Calendar
            v-model="date"
            id="date"
            dateFormat="dd/mm/yy"
            placeholder="Seleccionar fecha"
            input-class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-second-500"
            panel-class="shadow shadow-gray-400"
            required
          />
        </div>
        <div class="flex-auto">
          <label for="time" class="block text-second-700 text-sm font-bold mb-2">Hora</label>
          <Calendar
            v-model="time"
            id="time"
            timeOnly
            hourFormat="24"
            placeholder="Seleccionar hora"
            input-class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-second-500"
            panel-class="shadow shadow-gray-400"
            required
          />
        </div>
      </div>

      <div class="mb-4">
        <label for="description" class="block text-second-700 text-sm font-bold mb-2">Descripción</label>
        <textarea
          id="description"
          v-model="description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-second-500"
          placeholder="Descripción del culto..."
          rows="3"
        ></textarea>
      </div>

      <div class="flex justify-end">
        <Button 
          :label="worshipService ? 'Actualizar Culto' : 'Agendar Culto'" 
          icon="pi pi-calendar-plus" 
          @click="scheduleWorshipService"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { getTypesWorship } from '@/apiServices/index';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button'; 
import store from '@/store/index';

export default {
  props: {
    worshipService: {
      type: Object,
      default: null,
    },
  },
  components: {
    Dropdown,
    Calendar,
    Button,
  },
  data() {
    return {
      worshipName: this.worshipService ? this.worshipService.sermon_tittle : null,
      // Parse the date and time from worshipService if available
      date: this.worshipService ? this.parseDate(this.worshipService.date) : null,
      time: this.worshipService ? this.parseTime(this.worshipService.date) : null,
      description: this.worshipService ? this.worshipService.description : null,
      typesWorship: [],
      selectedTypeWorship:null,
      errorMessage: null,
    };
  },
  methods: {
    parseDate(datetime) {
      const date = new Date(datetime);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Only keep the date part
    },
    parseTime(datetime) {
      const date = new Date(datetime);
      return new Date(0, 0, 0, date.getHours(), date.getMinutes()); // Only keep the time part
    },
    scheduleWorshipService() {
      // Check for required fields
      if (!this.worshipName || !this.date || !this.time || !this.selectedTypeWorship) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
        return;
      }

      // Validar que la fecha esté al menos 4 días en el futuro
      const currentDate = new Date();
      const cultoDate = new Date(this.date);
      const differenceInDays = (cultoDate - currentDate) / (1000 * 60 * 60 * 24);

      if (differenceInDays < 4) {
        this.errorMessage = 'La fecha del culto debe ser al menos 4 días después de la fecha actual.';
        return;
      }

      // Combine the date and time
      const combinedDateTime = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate(),
        this.time.getHours(),
        this.time.getMinutes()
      );

      // Clear error message
      this.errorMessage = null;

      // Check if editing or creating
        // Dispatch the action to add a new service
        store.dispatch('addWorshipService', {
          id:this.worshipService.id,
          sermonTittle: this.worshipName,
          date: combinedDateTime,
          description: this.description,
          selectedTypeWorship: this.selectedTypeWorship.id,
        });
        
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Guardada configuración culto.', life: 3000 });
    },
    resetForm() {
      this.worshipName = null;
      this.date = null;
      this.time = null;
      this.description = null;
      this.selectedTypeWorship = null;
    },
    async getTypeWorship() {
      try {
        const response = await getTypesWorship();
        this.typesWorship = response;
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    },
  },
  async mounted() {
    await this.getTypeWorship();
    if (this.worshipService) {      
      console.log(this.typesWorship)
      this.selectedTypeWorship = this.typesWorship.find(type => type.id === this.worshipService.worship_service_type_id);
      console.log(this.selectedTypeWorship)

    }    
  },
};
</script>
