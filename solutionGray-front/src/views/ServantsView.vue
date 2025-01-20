<template>
  <section class="h-screen container">  
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
       <div v-else>        
        <div v-if="tableView" class="p-4 sm:p-6 overflow-x-auto">
          <DataTable 
            :value="servantsInfo" 
            stripedRows
            scrollable
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
                  <button v-if="$hasRole('Admin')" @click="addServants" class="bg-second-500 text-white p-2 rounded-full material-symbols-outlined">
                    person_add
                  </button>
                </div>
              </div>
          </template>
            <Column field="avatar" header="Foto" frozen class="p-2 text-center border-b border-primary-200 text-second-800">
              <template #body="slotProps">
                <Avatar
                  v-if="slotProps.data.avatar"
                  :image="slotProps.data.avatar"
                  size="large"
                  class="flex items-center justify-center"
                  shape="circle"
                />
                <Avatar
                  v-else
                  :label="getInitials(slotProps.data)"
                  class="bg-primary-100 flex items-center justify-center text-primary-800"
                  size="large"
                  shape="circle"
                />
              </template>
            </Column>
            <Column field="first_name" header="Primer Nombre"  class="p-2 text-center border-b border-primary-200 text-second-800"></Column>
            <Column field="last_name" header="Primer Apellido" class="p-2 text-center border-b border-primary-200 text-second-800"></Column>
            <Column field="email" header="Email" class="p-2 text-center border-b border-primary-200 text-second-800"></Column>
            <Column  field="usual_rol" header="Rol Habitual" class="p-2 text-center border-b border-primary-200 text-second-800">
              <template #body="slotProps">
                <Tag :value="slotProps.data.usual_rol">
                  {{ slotProps.data.usual_rol || 'No definido' }}
                </Tag>
              </template>
            </Column>
            <Column field="last_service" header="Último Servicio" class="p-2 text-center border-b border-primary-200 text-second-800">
              <template #body="slotProps">
                <Tag :value="slotProps.data.last_service">
                  {{ formatDate(slotProps.data.last_service)  || 'No definido'}}
                </Tag>
              </template>
            </Column> 
            <Column field="user_rol" v-if="$hasRole('SuperAdmin')" class="border-b border-primary-200 text-second-800">
              <template #header>
                <div class="flex items-center gap-2">                  
                  <span>Rol de Usuario</span>
                  <button @click="spanRolesHelp = true" class=" text-gray-800 material-symbols-outlined">
                    help
                  </button>
                </div>
              </template>  
              <template #body="{ data }">
                  <Dropdown 
                      @change="onStatusChange(data, $event)"
                      v-model="data.user_rol" 
                      :options="roles" 
                      optionValue="user_rol"
                      placeholder="Selecciona el Rol"
                      class="w-full"
                  >
                      <template #value="{ value }">
                          <div class="flex align items-center">
                              <span>{{ value }}</span>
                          </div>                                    
                      </template>
                      <template #option="{ option }">
                          <div class="flex align-items-center">
                              <span>{{ option.user_rol }}</span>
                          </div>
                      </template>
                    </Dropdown>
                </template>
            </Column>
            <Column header="Ver usuario" class="p-2 border-b border-primary-200 text-second-800">
              <template #body="{ data }">
                <button @click="handleServantsInfo(data)" class="bg-second-500 text-white p-1 rounded-full material-symbols-outlined">
                  visibility
                </button>
              </template>
            </Column>
          </DataTable>
        </div>
    </div>    
  </div>    
    <AddServantCard 
      v-if="newServantsVisible" 
      @close="closeAddServantCard" 
    />
    <spanRolesHelp 
      v-if="spanRolesHelp" 
      @close="spanRolesHelp = false"
    />
    
  </section>
</template>

<script>
import { getServants,updateRolServant} from '../apiServices/index'
import AddServantCard from '@/components/Servants/AddServantCard.vue';
import InfoServantCard from '@/components/Servants/InfoServantCard.vue';
import spanRolesHelp from '@/components/Servants/spanRolesHelp.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';

export default {
  components: {
    AddServantCard,
    InfoServantCard,
    spanRolesHelp,
    DataTable,
    Dropdown,
    Column,
    Avatar,
    Tag,
  },
  data() {
    return {
      servantsInfo: [],
      tableView: true,
      newServantsVisible: false,
      servantInfoById: null,
      loading:true,
      selectedServant: null,
      date: null,
      spanRolesHelp: false,
      roles: [
        {user_rol_id: 1, user_rol: 'User'},
        {user_rol_id: 2, user_rol: 'Admin'},
        {user_rol_id:3,  user_rol: 'Super Admin'},
        {user_rol_id:4,  user_rol: 'Pastor'}
      ]
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
    async handleServantsInfo(data) {
     this.selectedServant = data
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async onStatusChange(servant, newStatus) {
      console.log('servant', servant);
      console.log('newStatus', newStatus);
      const rolId = this.roles.find((rol) => rol.user_rol === newStatus.value).user_rol_id;
      const payload = { id: servant.id, userRolId: rolId };
      await updateRolServant(payload);
      this.$toast.add({
        severity: 'success',
        summary: 'Rol actualizado',
        detail: `Rol de ${servant.first_name} correctamente actualizado`,
        life: 3000,
      });
    },
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