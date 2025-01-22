<template>
  <section class="container w-full">
    <div class="flex flex-wrap w-full items-center justify-between gap-6 mb-10">
      <Card class="flex-grow shadow-md shadow-gray-400 rounded-lg">
        <div class="relative w-full h-48 bg-cover bg-center bg-image rounded-t-lg">          
        </div>
        <div class="p-4">
          <h2 class="text-2xl font-semibold text-second-900">{{ worshipService.sermon_tittle }}</h2>
          <h3 class="text-xl text-second-800">{{ worshipService.worship_name }}</h3>
          <div class="flex items-center gap-2 mt-4 text-gray-800">
            <i class="material-symbols-outlined">event</i>
            <span class="text-lg">{{ formatDate(worshipService.date) }}</span>
          </div>
          <p class="mt-2 text-sm text-gray-600 whitespace-normal break-words overflow-hidden">
            {{ worshipService.description }}
          </p>
        </div>
      </Card>
      <div class="w-3/4 bg-second-50 p-6 rounded-lg shadow-md shadow-gray-300 flex-grow">
        <h2 class="text-2xl font-semibold text-second-800 mb-4 text-center">Resumen del Culto</h2>

        <div class="grid grid-cols-2 gap-4 text-second-900 mb-4">
          <p><strong>Título del Sermón:</strong> {{ worshipService.sermon_tittle }}</p>
          <p><strong>Descripción:</strong> {{ worshipService.description }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(worshipService.date) }}</p>
          <p><strong>Nombre del Culto:</strong> {{ worshipService.worship_name }}</p>
          <p><strong>Asistentes:</strong> {{numAttends}}</p>
          <p><strong>Total:</strong> $ {{getTotalOfferings() || '0.00'}}</p>
          <p v-for="items in offerings" :key="items.type_contribution">
           <strong> {{items.type_contribution}}:</strong> $ {{items.amount || '0.00'}}
          </p>        
        </div>
         <div class="flex items-center justify-center mb-4 gap-4">
           <button @click="$emit('close')" class="bg-second-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105 text-sm sm:text-base flex items-center gap-2">
             Volver
             <i class="material-symbols-outlined text-primary-50">arrow_back</i>
           </button>
          <button v-if="$hasRole('SuperAdmin')" @click="editServiceAndWorship" class="bg-second-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:bg-second-600 hover:scale-105 text-sm sm:text-base flex items-center gap-2">
            Editar Culto y Servicios
            <i class="material-symbols-outlined">edit</i>
          </button>

        </div>
      </div>
    </div>
    <div class="flex flex-col w-full h-auto mb-4">
      <div class="flex items-center gap-2 mb-1">        
        <i class="material-symbols-outlined text-second-800">event</i>
        <h3 class="text-2xl text-second-800 font-semibold">Privilegios Asignados</h3>
      </div>
      <DataView
      v-if="servicesAssigned.length"
      :value="servicesAssigned"
      :paginator="true"
        :rows="8"
        :emptyMessage="'No hay asistentes disponibles'"
        :pt="{
          paginatorPageButton: 'custom-paginator-button'
        }" 
    >
    <template #list="slotProps">
    <div class="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      <div
        v-for="(item, index) in slotProps.items"
        :key="index"
        class="bg-second-50 shadow-lg shadow-primary-300 rounded-lg overflow-hidden w-auto"
      >
        <div class="bg-gradient-to-r from-primary-500 to-primary-800 h-20"></div>
        <div class="px-4 py-6 -mt-14">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="flex flex-col md:flex-row items-center space-x-4">
              <div class="w-16 h-16 rounded-full overflow-hidden">
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
              <div class="text-wrap">
                <h2 class="text-xl font-bold text-gray-900">
                  {{ item.person.first_name }} {{ item.person.last_name }}
                </h2>
                <p class="text-sm text-gray-600">{{ item.person.email }}</p>
                <p class="text-sm text-gray-600">{{ item.person.phone }}</p>
                <p class="text-sm text-gray-600">{{ item.person.type_person }}</p>
                <p class="text-sm text-primary-900 font-semibold mt-2">
                  {{ item.service.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
    </DataView>
    </div>
      <div class="mb-6 bg-second-50 shadow-lg rounded-lg py-6">
        <div class="flex items-center gap-2 mb-6">
          <i class="material-symbols-outlined text-second-800">attach_money</i>
          <h2 class="text-2xl text-second-800 font-semibold">Detalle de Ofrendas</h2>
        </div>
        <div class="flex flex-wrap items-center justify-evenly gap-6 px-6">
          <!-- Gráfica Pie -->
          <div class="flex items-center justify-center">
            <canvas id="chart" ref="chart"></canvas>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div class="bg-gray-50 p-4 rounded-md shadow-md text-center">
              <p class="text-sm font-semibold text-gray-800">Total General</p>
              <p class="text-2xl text-second-500"> $ {{getTotalOfferings() || '0.00'}}</p>
            </div>
            <div v-for="items in offerings" :key="items.type_contribution" class="bg-gray-50 p-4 rounded-md shadow-md text-center">
              <p class="text-sm font-semibold text-gray-800">{{items.type_contribution}}</p>
              <p class="text-2xl text-second-500">$ {{items.amount || '0.00'}}</p>

            </div>
          </div>
        </div>
        <div v-if="$hasRole('Admin')" class="flex flex-col sm:flex-row items-center justify-center mt-8 gap-4">
          <button @click="toggleDownload" class="bg-second-500 text-white px-5 py-2 rounded-md transition-all duration-200 hover:bg-second-600 hover:scale-105 text-sm sm:text-base flex items-center gap-2">
            Descargar Reporte
            <i class="material-symbols-outlined">download</i>
          </button>
          <button @click="showMonetaryIncome = !showMonetaryIncome" class="bg-second-500 text-white px-5 py-2 rounded-md transition-all duration-200 hover:bg-second-600 hover:scale-105 text-sm sm:text-base flex items-center gap-2">
            Gestionar Ofrendas
            <i class="material-symbols-outlined">payments</i>
          </button>
        </div>
      </div>
    <div class="flex items-center gap-2 mb-6">
      <i class="material-symbols-outlined text-second-800">people</i>
      <h2 class="text-xl text-second-800 font-semibold">
        Asistentes al Culto
      </h2>
      <button @click="showShduleNewPerson = true" class="material-symbols-outlined rounded-md p-1 bg-second-500 text-white">person_add</button>
    </div>
    <div class="flex flex-col w-full overflow-x-auto mb-4">
      <DataView
        :value="attends"
        :paginator="true"
        :rows="8"
        :emptyMessage="'No hay asistentes disponibles'"
        :pt="{
          paginatorPageButton: 'custom-paginator-button'
        }"
      >
        <template #list="slotProps">
          <div class="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            <div
              v-for="(item, index) in slotProps.items"
              :key="index"
              class="bg-white shadow-lg rounded-lg"
            >
              <div class="bg-primary-50 shadow-lg shadow-primary-300 rounded-lg overflow-hidden w-full h-full">
                <div class="bg-gradient-to-r from-primary-500 to-primary-800 h-20"></div>
                <div class="px-4 py-6 -mt-14 relative">
                  <div class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="flex flex-wrap items-center justify-center                                                           lg:justify-between space-x-4">
                      <div class="w-16 h-16 rounded-full overflow-hidden">
                        <Avatar
                          v-if="item.avatar"
                          :image="item.avatar"
                          size="xlarge"
                          shape="circle"
                        />
                        <Avatar
                          v-else
                          :label="getInitials(item)"
                          class="bg-primary-100 flex items-center justify-center text-primary-800"
                          size="xlarge"
                          shape="circle"
                        />
                      </div>
                      <div>
                        <h2 class="text-xl font-bold text-gray-900">
                          {{ item.first_name + ' ' + item.last_name }}
                        </h2>
                        <p class="text-sm text-gray-600">{{ item.email }}</p>
                        <p class="text-sm text-gray-600">{{ item.phone }}</p>
                        <p class="text-sm text-gray-600">{{ item.type_person }}</p>
                        <div class="flex flex-col">                            
                          <label for="asistencia">¿Asistió?</label>
                          <InputSwitch 
                            id="asistencia" 
                            v-model="item.isAttend"
                            v-on:change="onAttendChange(item)"
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </section>
  <RecordMonetaryIncome v-if="showMonetaryIncome" @close="showMonetaryIncome = !showMonetaryIncome" :worshipService="worshipService" />
  <EditWorshipService :worshipService="this.worshipService" v-if="showEditService" @close="showEditService = !showEditService" @saved="getOfferingsFun"/>
  <section  v-if="showShduleNewPerson"  class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm  z-50">
    <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
      <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
        <div class="flex justify-between mb-3">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Formulario de Registro de Personas</h2>
          <button @click="showShduleNewPerson = !showShduleNewPerson" class="material-symbols-outlined text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200">close</button>
        </div>
       <SheduleNewPerson @close="showShduleNewPerson = !showShduleNewPerson" @personCreated="getPeopleFun"/>
      </div>
    </div>
  </section>
  <OfferingsPdf v-if="validateDownload" :wh="worshipService" :peopleProp="attends" :chartImage="chartImage" :offerings="offerings" @closeDownload="toggleDownload"/>
</template>

<script>
import { getServices,getPeople,saveAttendance,deleteAttendance,getAttendance,getOfferings } from '@/apiServices/index';
import Avatar from 'primevue/avatar';
import DataView from 'primevue/dataview';
import InputSwitch from 'primevue/inputswitch';
import { Chart } from "chart.js/auto";
import RecordMonetaryIncome from '../subComponents/RecordMonetaryIncome.vue';
import EditWorshipService from './EditWorshipService.vue';
import SheduleNewPerson from '../subComponents/SheduleNewPerson.vue';
import OfferingsPdf from './OfferingsPdf.vue';

export default {
  name: 'PDFGenerator',
  props: ['worshipService'],
  components: {
    Avatar,    
    DataView,
    InputSwitch,
    OfferingsPdf,    
    RecordMonetaryIncome,
    EditWorshipService,
    SheduleNewPerson
  },
  data() {
    return {
      servicesAssigned: [],
      numVisible: 3, // Número de elementos visibles en pantallas grandes
      showMonetaryIncome: false,
      showEditService: false,
      showShduleNewPerson: false,
      offerings: [],
      attends: [],
      chartImage: '',
      chartInstance: null,
      download: false
    }
  },
  methods: {
    editServiceAndWorship() {
      this.showEditService = true;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' };
      let dateFormated = date.toLocaleDateString('es-ES', options);
      dateFormated = dateFormated.charAt(0).toUpperCase() + dateFormated.slice(1);
      return dateFormated.replace(/,/g, ' ');
    },
    async getServicesAssigned() {
      try {
        const response = await getServices(this.worshipService.id);
        const service = response.map((service) => ({
          person: {
            id: service.id,
            first_name: service.first_name,
            last_name: service.last_name,
            serviceId: service.service_id,
            avatar: service.avatar || '', // Si no tiene avatar, no mostrar imagen
            email: service.email,
            phone: service.phone
          },
          service: {
            id: service.rol_id,
            name: service.rol_servant
          }
        }));
        this.servicesAssigned = service;
      } catch (e) {
        if(e){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }
      }
    },
    getInitials(person) {
      if (!person) return '';  
      return person.first_name.charAt(0) + person.last_name.charAt(0);
    },
    async getPeopleFun() {
      try {
        const response = await getPeople();
        this.attends = response.map(person => ({
          ...person,
          isAttend: false
        }));
      } catch (e) {
        if(e){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }
      }
    },
    async getAttendanceFun (){
      try{
        const response = await getAttendance(this.worshipService.id);
        this.attends = this.attends.map(person => {
          const attend = response.find(attend => attend.person_id === person.id);
          if (attend) {
            person.isAttend = true;
          }
          return person;
        });
      }catch(e){
        if(e){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }
      }
    },
    async registerAttendance(personId) {
      try {
        const response = await saveAttendance({personId,eventId:this.worshipService.id});
        return response
      } catch (e) {
        if(e){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }
        throw e
      }
    },
    updateChartData() {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");

  // Crear o actualizar el gráfico
  const chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: this.offerings.map(item => item.type_contribution),
      datasets: [
        {
          label: "Ofrendas",
          data: this.offerings.map(item => item.amount),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      animation: {
        onComplete: () => {
          this.chartImage = canvas.toDataURL("image/png");
        },
      },
      responsive: true,
      maintainAspectRatio: false, // Ajusta el gráfico al contenedor
      plugins: {
        legend: {
          display: true, // Mostrar la leyenda
        },
      },
      scales: {
        y: {
          display: false, // Ocultar el eje Y (incluyendo la cuadrícula)
        },
        x: {
          display: false, // Ocultar el eje X (incluyendo la cuadrícula)
        },
      },
    },
  });

  // Guardar la referencia al gráfico si necesitas actualizarlo más adelante
  this.chartInstance = chart;
},


    getTotalOfferings(){      
      return this.offerings.reduce((acc, item) => acc + Number(item.amount ?? 0), 0).toFixed(2);
    },
    async deleteAttendanceFun(personId) {
      try {        
        const response = await deleteAttendance({personId,eventId:this.worshipService.id});
        return response
      } catch (e) {
        if(e){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }

        throw e
      }
    },
    async onAttendChange(person) {
      try{        
        if (person.isAttend) {
          await this.registerAttendance(person.id);          
        } else {
          await this.deleteAttendanceFun(person.id)
        }
      this.$toast.add({severity:'success', summary: 'Success', detail: 'Asistencia actualizada',life: 3000});
      }catch(e){
        if(e.response.status === 400 || e.response.status === 401 || e.response.data.message==='Token Expired'){
          this.$toast.add({severity:'error', summary: 'Error', detail: 'Ups algo paso intentalo denuevo',life: 3000});
        }
        const index = this.attends.findIndex(item => item.id === person.id);
        this.attends[index].isAttend = !person.isAttend;

        return
      }
    },      
    async getOfferingsFun(){
      try{
        const response = await getOfferings(this.worshipService.id);
        this.offerings = response;
        this.updateChartData();
      }catch(e){
        if(e){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }
      }
    },
    toggleDownload() {
      this.download = !this.download;
    }
    },
  computed:{
    validateDownload(){
      if(this.attends.length > 0 && this.chartImage  && this.offerings && this.download){        
        return true
      }
      return false
    },
    numAttends() {
      const attends = this.attends.filter((person) => person.isAttend === true);
      return attends.length;
    }
  },
  async mounted() {
    await this.getOfferingsFun(this.worshipService.id);
    await this.getServicesAssigned();
    await this.getPeopleFun();
    await this.getAttendanceFun();
  },
}
</script>

<style scoped>
.bg-image {
  background-image: url('https://s3.us-east-2.amazonaws.com/viddefe.com/photos/vid.png'); /* Imagen de fondo del culto */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 1rem 1rem 0 0; /* Esquinas superiores redondeadas */
}
.custom-paginator-button {
  @apply p-2 text-primary-800;
}
</style>
