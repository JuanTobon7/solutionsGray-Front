<template>
  <section class="min-h-screen container w-full">
    <div class="mb-6">
      <p class="text-primary-900 text-xl sm:text-3xl font-serif">
        <strong>Y el Señor añadía cada día al número de ellos los que iban siendo salvos. Hechos 2:47</strong>
      </p>
    </div>
    <div class="p-4 shadow-md bg-second-50 shadow-second-600 rounded-md h-auto">
      <div class="w-full">
        <!-- Church Info Header -->
        <div class="flex flex-col sm:flex-row items-center gap-3 text-3xl sm:text-5xl mb-4">
          <h1 class="text-second-800"><strong>Iglesia {{ churchName }}</strong></h1>
          <i class="material-symbols-outlined text-second-500 text-3xl sm:text-5xl">church</i>
        </div>
        <h2 class="text-second-800 text-xl sm:text-2xl mb-2">
          <strong>Estadísticas e Información de Iglesia</strong>
        </h2>

        <!-- Centered Histogram -->
        <div class="w-full flex justify-center items-center">
          <div class="w-full lg:w-[60%] flex justify-center items-center">
            <HistogramComponent class="mb-2"/>
          </div>
        </div>

        <!-- Church Information -->
        <div class="flex flex-col gap-4">
          <h3 class="text-second-900 text-lg sm:text-2xl">
            <strong>Información de la Iglesia</strong>
          </h3>
          <div class="flex flex-col gap-2">
            <div class="flex flex-col sm:flex-row gap-2">
              <span class="text-second-900 text-base sm:text-lg"><strong>Nombre:</strong></span>
              <span class="text-second-700 text-base sm:text-lg">{{ churchName }}</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-2">
              <span class="text-second-900 text-base sm:text-lg"><strong>Ubicación:</strong></span>
              <span class="text-second-700 text-base sm:text-lg">{{ address }}, Villavicencio, {{ stateid }}, {{ countryid }}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="text-second-900 text-base sm:text-lg"><strong>Más Información de Crecimiento:</strong></span>
              <span class="text-second-700 text-base sm:text-lg">Cantidad de siervos: {{ quantityservants }}</span>
              <span class="text-second-700 text-base sm:text-lg">Cantidad de grupos: {{ quantitygroups }}</span>
              <span class="text-second-700 text-base sm:text-lg">Cantidad de ovejas: {{ quantitysheeps }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getChurchInfo } from '@/apiServices/index';
import HistogramComponent from '@/components/HistogramComponent.vue';

export default {
  name: 'HomeView',
  components: {
    HistogramComponent,
  },
  data() {
    return {
      churchName: null,
      countryid: null,
      stateid: null,
      address: null,
      quantityservants: null,
      quantitysheeps: null,
      quantitygroups: null,
    };
  },
  methods: {
    async getChurch() {
      try {
        const response = await getChurchInfo();
        this.churchName = response.name;
        this.countryid = response.countryid;
        this.stateid = response.stateid;
        this.address = response.address;
        this.quantityservants = response.quantityservants;
        this.quantitysheeps = response.quantitysheeps;
        this.quantitygroups = response.quantitygroups;
      } catch (error) {
        console.error('Error fetching church info:', error);
      }
    },
  },
  mounted() {
    this.getChurch();
  },
};
</script>

<style scoped>
/* Ensure histogram takes the center stage */
.histogram-container { 
  @apply flex justify-center items-center w-full h-full;
}
</style>
