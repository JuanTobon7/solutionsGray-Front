<template>
  <div class="w-full">
    <!-- Cultos Section -->
    <div v-if="culto && culto.sermonTittle" class="flex items-center justify-center">
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
          <span class="text-2xl text-gray-800">{{ formatDate(culto.date)}}</span>
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
              <p class="text-lg font-semibold text-center">{{ slotProps.data.person.first_name + ' ' + slotProps.data.person.last_name }}</p>
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

    <!-- Confirm Button Section -->
    <div class="flex justify-end mt-4">      
      <button @click="handleSumbit" class="flex items-center bg-green-500 text-second-50 rounded-md p-2">
        <span class="material-symbols-outlined mr-2">check</span>
        Confirmar
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Avatar from 'primevue/avatar';
import Carousel from 'primevue/carousel';
import Card from 'primevue/card';
import { createWorshipService, assingService, updateWorshipService, updateAssingServices } from '@/apiServices/index';

export default {
  props: ['edit'],
  name: 'ConfirmationWorshipService',
  components: {
    Avatar,
    Carousel,
    Card,
  },
  data() {
    return {
      numVisible: 3,
      culto: null, // Inicializado como null
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
      this.culto = newCulto || {}; // Asignar culto o un objeto vacío
      console.log('epa this is the vulto',this.culto)
    },
    storedAssignedServices(newAssignedServices) {
      this.assignedServices = newAssignedServices || []; // Asegurarse de asignar una lista vacía si no hay datos
    },
  },
  mounted() {
    this.initializeData();
    console.log('edit: ', this.edit);
  },
  beforeUnmount() {
    this.cleanupComponent();
  },
  methods: {
    initializeData() {
      this.culto = this.storedCulto || {};
      console.log('culto in initializeData: ',this.culto)
      // Asegurarse de que culto tenga un valor inicial
      this.assignedServices = this.storedAssignedServices || [];
    },
    cleanupComponent() {
      this.culto = null;
      this.assignedServices = [];
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const options = { month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' };
      let dateFormated = date.toLocaleDateString('es-ES', options);
      dateFormated = dateFormated.charAt(0).toUpperCase() + dateFormated.slice(1);
      return dateFormated.replace(/,/g, ' ');
    },
    getInitials(person) {
      if (!person) return '';
      return person.first_name.charAt(0) + person.last_name.charAt(0);
    },
    removeAssignment(index) {
      this.assignedServices.splice(index, 1);
    },
    async createWorshipService() {
      try {
        console.log('Im in create worshipService')
        console.log('date: ',this.culto.date)
        if (!this.culto || !this.culto.sermonTittle || !this.culto.date || !this.culto.description || !this.assignedServices.length) {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos.', life: 3000 });
          return;
        }

        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date(this.culto.date);
        console.log('lolllll',date)

        const time = new Date(this.culto.time);

        date.setHours(time.getHours());
        date.setMinutes(time.getMinutes());

        const fullDate = date.toISOString();
        console.log('fullDate: ', fullDate);
        const assignedServices = this.assignedServices.map(service => ({ personId: service.person.id, rolService: service.service.id }));

        const culto = {
          sermonTittle: this.culto.sermonTittle,
          description: this.culto.description,
          typeWorshipId: this.culto.selectedTypeWorship,
          date: fullDate,
          timeZone: userTimeZone
        };

        let result = await createWorshipService(culto);
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: result.message, life: 3000 });

        result = await assingService({ assignedServices, id: result.id });
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: result.message, life: 3000 });

        this.$store.dispatch('flushAssignedServices');
        this.$store.dispatch('flushWorshipService');
        this.$emit('close');
      } catch (e) {
        console.log(e);
        if (e.response.data.status !== 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el culto.', life: 3000 });
        }
      }
    },
    async editWorshipService(){
      // Validar los campos requeridos
      console.log('Im in edit worshipService')
    try{
      console.log('culto: ',this.culto)
      if (!this.culto || !this.culto.sermonTittle || !this.culto.date || !this.culto.description || !this.assignedServices.length) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos.',life: 3000 });
      return;
    }
    console.log('time: ',this.culto.time)
    // Obtener la zona horaria del usuario
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Combinar la fecha y la hora
    const date = new Date(this.culto.date); // Asegúrate de que esto sea un objeto Date
    console.log('date: ',date)
    // Ajustar las horas y minutos del campo time en el campo date
    // Convertir la fecha completa a formato ISO (incluye fecha, hora y zona horaria)
    const fullDate = date.toISOString();
    console.log('fullDate: ',fullDate)
    // Asignar los servicios
    const assignedServices = this.assignedServices.map(service => ({personId: service.person.id, rolService: service.service.id}));
    
    // Crear el culto con la fecha completa y zona horaria
    const culto = {
      id: this.culto.id,
      sermonTittle: this.culto.sermonTittle,
      description: this.culto.description,    
      typeWorshipId: this.culto.selectedTypeWorship,  
      date: fullDate,
      timeZone: userTimeZone // Añadir la zona horaria al culto
    };
    
    let result = await updateWorshipService(culto)
    // Mostrar mensaje de éxito
    this.$toast.add({ severity: 'success', summary: 'Éxito', detail: result.message,life: 3000 });

    console.log('im going to updateAssignedServices')
    // Asignar los servicios al culto
    result = await updateAssingServices({assignedServices,id:result.id});
    this.$toast.add({ severity: 'success', summary: 'Éxito', detail: result.message,life: 3000 });

    // Limpiar los datos en Vuex
    this.$store.dispatch('flushAssignedServices');
    this.$store.dispatch('flushWorshipService');

    // Cerrar el modal o el componente
    this.$emit('close');

  }catch(e){
    console.log(e)
  }
    },
    async handleSumbit() {
      console.log('Im in handle submit')
      console.log('edit: ',this.edit)
      if (this.edit) {
        await this.editWorshipService();
      } else {
        await this.createWorshipService();
      }
      this.$emit('close');
    },
  }
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
