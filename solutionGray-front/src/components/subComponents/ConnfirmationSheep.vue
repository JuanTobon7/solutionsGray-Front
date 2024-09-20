<template>
  <div class="w-full space-y-6">
    <div v-if="selectedPerson && selectedGuide" class="grid md:grid-cols-2 gap-6">
      <!-- Card for selected person -->
      <div class="bg-primary-50 shadow-lg rounded-lg overflow-hidden">
        <div class="bg-gradient-to-r from-primary-500 to-primary-800 h-28"></div>
        <div class="p-6 -mt-14 relative z-10">
          <div class="bg-white p-4 rounded-lg shadow-lg relative z-10">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full overflow-hidden">
                <Avatar
                  v-if="selectedPerson.avatar"
                  :image="selectedPerson.avatar"
                  size="xlarge"
                  shape="circle"
                />
                <Avatar
                  v-else
                  :label="getInitials(selectedPerson.first_name, selectedPerson.last_name)"
                  class="bg-primary-100 flex items-center justify-center text-primary-800"
                  size="xlarge"
                  shape="circle"
                />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">
                  {{ selectedPerson.first_name + ' ' + selectedPerson.last_name }}
                </h2>
                <p class="text-sm text-gray-600">{{ selectedPerson.email }}</p>
                <p class="text-sm text-gray-600">{{ selectedPerson.phone }}</p>
                <p class="text-sm text-gray-600">{{ selectedPerson.type_person }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card for selected guide -->
      <div class="bg-second-50 shadow-lg rounded-lg overflow-hidden">
        <div class="bg-gradient-to-r from-green-500 to-green-800 h-28"></div>
        <div class="p-6 -mt-14 relative z-10">
          <div class="bg-white p-4 rounded-lg shadow-lg relative z-10">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full overflow-hidden">
                <Avatar
                  v-if="selectedGuide.avatar"
                  :image="selectedGuide.avatar"
                  size="xlarge"
                  shape="circle"
                />
                <Avatar
                  v-else
                  :label="getInitials(selectedGuide.first_name, selectedGuide.last_name)"
                  class="bg-second-100 flex items-center justify-center text-second-800"
                  size="xlarge"
                  shape="circle"
                />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">
                  {{ selectedGuide.first_name + ' ' + selectedGuide.last_name }}
                </h2>
                <p class="text-sm text-gray-600">{{ selectedGuide.email }}</p>
                <p class="text-sm text-gray-600">{{ selectedGuide.phone }}</p>
                <p class="text-sm text-gray-600">
                  Cantidad de Ovejas a su Cargo: {{ selectedGuide.cuantity_sheeps_guide }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="text-center text-gray-500">
        Por favor, selecciona una persona y un guía espiritual.
      </p>
    </div>

    <div v-if="selectedPerson && selectedGuide" class="flex items-center justify-center w-full mt-4">
      <button @click="createSheep" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2">
        Registrar
        <span class="material-symbols-outlined">check</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Avatar from 'primevue/avatar';
import { registerSheep } from '@/apiServices';

export default {
  name: 'ConfirmationSheep',
  components: {
    Avatar,
  },
  data() {
    return {
      selectedPerson: null,
      selectedGuide: null,
    };
  },
  methods: {
    getInitials(firstName, lastName) {
      return firstName.charAt(0) + lastName.charAt(0);
    },
    async createSheep() {
      console.log('here');
      let status;
      try {
        const response = await registerSheep({
          personId: this.selectedPerson.id,
          guideId: this.selectedGuide.id,
        });
        status = response.status;
        this.message = response;
        this.$store.dispatch('flushSelectPerson');
        this.$store.dispatch('flushSelectGuide');
      } catch (error) {
        this.message = error.response.data.message || 'Ocurrió un error.';
        console.log('message: ', this.message);
        status = error.response.status;
      } finally {
        this.showResponse(status);
      }
    },
    showResponse(status) {
      let severity = 'success';
      if (status === 400) {
        severity = 'error';
      } else if (status === 401) {
        severity = 'info';
      }

      this.$toast.add({
        severity,
        summary: severity === 'success' ? 'Oveja Registrada' : 'Error',
        detail: this.message,
        life: 4000,
      });
    },
  },
  computed: {
    ...mapGetters({
      person: 'selectPerson',
      guide: 'selectGuide',
    }),
  },
  watch: {
    person(newVal) {
      this.selectedPerson = newVal;
    },
    guide(newVal) {
      this.selectedGuide = newVal;
    },
  },
  mounted() {
    this.selectedPerson = this.person;
    this.selectedGuide = this.guide;
  },
};
</script>
