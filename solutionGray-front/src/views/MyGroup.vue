<template>
  <section class="container mx-auto px-6 py-8">
    <!-- Encabezado -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-second-700 mb-2">
        Estrategia y Organización del grupo {{ group.name || 'Cargando...' }}
      </h1>
      <p class="text-lg text-gray-600 italic">
        "Un grupo comprometido con la transformación espiritual."
      </p>
    </div>

    <!-- Descripción y Botones -->
    <div>
      <p class="mb-4 text-gray-700">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil nulla illo
        provident quas maiores vitae iste, blanditiis veniam animi eaque, itaque,
        consectetur saepe! Repudiandae aliquam in quasi minima nisi repellendus.
      </p>
      <div class="flex items-center justify-end gap-4">
        <button
          @click="toggleForm"
          class="bg-second-500 hover:bg-second-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
        >
          {{ isEditing ? 'Editar' : 'Crear' }} Grupo
          <i class="material-symbols-outlined">{{ isEditing ? 'edit' : 'add' }}</i>
        </button>
        <button
          @click="toggleServicesGroups"
          class="bg-second-500 hover:bg-second-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
        >
          Ver Reuniones
          <i class="material-symbols-outlined">event</i>
        </button>
      </div>
    </div>

    <!-- Componentes Dinámicos -->
    <StrategiesGroups v-if="showForm" :groupIdProp="group.id" :integrantsProp="peopleGroup" :strategieIdProp="strategy[0].estrategiaId" @close="toggleForm" />

    <!-- Organigrama -->
    <div id="orgchart-container" class=" orgchart mb-6"></div>
    <div>      
        <h2 class="text-xl text-second-800 font-semibold mb-6">
          Asistentes al grupo {{ group.name || 'Cargando...' }}
        </h2>
      <div>
      </div>
      <DataView :value="peopleAssistance" layout="list"  :paginator="true" :rows="5">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="mb-4 flex items-center gap-8">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center">
                      <label for="date" class="text-sm text-gray-600">
                          Seleccione la fecha para ver los asistentes:
                      </label>
                      <Calendar
                          id="date"
                          v-model="date"
                          :show-icon="true"
                          :dateFormat="'yy-mm-dd'"
                          placeholder="Seleccione una fecha"
                          class="w-full min-w-[200px] max-w-[300px] shadow appearance-none border border-second-100 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
              </div>    
          <div>                  
          <button @click="getAttendanceGroup" class="bg-second-500 text-white p-2 rounded-full material-symbols-outlined mr-2">
              refresh
          </button>
          <button 
          @click="showAdd = true"
          class="bg-second-500 text-white p-2 rounded-full material-symbols-outlined">
              person_add
          </button>
          </div>
          </div>
        </template>
        <template #list="slotProps">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              <div
              v-for="(item, index) in slotProps.items"
              :key="index"
              class="bg-white shadow-lg rounded-lg w-full h-full" 
              >
                  <div class="bg-primary-50 shadow-lg shadow-primary-300 rounded-lg overflow-hidden h-full w-full">
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
                                      <div class="flex flex-col">                            
                                          <label for="asistencia">¿Asistió?</label>
                                          <InputSwitch 
                                          id="asistencia"
                                          v-model="item.isAttend"  
                                          @change="onAttendChange(item)" 
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
  <RegisterAssistance v-if="showAdd" :people="people" @close="showAdd = false" />
</template>

<script>
import OrgChart from "@balkangraph/orgchart.js";
import StrategiesGroups from "@/components/Groups/StrategiesGroups.vue";
import DataView from "primevue/dataview";
import  Calendar  from "primevue/calendar";
import Avatar from "primevue/avatar";
import InputSwitch from "primevue/inputswitch";
import RegisterAssistance from "@/components/Groups/RegisterAssistance.vue";
import {format} from "date-fns"
import { getMyGroup, getStrategyById, getMyInfoGroup,getPeople,getAttendanceGroup } from "@/apiServices";

