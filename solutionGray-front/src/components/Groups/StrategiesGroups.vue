<template>
  <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="container h-[95vh] w-full flex items-center justify-center sm:px-6">
      <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[90%] flex flex-col max-h-full overflow-y-auto">
        <h2 class="text-xl text-second-900 font-bold mb-4">Agregar Persona</h2>
          <div class="flex flex-col gap-2">
            <!-- Dropdown para seleccionar nueva persona -->
            <label for="newIntegrant" class="text-sm text-gray-600">Selecciona la persona nueva para el grupo:</label>
            <Dropdown
              id="newIntegrant"
              v-model="selectedPerson"
              :options="people"
              optionLabel="name"
              placeholder="Selecciona una persona"
              class="w-full"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center gap-2">
                  <Avatar
                    v-if="slotProps.value.avatar"
                    :image="slotProps.value.avatar"
                    shape="circle"
                  />
                  <Avatar
                    v-else
                    :label="getInitials(slotProps.value)"
                    class="bg-primary-100 text-primary-800"
                    shape="circle"
                  />
                  <div>{{ slotProps.value.first_name + ' ' + slotProps.value.last_name }} - CC: {{ slotProps.value.cc }} - Phone: {{ slotProps.value.phone }}</div>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <Avatar
                    v-if="slotProps.option.avatar"
                    :image="slotProps.option.avatar"
                    shape="circle"
                  />
                  <Avatar
                    v-else
                    :label="getInitials(slotProps.option)"
                    class="bg-primary-100 text-primary-800"
                    shape="circle"
                  />
                  <div>{{ slotProps.option.first_name + ' ' + slotProps.option.last_name }} - CC: {{ slotProps.option.cc }} - Phone: {{ slotProps.option.phone }}</div>
                </div>
              </template>
            </Dropdown>

            <!-- Dropdown para seleccionar líder -->
            <label for="leading" class="text-sm text-gray-600">
              Selecciona la persona que liderará a {{ name }}:
            </label>
            <Dropdown
              id="leading"
              v-model="selectedLeading"
              :options="integrants"
              optionLabel="name"
              placeholder="Selecciona un líder"
              :disabled="!selectedPerson || !integrants"
              class="w-full"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center gap-2">
                  <Avatar
                    v-if="slotProps.value.avatar"
                    :image="slotProps.value.avatar"
                    shape="circle"
                  />
                  <Avatar
                    v-else
                    :label="getInitials(slotProps.value)"
                    class="bg-primary-100 text-primary-800"
                    shape="circle"
                  />
                  <div>{{ slotProps.value.first_name + ' ' + slotProps.value.last_name }} - CC: {{ slotProps.value.cc }} - Phone: {{ slotProps.value.phone }}</div>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <Avatar
                    v-if="slotProps.option.avatar"
                    :image="slotProps.option.avatar"
                    shape="circle"
                  />
                  <Avatar
                    v-else
                    :label="getInitials(slotProps.option)"
                    class="bg-primary-100 text-primary-800"
                    shape="circle"
                  />
                  <div>{{ slotProps.option.first_name + ' ' + slotProps.option.last_name }} - CC: {{ slotProps.option.cc }} - Phone: {{ slotProps.option.phone }}</div>
                </div>
              </template>
            </Dropdown>
            <label for="rolName" class="text-sm text-gray-600">Escribe el rol que ocupará:</label>
            <textarea 
              id="rolName" 
              type="text" 
              v-model="rolName" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-second-500"
              placeholder="Ej. Líder de Oración"
              rows="3"
              required>
              </textarea>
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-2 justify-end">
            <button
              type="button"
              @click="$emit('close')"
              class="bg-gray-400 text-white py-1 px-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              @click="addPersonStrategy"
              class="bg-second-500 text-white py-1 px-2 rounded hover:bg-second-600"
            >
              Agregar
            </button>
          </div>        
      </div>
    </div>
  </section>
</template>

<script>
import { getPeople , addPersonStrategy} from "@/apiServices";
import Dropdown from "primevue/dropdown";
import Avatar from "primevue/avatar";

export default {
  props: {
    integrantsProp: {
      type: Array      
    },
    groupId: {
      type: String,
      required: true
    }
  },
  components: {
    Dropdown,
    Avatar,
  },
  data() {
    return {
      people: [],
      rolName: '',
      integrants: [],
      selectedPerson: null,
      selectedLeading: null,
    };
  },
  computed: {
    name(){
      return this.selectedPerson ? this.selectedPerson.first_name + ' ' + this.selectedPerson.last_name : '';
    }
  },
  methods: {
    async getPeople() {
      try {
        this.people = await getPeople();
      } catch (e) {
        if (e.response?.status !== 401 && e.response?.data?.message === "Token has expired") {
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Inténtalo de nuevo",
            life: 3000,
          });
        }
      }
    },
    getInitials(person) {
      if (!person || !person.first_name || !person.last_name) return "";
      return person.first_name[0] + person.last_name[0];
    },
    async addPersonStrategy() {
      try{
        console.log(this.selectedPerson, this.rolName, this.selectedLeading);
        if(!this.selectedPerson  || !this.rolName){
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Todos los campos son obligatorios",
            life: 3000,
          });
          return;
        }
        const newIntegrant = {
          servantId: this.selectedPerson.id,
          rol: this.rolName,
          leaderId: this.selectedLeading.id,
        };
        await addPersonStrategy(newIntegrant);
        this.$toast.add({
          severity: "success",
          summary: "Éxito",
          detail: "Persona agregada correctamente",
          life: 3000,
        });        
      }catch(e){
        if (e.response?.status !== 401 && e.response?.data?.message === "Token has expired") {
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Inténtalo de nuevo",
            life: 3000,
          });
        }
      }
    },
  },
  mounted() {
    this.integrants = this.integrantsProp || [];
    console.log('integrants',this.integrants);
    this.getPeople();
  },
};
</script>
