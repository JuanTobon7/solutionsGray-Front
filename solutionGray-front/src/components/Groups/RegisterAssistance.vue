<template>
    <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
        <div class="bg-white p-8 sm:p-10 rounded-lg shadow-2xl w-full sm:min-w-[60%] flex flex-col max-h-full overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold text-second-800">Añadir Asistente al Grupo</h2>
            <button
              @click="$emit('close')"
              class="material-symbols-outlined text-3xl text-gray-700 hover:text-gray-900 transition-colors"
            >
              close
            </button>
          </div>
  
          <!-- Opciones -->
          <div v-if="newSelection === null" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Opción: Agregar Nuevo -->
            <div
              class="border shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              @click="toggleSelection(false)"
            >
              <i class="material-symbols-outlined text-7xl text-primary-800 mb-4">person_add</i>
              <p class="text-gray-600 mb-4 text-lg">
                Registra a una nueva persona que aún no está en la aplicación.
              </p>
              <button
                class="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-4 py-2 transition-all"
              >
                Agregar Nuevo
              </button>
            </div>
  
            <!-- Opción: Ver Registrados -->
            <div
              class="border shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              @click="toggleSelection(true)"
            >
              <i class="material-symbols-outlined text-7xl text-second-800 mb-4">person</i>
              <p class="text-gray-600 mb-4 text-lg">
                Registra como asistente a persona existente en la aplicación.
              </p>
              <button
                class="bg-second-500 hover:bg-second-600 text-white font-semibold rounded-md px-4 py-2 transition-all"
              >
                Ver Registrados
              </button>
            </div>
          </div>
  
          <!-- Subcomponents -->
          <SheduleNewPerson v-if="newSelection === false" />
          <div v-else-if="newSelection === true">
            <!-- Placeholder for viewing registered people -->
            <p class="text-gray-600 text-lg">Aquí aparecerá la lista de personas registradas.</p>
            <DataTable
            :value="people"
            class="w-full border-collapse"
            paginator
            :rows="10"
            filterDisplay="menu"
            selectionMode="single"
            v-model:selection="selectedPerson"
            @update:selection="onPersonSelected"
            dataKey="id"
            tableStyle="min-width: 50rem"
            :disabled="isLoading"
          >            
            <Column header="Foto" class="p-4 border-b border-primary-200 text-second-800">
                <template #body="slotProps">
                    <Avatar
                        v-if="slotProps.data.avatar"
                        :image="slotProps.data.avatar"
                        size="large"
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
            <Column field="first_name" header="Nombre" class="p-4  border-b border-primary-200 text-second-800"></Column>
            <Column field="last_name" header="Apellido" class="p-4  border-b border-primary-200 text-second-800"></Column>
            <Column field="email" header="Email" class="p-4  border-b border-primary-200 text-second-800"></Column>
            <Column field="phone" header="Teléfono" class="p-4 border-b border-primary-200 text-second-800"></Column>
            <Column field="type_person" header="Tipo de Persona" class="p-4  border-b border-primary-200 text-second-800"></Column>
          </DataTable>
          </div>
  
          <!-- Botón Volver -->
          <button
            v-if="newSelection !== null"
            class="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
            @click="back"
          >
            <i class="material-symbols-outlined text-3xl mr-2">arrow_back</i>
            Volver
          </button>
        </div>
      </div>
    </section>
  </template>
  
<script>
    import SheduleNewPerson from "../subComponents/SheduleNewPerson.vue";
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import Avatar from "primevue/avatar";
    export default {
    name: "RegisterAssistance",
    components: {
        SheduleNewPerson,
        DataTable,
        Column,
        Avatar
    },
    props: {
        people: {
        type: Array,
        default: () => [],
        },
    },
    data() {
        return {
        newSelection: null,
        };
    },
    methods: {
        toggleSelection(value) {
            this.newSelection = value;
        },
        back() {
            this.newSelection = null;
        },
        getInitials(data) {
            return data.first_name.charAt(0) + data.last_name.charAt(0);
        },
        onPersonSelected() {
            this.$emit('personSelected', this.selectedPerson);
        },    
    },
    };
</script>

  <style scoped>
  /**** Custom styles if needed ****/
  </style>
  