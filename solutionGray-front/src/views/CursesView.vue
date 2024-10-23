<template>
  <section class="container mx-auto p-4">
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">Informe de Cursos</h2>
      <div class="flex gap-4">
        <!-- Filtros -->
        <Dropdown placeholder="Seleccionar Curso" :options="courseOptions" class="w-40" />
        <Dropdown placeholder="Seleccionar Iglesia" :options="churchOptions" class="w-40" />
        <Dropdown placeholder="Estado" :options="statusOptions" class="w-40" />
      </div>
    </div>
    
    <!-- Indicadores KPIs -->    

    <!-- Lista de Cursos usando DataView -->
    <DataView 
      :value="courses" 
      layout="grid" 
      :class="['w-full']"
      :paginator="true" 
      :rows="6"
      :sortField="sortField" 
      :sortOrder="sortOrder"
    >
      <template #header>
        <div class="w-full flex items-center gap-4">
          <Dropdown class="w-3/4" v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Ordenar por" @change="onSortChange" />
          <button @click="toogleAddCourse" class="material-symbols-outlined p-1 rounded-md bg-second-500 text-white font-semibold">add</button>
        </div>
      </template>
      <template #grid="slotProps">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          <div
            v-for="(item, index) in slotProps.items"
            :key="index"
            class="bg-white shadow-lg shadow-gray-300 rounded-lg p-4"
            >
            <div>
              <h3 class="text-lg font-semibold">{{ item.name }}</h3>
              <p class="text-gray-600">{{ item.description }}</p>
              <div class="mt-4">
                <ProgressBar :value="item.progress" class="mb-2" />
                <p class="text-sm text-gray-600">Módulos: {{ item.modules.length }}</p>
                <p class="text-sm text-gray-600">Estudiantes Inscritos: {{ item.students }}</p>
                <button @click="viewCourseDetails(item)" class="mt-4 w-full bg-second-500 text-white py-1 rounded-md">Ver Detalles</button>
              </div>
            </div>
          </div>
        </div>  
      </template>
    </DataView>

    <!-- Detalles del Curso Seleccionado (Modal) -->
    <CourseDetails v-if="selectedCourse" :course="selectedCourse" @close="selectedCourse = null" />
    <AddCourses v-if="showAddCourse" @close="toogleAddCourse" />
  </section>
</template>

<script>
import DataView from 'primevue/dataview';
import Dropdown from 'primevue/dropdown';
import ProgressBar from 'primevue/progressbar';
import CourseDetails from '@/components/Curses/CourseDetails.vue';
import AddCourses from '@/components/Curses/AddCourses.vue';

export default {
  components: {
    DataView,
    Dropdown,
    ProgressBar,
    CourseDetails,
    AddCourses,
  },
  data() {
    return {
      // Datos ficticios para simular cursos
      showAddCourse: false,
      courses: [
        {
          id: 1,
          name: 'Discipulado Nivel 1',
          description: 'Introducción al discipulado para nuevos creyentes.',
          progress: 75,
          students: 20,
          modules: [
            { name: 'Módulo 1', status: 'Completado' },
            { name: 'Módulo 2', status: 'Completado' },
            { name: 'Módulo 3', status: 'En Progreso' },
          ],
        },
        {
          id: 2,
          name: 'Teología Básica',
          description: 'Conceptos fundamentales de la teología cristiana.',
          progress: 50,
          students: 35,
          modules: [
            { name: 'Módulo 1', status: 'Completado' },
            { name: 'Módulo 2', status: 'En Progreso' },
            { name: 'Módulo 3', status: 'No Iniciado' },
          ],
        },
        {
          id: 3,
          name: 'Evangelismo Práctico',
          description: 'Estrategias y prácticas para compartir la fe.',
          progress: 25,
          students: 12,
          modules: [
            { name: 'Módulo 1', status: 'En Progreso' },
            { name: 'Módulo 2', status: 'No Iniciado' },
          ],
        },
      ],
      courseOptions: [
        { label: 'Discipulado Nivel 1', value: 'Discipulado Nivel 1' },
        { label: 'Teología Básica', value: 'Teología Básica' },
        { label: 'Evangelismo Práctico', value: 'Evangelismo Práctico' },
      ],
      churchOptions: [
        { label: 'Iglesia Central', value: 'Iglesia Central' },
        { label: 'Iglesia Norte', value: 'Iglesia Norte' },
        { label: 'Iglesia Sur', value: 'Iglesia Sur' },
      ],
      statusOptions: [
        { label: 'Completado', value: 'Completado' },
        { label: 'En Progreso', value: 'En Progreso' },
        { label: 'No Iniciado', value: 'No Iniciado' },
      ],
      sortOptions: [
        { label: 'Nombre Ascendente', value: 'name' },
        { label: 'Nombre Descendente', value: '!name' },
        { label: 'Descripción Ascendente', value: 'description' },
        { label: 'Descripción Descendente', value: '!description' },
      ],
      sortKey: null,
      sortField: null,
      sortOrder: 1,
      selectedCourse: null,
    };
  },
  computed: {
    totalStudents() {
      return this.courses.reduce((acc, course) => acc + course.students, 0);
    },
    completedModules() {
      return this.courses.reduce(
        (acc, course) => acc + course.modules.filter((mod) => mod.status === 'Completado').length,
        0
      );
    },
    averageProgress() {
      const totalProgress = this.courses.reduce((acc, course) => acc + course.progress, 0);
      return (totalProgress / this.courses.length).toFixed(2);
    },
  },
  methods: {
    toogleAddCourse() {
      this.showAddCourse = !this.showAddCourse;
    },
    onSortChange(event) {
      const value = event.value;
      this.sortOrder = value.startsWith('!') ? -1 : 1;
      this.sortField = value.replace('!', '');
    },
    viewCourseDetails(course) {
      this.selectedCourse = course;
    },
  },
};
</script>

<style scoped>
/* Estilos adicionales para mejorar la presentación */
</style>
