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
          <button @click="toggleAddCourse" class="material-symbols-outlined p-1 rounded-md bg-second-500 text-white font-semibold">add</button>
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
              <div class="w-full flex justify-end">
                <button 
                  class="relative flex items-center justify-center w-10 h-10 rounded-full border border-yellow-500 bg-gray-50 hover:bg-gray-100 transition-colors"
                  title="Editar"
                  @click="editCourse(item)"
                >
                  <span>
                    <i class="material-symbols-outlined text-yellow-500 hover:text-yellow-600">edit</i>
                  </span>
                </button>
              </div>
              <h3 class="text-lg font-semibold">{{ item.name }}</h3>
              <p class="text-gray-600">{{ item.description }}</p>
              <div class="mt-4">
                <p class="text-sm text-gray-600 mb-4">Módulos: {{ item.cuantity_modules }}</p>
                
                <!-- Botón Ver Detalles -->
                <button @click="viewCourseDetails(item)" class="mb-2 w-full bg-second-500 text-white py-1 rounded-md hover:bg-second-600 transition">Ver Detalles</button>
                
                <!-- Botón Inscribirse -->
                <button 
                  @click="toggleSheduleCourse(item)" 
                  class="mb-2 w-full bg-second-500 text-white py-1 rounded-md hover:bg-second-600 transition">
                  Inscribirse
                </button>

                <!-- Botón Asignar Profesor -->
                <button 
                  @click="toggleAssignProfessor(item)" 
                  class="w-full bg-second-500 text-white py-1 rounded-md hover:bg-second-600 transition">
                  Asignar Profesor
                </button>
              </div>
            </div>
          </div>
        </div>  
      </template>
    </DataView>

    <!-- Detalles del Curso Seleccionado (Modal) -->
    <CourseDetails v-if="showCourseDetails" :course="selectedCourse" @close="toogleCourseDetails" />
    <AddCourses v-if="showAddCourse" @updateCourses="getCourses" @close="toggleAddCourse" />
    <SheduleCourse v-if="showSheduleCourse" :course="selectedCourse" @close="toggleSheduleCourse" />
    <AssignProfessorToCourse v-if="showAssignProfessor" :course="selectedCourse" @close="toggleAssignProfessor" />
    <EditCourses v-if="showEditCourse" :course="selectedCourse" @close="toogleEditCourse" />
  </section>
</template>

<script>
import DataView from 'primevue/dataview';
import Dropdown from 'primevue/dropdown';
import CourseDetails from '@/components/Curses/CourseDetails.vue';
import AddCourses from '@/components/Curses/AddCourses.vue';
import SheduleCourse from '@/components/Curses/SheduleCourse.vue';
import AssignProfessorToCourse from '@/components/Curses/AssignProfessorToCourse.vue';
import EditCourses from '@/components/Curses/EditCourses.vue';
import { getCourses } from '@/apiServices';

export default {
  components: {
    DataView,
    Dropdown,
    CourseDetails,
    AddCourses,
    SheduleCourse,
    AssignProfessorToCourse,
    EditCourses,
  },
  data() {
    return {
      // Datos ficticios para simular cursos
      showAddCourse: false,
      showSheduleCourse: false,
      showAssignProfessor: false,
      showCourseDetails: false,
      showEditCourse: false,
      courses: [],      
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
  methods: {    
    toggleAddCourse() {
      this.showAddCourse = !this.showAddCourse;
    },
    editCourse(course) {
      this.selectedCourse = course;
      this.showEditCourse = true;
    },   
    toogleEditCourse() {
      this.showEditCourse = !this.showEditCourse;
    },
    toggleSheduleCourse(course) {
      this.selectedCourse = course;
      this.showSheduleCourse = !this.showSheduleCourse;
    },
    toggleAssignProfessor(course) {
      this.selectedCourse = course;
      this.showAssignProfessor = !this.showAssignProfessor;
    },
    toogleCourseDetails() {
      this.showCourseDetails = !this.showCourseDetails;
    },
    onSortChange(event) {
      const value = event.value;
      this.sortOrder = value.startsWith('!') ? -1 : 1;
      this.sortField = value.replace('!', '');
    },
    viewCourseDetails(course) {
      this.selectedCourse = course;
      this.showCourseDetails = true;
    },
    async getCourses() {
      try {
        this.courses = await getCourses();
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.getCourses();
  },
};
</script>

<style scoped>
/* Estilos adicionales para mejorar la presentación */
</style>
