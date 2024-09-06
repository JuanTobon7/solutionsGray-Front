<template>
  <div class="p-6">
    <h3 class="text-3xl font-semibold text-second-800 mb-4">Agendar Culto</h3>
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
            showTime
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
          @click="scheduleWorshipService"
          label="Agendar Culto" 
          icon="pi pi-calendar-plus" 
        />
      </div>
    </form>
  </div>
</template>

<script>
import {getTypesWorship} from '@/apiServices/index'
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button'; // Add Button component
import store from '@/store/index'

export default {
  components: {
    Dropdown,
    Calendar,
    Button // Register Button component
  },
  data() {
    return {
      worshipName: null,
      date: null,
      time: null,
      description: null,
      selectedTypeWorship: null,
      typesWorship: []
    };
  },
  methods: {
    scheduleWorshipService() {
      console.log({
        worshipName: this.worshipName,
        date: this.date,
        time: this.time,
        description: this.description,
        selectedTypeWorship: this.selectedTypeWorship
      });
      
      store.dispatch('addWorshipService', {
        worshipName: this.worshipName,
        date: this.date,
        time: this.time,
        description: this.description,
        selectedTypeWorship: this.selectedTypeWorship
      });
      console.log('pipipi')
    },
    async getTypeWorship(){
      try{
        const response = await getTypesWorship()
        this.typesWorship = response
      }
      catch(error){
        console.log(error.response?.data || error.message)
      }
    }
  },
  mounted(){
    this.getTypeWorship()
  }
};
</script>

<style scoped>
/* Additional styles */
</style>
