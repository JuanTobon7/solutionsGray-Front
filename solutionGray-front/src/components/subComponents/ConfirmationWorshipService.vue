<template>
  <div class="w-full">
    <!-- Cultos Section -->
    <div v-if="culto && culto.titleSermon" class="flex items-center justify-center">
      <Card class="transition-transform duration-200 hover:-translate-y-2 shadow-md shadow-gray-400 overflow-hidden">
        <template #header>
          <img src="../../assets/vid.png" alt="Culto Image" class="w-full h-44 object-cover" />
        </template>
        <template #title>
          <h2 class="text-3xl text-second-900 font-bold">{{ culto.titleSermon }}</h2>
        </template>
        <template #subtitle>
          <h3 class="text-xl text-second-800">{{ culto.name }}</h3>
        </template>
        <template #content>
          <span class="text-2xl text-gray-800">{{ formatDate(culto.date) }}</span>
          <p class="text-gray-800 mt-2">
            {{ culto.description }}
          </p>
        </template>
      </Card>
    </div>
    <div v-else>
      <p class="text-gray-600">No hay culto disponible.</p>
    </div>

    <!-- Servicios Asignados Section -->
    <div class="mt-4 max-w-[100vh]">
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
import { mapGetters } from 'vuex';
import Avatar from 'primevue/avatar';
import Carousel from 'primevue/carousel';
import Card from 'primevue/card';
import {createWorshipService,assingService} from '@/apiServices/index'

export default {
  name: 'ConfirmatioWorshipService',
  components: {
    Avatar,
    Carousel,
    Card,
  },
  data() {
    return {
      numVisible: 3,
      culto: null,
      assignedServices: [],
    };
  },
  computed: {
    ...mapGetters({
      storedCulto: 'worshipService',
      storedAssignedServices: 'assignedServices',
    }),
  },
  watch: {
    storedCulto(newCulto) {
      this.culto = newCulto;
    },
    storedAssignedServices(newAssignedServices) {
      this.assignedServices = newAssignedServices;
    },
  },
  mounted() {
    this.initializeData();
  },
  beforeUnmount() {
    this.cleanupComponent();
  },
  methods: {
    initializeData() {
      this.culto = this.storedCulto || {};
      this.assignedServices = this.storedAssignedServices || [];
    },
    cleanupComponent() {
      // Any necessary cleanup when the component is destroyed
      this.culto = null;
      this.assignedServices = [];
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const options = { month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' };
      let formattedDate = date.toLocaleDateString('es-ES', options);
      formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      return formattedDate.replace(/,/g, ' ');
    },
    getInitials(person) {
      if (!person) return '';
      return person.name.charAt(0) + (person.surname ? person.surname.charAt(0) : '');
    },
    removeAssignment(index) {
      this.assignedServices.splice(index, 1);
    },
    async createWosrhisService(){
      try{        
        if(!this.culto || !this.culto.titleSermon || !this.culto.name || !this.culto.date || !this.culto.description || !this.assignedServices.length){
          this.$toast.add({severity:'error', summary:'Error', detail:'Por favor, complete todos los campos.'});
          return
        }
        const culto = this.culto
        const assignedServices = this.assignedServices.map(service => service.id)
        let result = await createWorshipService(culto)       
        
        this.$toast.add({severity:'success', summary:'Éxito', detail:result.message});

        result = await assingService(assignedServices)
        this.$toast.add({severity:'success', summary:'Éxito', detail:result.message});
        
        this.$store.dispatch('flushAssignedServices')
        this.$store.dispatch('flushWorshipService')
        this.$emit('close')
      }catch(e){
        this.$toast.add({severity:'error', summary:'Error', detail:'Ha ocurrido un error al crear el culto.'});
      }
    }
  }
}

</script>

<style scoped>
/* Add your component-specific styles here */
</style>
