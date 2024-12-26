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
    <StrategiesGroups v-if="showForm" :groupIdProp="group.id" :integrantsProp="people" :strategieIdProp="strategy[0].estrategiaId" @close="toggleForm" />

    <!-- Organigrama -->
    <div id="orgchart-container" class="flex justify-center  p-4 rounded-lg shadow-md"></div>
  </section>
</template>

<script>
import OrgChart from "@balkangraph/orgchart.js";
import StrategiesGroups from "@/components/Groups/StrategiesGroups.vue";
import ServicesGroups from "@/components/Groups/ServicesGroups.vue";
import { getMyGroup, getStrategyById, getMyInfoGroup } from "@/apiServices";

export default {
  components: {
    StrategiesGroups,
    ServicesGroups,
  },
  data() {
    return {
      people: [],
      strategy: [],
      showForm: false,
      showServicesGroups: false,
      isEditing: false,
      group: {},
      orgChart: null,
    };
  },
  async mounted() {
    try {
      await this.getMyInfoGroup();
      await this.getMyGroup();
      await this.getStrategyById();
      this.renderOrgChart();
    } catch (error) {
      console.error("Error al inicializar el componente:", error);
    }
  },
  methods: {
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
        this.people = response || [];
      } catch (e) {
        this.handleError(e, "Error al obtener información del grupo");
      }
    },
    renderOrgChart() {
      if (!this.people.length) return;

      if (this.orgChart) {
        this.orgChart.destroy(); // Destruye cualquier instancia previa
      }

      const data = this.people.map((person) => {
        const strategy = this.strategy.find((s) => s.id === person.id);
        return {
          id: person.id,
          fullName: `${person.first_name} ${person.last_name}`,
          pid: strategy.leaderId,
          tags: [strategy.rol || "Miembro"],
          email: person.email,
        };
      });

      console.log("Datos del organigrama:", data);

      this.orgChart = new OrgChart(document.getElementById("orgchart-container"), {
        nodes: data,
        nodeBinding: {
          field_0: "fullName",
          field_1: "tags",
          field_2: "email",
        },
        template: "diva",
        enableSearch: false,
      });
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
#orgchart-container {
  min-height: 700px;
  max-width: 100%;
  overflow-x: auto;
}
</style>
