<template>
  <div class="w-full">
    <!-- Cultos Section -->
    <div v-if="culto && culto.sermonTittle" class="flex items-center justify-center">
      <Card class="transition-transform duration-200 hover:-translate-y-2 shadow-md shadow-gray-400 overflow-hidden">
        <template #header>
          <img src="https://s3.us-east-2.amazonaws.com/viddefe.com/photos/vid.png" alt="Culto Image" class="w-full h-44 object-cover" />
        </template>
       <!-- Título y subtítulo -->
       <template #title>
            <h2 class="text-2xl font-semibold text-second-900">{{ culto.sermonTittle }}</h2>
          </template>
          <template #subtitle>
            <h3 class="text-xl text-second-800">{{ culto.selectedTypeWorshipName }}</h3>
          </template>
        
          <!-- Contenido -->
          <template #content>
            <div class="flex flex-col ">
              <!-- Fecha y hora con icono -->
              <div class="flex items-center gap-3 mb-2">
                <i class="material-symbols-outlined text-gray-700">event</i>
                <span class="text-xl text-gray-800">{{ formatDate(culto.date) }}</span>
              </div>
              <!-- Descripción con efecto hover y tooltip -->
              <div class="flex items-center gap-2 text-gray-800">
                <span class="material-symbols-outlined">book</span>
                <!-- Ajustar texto largo -->
                <p class="whitespace-normal break-words overflow-hidden">{{ culto.description }}</p>
              </div>
            </div>
          </template>                  
        </Card>
    </div>
    <div v-else>
      <p class="text-gray-600">{{!group?'No hay culto disponible.':'No hay servicio disponible.'}}</p>
    </div>

    <!-- Servicios Asignados Section -->
    <div class="mt-4 lg:max-w-[130vh]">
      <h4 class="text-xl font-semibold text-gray-800 mb-4">Servicios Asignados</h4>
      <div>
        <DataView           
          :value="assignedServices"         
          :paginator="assignedServices.length > 3"
          :rows="3"
          emptyMessage="No hay servicios asignados"
        >
          <template #list="slotProps">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              <div
                v-for="(item, index) in slotProps.items"
                :key="index"
                class="p-4 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center"
              >
                <!-- Avatar -->
                <div class="w-20 h-20 rounded-full overflow-hidden mb-2">
                  <Avatar
                    v-if="item.person.avatar"
                    :image="item.person.avatar"
                    size="xlarge"
                    shape="circle"
                  />
                  <Avatar
                    v-else
                    :label="getInitials(item.person)"
                    class="bg-primary-100 flex items-center justify-center text-primary-800"
                    size="xlarge"
                    shape="circle"
                  />
                </div>

                <!-- Información de la persona -->
                <p class="text-lg font-semibold text-center">
                  {{ item.person.first_name + ' ' + item.person.last_name }}
                </p>
                <p>Rating: {{ item.rating }}</p>
                <p class="text-sm text-center text-gray-600">
                  {{ item.service.name }}
                </p>

                <!-- Botones de acción -->
                <div class="flex space-x-2 mt-4">
                  <button 
                    @click="removeAssignment(index)" 
                    class="material-symbols-outlined text-red-500 cursor-pointer"
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          </template>
        </DataView>
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
import DataView from 'primevue/dataview';
import Card from 'primevue/card';
import { createWorshipService,createWorshipServiceGroup, assingService, updateWorshipService, sendNotificationWorshipService } from '@/apiServices/index';
import { format } from 'date-fns-tz';


export default {
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
    group: {
      type: Object,
      default: null,
    },
  },
  name: 'ConfirmationWorshipService',
  components: {
    Avatar,
    DataView,
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
    },
    storedAssignedServices(newAssignedServices) {
      this.assignedServices = newAssignedServices || []; // Asegurarse de asignar una lista vacía si no hay datos
    },
  },
  mounted() {
    this.initializeData();
    console.log('group in ConfirmationWorshipService', this.group);
  },
  beforeUnmount() {
    this.cleanupComponent();
  },
  methods: {
    initializeData() {
      this.culto = this.storedCulto || {};
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
    async sendNotificationWorship(){
      try{        
        const dataEmail = {
          sermonTittle: this.culto.sermonTittle,
          date: this.formatDate(this.culto.date),
          typeWorshipName: this.culto.selectedTypeWorshipName,  
          churchName: this.$store.getters.user.churchName,
        }
        await sendNotificationWorshipService(dataEmail);
      }catch(e){
        if(e.response.status !== 401 && e.response.data.message === 'Token has expired'){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al enviar la notificación.', life: 3000 });
        }
      }
    },
    async createWorshipService() {
      try {
        console.log('culto in createWorshipService', this.culto);
        if (!this.culto || !this.culto.sermonTittle || !this.culto.date || !this.culto.description || !this.assignedServices.length) {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos.', life: 3000 });
          return;
        }
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date(this.culto.date);
        const fullDate = format(date, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
        const assignedServices = this.assignedServices.map(service => ({ personId: service.person.id, rolService: service.service.id }));

        const culto = {
          sermonTittle: this.culto.sermonTittle,
          description: this.culto.description,
          typeWorshipId: this.culto.selectedTypeWorship,
          date: fullDate,
          timeZone: userTimeZone,
          groupId: this.group? this.group.id : null,
        };

        let result = !this.group? await createWorshipService(culto) : await createWorshipServiceGroup(culto);
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: result.message, life: 3000 });

        result = await assingService({ assignedServices, id: result.id });
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: result.message, life: 3000 });

        this.$store.dispatch('flushAssignedServices');
        this.$store.dispatch('flushWorshipService');
        if(!this.group){          
          this.sendNotificationWorship();
        }
        this.$emit('worshipRegistered');
      } catch (e) {
        console.log(e);
        if (e.response.data.status !== 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el culto.', life: 3000 });
        }
      }
    },
    async editWorshipAndServices(){
      try{
        let response
        if(this.culto.edited){
          response = await this.editWorshipService();
          this.$toast.add({ severity: 'success', summary: 'Éxito', detail: response.message, life: 3000 });
        }
        const newAssignedServices = this.assignedServices.filter(service => service.new).map(service => ({ personId: service.person.id, rolService: service.service.id }));
        if(newAssignedServices.length === 0){
          return
        }
        response = await assingService({assignedServices: newAssignedServices, id: this.culto.id});
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: response.message, life: 3000 });
      }catch(e){
        console.log(e);
        if (e.response.status !== 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al crear el culto.', life: 3000 });
        }
      }
    },
    async editWorshipService(){
      if (!this.culto || !this.culto.sermonTittle || !this.culto.date || !this.culto.description || !this.assignedServices.length) {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos.', life: 3000 });
          return;
        }
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date(this.culto.date);

        const fullDate = date.toISOString();

        const culto = {          
          sermonTittle: this.culto.sermonTittle,
          description: this.culto.description,
          typeWorshipId: this.culto.selectedTypeWorship,
          date: fullDate,
          timeZone: userTimeZone
        };
        const response = await updateWorshipService(culto, this.culto.id);
        return response;      
    },
    async handleSumbit() {
      if (this.edit) {
        await this.editWorshipAndServices();
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
