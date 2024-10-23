<template>
  <section class="h-screen container">  
    
    <!-- Sección de estadísticas y control -->
    <div class="h-auto ">
      <h1 class="text-3xl sm:text-5xl mb-4 text-second-800 text-center"><strong>Servidores</strong></h1>
      <h2 class="text-xl sm:text-2xl text-second-800 text-center mb-6"><strong>Estadísticas e Información de los servidores</strong></h2>
      <p class="text-primary-900 text-xl sm:text-2xl font-serif"><strong>Rogad, pues, al Señor de la mies, que envíe obreros a su mies. Mateo 9:38</strong></p>

      <div v-if="selectedServant">
        <InfoServantCard 
        @close="selectedServant = null"
        :servants="selectedServant" 
        />
      </div>

      <!-- Botones para alternar entre DataTable y Card View -->
       <div v-else>
        <div class="flex flex-col sm:flex-row gap-2 mb-4">   
          <div v-if="!tableView" class="flex flex-col sm:flex-row gap-2">
          <button class="bg-primary-500 text-white p-2 rounded-md" @click="getServants">Actualizar</button>
          <button @click="addServants" class="bg-primary-500 text-white p-2 rounded-md">Invitar</button>
        </div>       
          <button @click="toggleView" class="bg-primary-500 text-white p-2 rounded-md">{{ tableView ? 'Vista en Tarjetas' : 'Vista en Tabla' }}</button>
        </div>
        
        
        <!-- Carga de datos (skeleton loader) -->
        
        <!-- Vista en DataTable -->
        <div v-if="tableView" class="p-4 sm:p-6 overflow-x-auto">
          <DataTable 
            :value="servantsInfo" 
            v-model:selection="selectedServant"
            selectionMode="single"
            class="w-full border-collapse" 
            tableStyle="min-width: 40rem;"
          >           
          <template #header>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-2xl text-second-900 font-bold">Servidores</span>
                <div>                  
                  <button @click="getServants" class="bg-second-500 text-white p-2 rounded-full material-symbols-outlined mr-2">
                    refresh
                  </button>
                  <button @click="addServants" class="bg-second-500 text-white p-2 rounded-full material-symbols-outlined">
                    person_add
                  </button>
                </div>
              </div>
          </template>
            <Column field="first_name" header="Primer Nombre" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800"></Column>
            <Column field="last_name" header="Primer Apellido" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800"></Column>
            <Column field="email" header="Email" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800"></Column>
            <Column field="usual_rol" header="Rol Habitual" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800">
              <template #body="slotProps">
                <Tag :value="slotProps.data.usual_rol">
                  {{ slotProps.data.usual_rol || 'No definido' }}
                </Tag>
              </template>
            </Column>
            <Column field="last_service" header="Último Servicio" class="p-2 sm:p-4 text-center border-b border-primary-200 text-second-800">
              <template #body="slotProps">
                <Tag :value="slotProps.data.last_service">
                  {{ formatDate(slotProps.data.last_service)  || 'No definido'}}
                </Tag>
              </template>
            </Column> 
              
          </DataTable>
        </div>
        
        <div v-else class="w-full">
        <!-- Vista en Tarjetas -->        
        <div class="flex flex-col w-full overflow-x-auto mb-4">
        <DataView
          :value="servantsInfo"
          :paginator="true"
          :rows="8"
          :emptyMessage="'No hay asistentes disponibles'"
          :pt="{
            paginatorPageButton: 'custom-paginator-button'
          }"
        >
          <template #list="slotProps">
            <!-- Contenedor con un grid para ajustar el ancho -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full py-2">
              <div
                v-for="(item, index) in slotProps.items"
                :key="index"
                class="bg-white shadow-lg rounded-lg cursor-pointer transition-transform duration-200 hover:-translate-y-2 "
                @click="selectedServant = item"
              >
                <div class="bg-primary-50 shadow-lg shadow-primary-300 rounded-lg overflow-hidden">
                  <div class="bg-gradient-to-r from-primary-500 to-primary-800 h-20"></div>
                  <div class="px-4 py-6 -mt-14 relative">
                    <div class="bg-white p-6 rounded-lg shadow-lg">
                      <div class="flex items-center space-x-4">
                        <!-- Avatar o iniciales de la persona -->
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
                        <!-- Información de la persona -->
                        <div>
                          <h2 class="text-xl font-bold text-gray-900">
                            {{ item.first_name + ' ' + item.last_name }}
                          </h2>
                          <p class="text-sm text-gray-600">{{ item.email }}</p>
                          <p class="text-sm text-gray-600">{{ item.phone }}</p>
                          <p class="text-sm text-gray-600">{{ item.type_person }}</p>
                          <!-- Servicio asignado -->                          
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
      </div>    
    </div>    
  </div>    


    <!-- Componente para agregar servidores -->
    <AddServantCard 
      v-if="newServantsVisible" 
      @close="closeAddServantCard" 
    />
  </section>
</template>

<script>
import { getServants, getServantById} from '../apiServices/index'
import AddServantCard from '@/components/Servants/AddServantCard.vue';
import InfoServantCard from '@/components/Servants/InfoServantCard.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import DataView from 'primevue/dataview';
import Avatar from 'primevue/avatar';

export default {
  components: {
    DataTable,
    Column,
    Tag,
    AddServantCard,
    InfoServantCard,
    DataView,
    Avatar
  },
  data() {
    return {
      servantsInfo: [],
      tableView: true,
      newServantsVisible: false,
      servantInfoById: null,
      loading:true,
      selectedServant: null
    };
  },
  methods: {
    async getServants() {
      this.servantsInfo = await getServants();
      this.loading = false;
    },
    addServants() {
      this.newServantsVisible = true;
    },
    closeAddServantCard() {
      this.newServantsVisible = false;
    },
    toggleView() {
      this.tableView = !this.tableView;
    },
    getInitials(item) {
      return item.first_name.charAt(0) + item.last_name.charAt(0);
    },
    async handleServantsInfo(id) {
      try{
        const servantInfoById = await getServantById(id);
        this.servantInfoById = servantInfoById;
      }catch(error){
        console.log(error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  async mounted() {
    await this.getServants();
  }
};
</script>

<style scoped>
.custom-paginator-button {
  background-color: #f3f4f6;
  color: #1e293b;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
}
</style>