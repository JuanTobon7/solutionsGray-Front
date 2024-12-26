<template>
  <section class="container mx-auto px-6 py-8">
    <!-- Encabezado -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-second-700 mb-2">
        Estrategia y Organización del grupo {{ group.name }}
      </h1>
      <p class="text-lg text-gray-600 italic">
        "Un grupo comprometido con la transformación espiritual."
      </p>
    </div>

    <!-- Descripción y Botones -->
    <div>
      <p class="mb-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil nulla illo
        provident quas maiores vitae iste, blanditiis veniam animi eaque, itaque,
        consectetur saepe! Repudiandae aliquam in quasi minima nisi repellendus.
      </p>
      <div class="flex items-center justify-end gap-4">
        <button @click="toggleForm" class="bg-second-500 hover:bg-second-600 text-white px-2 py-1 rounded-md flex items-center gap-2">
          {{ isEditing ? 'Editar' : 'Crear' }} Grupo
          <i class="material-symbols-outlined">{{ isEditing ? 'edit' : 'add' }}</i>
        </button>
        <button @click="toggleServicesGroups" class="bg-second-500 hover:bg-second-600 text-white px-2 py-1 rounded-md flex items-center gap-2">
          Ver Reuniones
          <i class="material-symbols-outlined">event</i>
        </button>
      </div>
    </div>

    <!-- Componentes Dinámicos -->
    <StrategiesGroups v-if="showForm" :integrantsProp="people" @close="toggleForm" />

    <!-- Organigrama -->
    <div id="orgchart-container" class="flex justify-center"></div>
  </section>
</template>

<script>
import OrgChart from "@balkangraph/orgchart.js";
import StrategiesGroups from "@/components/Groups/StrategiesGroups.vue";
import ServicesGroups from "@/components/Groups/ServicesGroups.vue";

import { getMyGroup,getStrategyById } from "@/apiServices";

export default {
  components: {
    StrategiesGroups,
    ServicesGroups,
  },
  data() {
    return {
      people: [],      
      strategy : [],
      showForm: false,
      showServicesGroups: false,
      isEditing: false,
      group: {
        name: "Grupo de Oración",
      },
      orgChart: null,
    };
  },
  async mounted() {
    await this.getMyGroup();
    this.renderOrgChart();
  },
  methods: {
    async getStrategyById(id){
      try{        
        const response = await getStrategyById(id);
        this.strategy = response;       
      }catch(e){
        if (e.response?.status !== 401 && e.response?.data?.message === 'Token has expired') {
          this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Intentalo de nuevo',
              life: 3000,
          });
        }
      }
    },
    async getMyGroup(){
      try{
        const response = await getMyGroup();
        console.log('strategyId',response[0].strategy_id);
        this.people = response;       
        await this.getStrategyById(response[0].strategy_id);
      }catch(e){
        if (e.response?.status !== 401 && e.response?.data?.message === 'Token has expired') {
          this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Intentalo de nuevo',
              life: 3000,
          });
        }
      }
    },
    renderOrgChart() {
      console.log('people',this.people);
      if(this.people.length === 0) {
        return;
      }
      if (this.orgChart) {
        this.orgChart.destroy(); // Destruye el organigrama previo
      }
      const data = this.people.map((person)=>{
        const strategy = this.strategy.find((p)=>person.id === p.id);
        return {
          ...person,
          fullName: `${person.first_name} ${person.last_name}`,
          pid: strategy?.leaderId,
          tags: [strategy?.role],
          }
      })
      console.log('data',data);
      this.orgChart = new OrgChart(document.getElementById("orgchart-container"), {
        nodes: data,
        nodeBinding: {
          field_0: "fullName",
          field_1: "tags",
          field_2: "role",
          field_3: "email",

        },
        template: "diva",
      });
    },
    addNode(newNode) {
      this.nodes.push(newNode);
      this.renderOrgChart();
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

<style>
</style>