export default {
  components: {
    RegisterAssistance,
    StrategiesGroups,
    InputSwitch,
    DataView,
    Calendar,
    Avatar,
  },
  data() {
    return {
      peopleGroup: [],
      people: [],      
      peopleAssistance: [],
      date: null,   
      strategy: [],
      showForm: false,
      showServicesGroups: false,
      isEditing: false,
      group: {},
      orgChart: null,
      showAdd: false
    };
  },
  watch: {
    date(){
      this.getAttendanceGroup();
    }
  },
  async mounted() {
    try {
      await this.getMyInfoGroup();
      await this.getPeople();
      await this.getMyGroup();
      await this.getStrategyById();
      this.renderOrgChart();
    } catch (error) {
      console.error("Error al inicializar el componente:", error);
    }
  },
  methods: {
     getInitials(person) {
      if (!person) return '';
      return person.first_name.charAt(0) + person.last_name.charAt(0);
      },
    async getPeople() {
      try {
        const response = await getPeople();
        this.people = response || [];
      } catch (e) {
        this.handleError(e, "Error al obtener información de las personas");
      }
    },
    async getMyInfoGroup() {
      try {
        const response = await getMyInfoGroup();
        this.group = response || {};
      } catch (e) {
        this.handleError(e, "Error al obtener información del grupo");
      }
    },
    async getStrategyById() {
      try {
        if (!this.group.strategy_id) throw new Error("Falta el ID de estrategia");
        const response = await getStrategyById(this.group.strategy_id);
        this.strategy = response || [];
      } catch (e) {
        this.handleError(e, "Error al obtener estrategia");
      }
    },
    async getMyGroup() {
      try {
        if (!this.group.id) throw new Error("Falta el ID del grupo");
        const response = await getMyGroup(this.group.id);
        this.peopleGroup = response || [];
      } catch (e) {
        this.handleError(e, "Error al obtener información del grupo");
      }
    },
    async getAttendanceGroup() {
      try {        
        console.log('holaa')
        if (!this.group.id) throw new Error("Falta el ID del grupo");
        if(!this.date) return;
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = format(this.date, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });
        const response = await getAttendanceGroup({groupId:this.group.id,date});        
        this.peopleAssistance = response.find((item)=>{
          const person = this.people.find((p)=>p.id === item.id);
          return {
            ...person,
            isAttend: true
          }
        })
      } catch (e) {
        this.handleError(e, "Error al obtener información del grupo");
      }
    },
    renderOrgChart() {
    // Verifica si hay personas en la lista
      if (!this.peopleGroup.length) return;

      // Destruye cualquier instancia previa del organigrama
      if (this.orgChart) {
          this.orgChart.destroy();
      }

      OrgChart.templates.myTemplate = Object.assign({}, OrgChart.templates.base);
      OrgChart.templates.myTemplate.size = [320, 200]; // Reducido el tamaño para reflejar el espaciado más compacto
      OrgChart.templates.myTemplate.node = `
          <rect x="0" y="0" width="320" height="200" fill="#f8f8f8" stroke-width="1" stroke="#dcdcdc" rx="10" ry="10"></rect>
          <rect x="0" y="0" width="320" height="50" fill="#8b806a" rx="10" ry="2"></rect>
      `;

      // Imagen de perfil
      OrgChart.templates.myTemplate.img_0 = `
          <clipPath id="personImgClip">
              <circle cx="50" cy="110" r="40"></circle>
          </clipPath>
          <image 
              preserveAspectRatio="xMidYMid slice" 
              clip-path="url(#personImgClip)" 
              xlink:href="{val}" 
              x="10" 
              y="70" 
              width="80" 
              height="80" 
              onerror="this.style.display = 'none'">
          </image>
      `;

      // Iniciales (si no hay imagen)
      OrgChart.templates.myTemplate.initials = `
          <circle cx="50" cy="110" r="40" fill="#dcdcdc"></circle>
          <text style="font-size: 30px;" fill="#4D4D4D" x="50" y="120" text-anchor="middle">{val}</text>
      `;

      // Campo de nombre (más cerca del rol)
      OrgChart.templates.myTemplate.field_0 = `
          <text style="font-size: 20px; font-weight: bold;" fill="#4D4D4D" x="110" y="84" text-anchor="start">{val}</text>
      `;

      // Correo y teléfono (ahora más cerca del nombre y rol)
      OrgChart.templates.myTemplate.field_1 = `
          <foreignObject x="110" y="95" width="190" height="40">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 16px; color: #4D4D4D; white-space: normal; overflow-wrap: break-word;">
                  {val}
              </div>
          </foreignObject>
      `;

      // Rol de privilegio (sin espacio extra entre elementos)
      OrgChart.templates.myTemplate.field_2 = `
          <foreignObject x="110" y="155" width="190" height="40">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 16px; font-weight: bold; color: #4D4D4D; white-space: normal; overflow-wrap: break-word;">
                  {val}
              </div>
          </foreignObject>
      `;

      // Ajustes de espaciado (sin márgenes innecesarios)
      OrgChart.templates.myTemplate.padding = [20, 20, 20, 20];

      // Mapea los datos de las personas para estructurarlos como nodos del organigrama
      const data = this.peopleGroup.map((person) => {
          const strategy = this.strategy.find((s) => s.id === person.id) || {};
          return {
            id: person.id,
            fullName: `${person.first_name} ${person.last_name}`,
            pid: strategy.leaderId || null, // Identificador del líder, si existe
            tags: [strategy.rol || "Miembro"], // Etiqueta basada en el rol
            email: person.email,
            img: person.avatar, // URL de la foto si existe
            initials: person.avatar? null: this.getInitials(person), // Asegura que las iniciales estén en los datos
          };
      });

      console.log("Datos del organigrama:", data);

      // Inicializa el organigrama
      this.orgChart = new OrgChart(document.getElementById("orgchart-container"), {
          nodes: data,
          nodeBinding: {
              field_0: "fullName", // Nombre completo
              field_1: "tags", // Rol o etiqueta
              field_2: "email", // Email
              field_3: "phone", // Teléfono
              img_0: "avatar",
              initials: "initials", // Iniciale
          },
          enableSearch: false, // Deshabilita la búsqueda
          nodeMenu: {
              details: { text: "Detalles" },
              edit: { text: "Editar" },
              add: { text: "Agregar" },
              remove: { text: "Eliminar" },
          },
          template: "myTemplate", // Usa el template personalizado
          nodeMouseClick: this.handleNodeClick.bind(this), // Asocia la función para manejar clicks
      });
  },


    handleNodeClick(sender, args) {
        console.log("Nodo seleccionado:", args.node);
        // Implementa cualquier lógica adicional para manejar clicks en el nodo
    },
    handleError(error, message) {
      if (error.response?.status === 401 && error.response?.data?.message === "Token has expired") {
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Por favor, intentalo nuevamente",
          life: 3000,
        });
      } else {
        console.error(message, error);
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: message,
          life: 3000,
        });
      }
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
    toggleServicesGroups() {
      this.showServicesGroups = !this.showServicesGroups;
    },
  },
};
</script>

<style scoped>
.orgchart {
  @apply h-[60vh] w-full container mx-auto flex justify-center  p-4 rounded-lg shadow-md;
}
</style>
