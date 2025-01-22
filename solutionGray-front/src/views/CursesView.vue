<template>
  <section class="container mx-auto p-4">
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">Informe de Cursos</h2>     
    </div>

    <!-- Lista de Cursos usando DataView -->
    <DataView 
      :value="filteredCourses" 
      layout="grid" 
      :class="['w-full']"
      :paginator="true" 
      :rows="6"
    >
      <template #header>
        <div class="w-full flex items-center gap-4 px-2">
          <!-- Input de búsqueda -->
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por nombre o descripción" 
            class="w-full p-2 border border-gray-200 focus:border-green-300 rounded-md"
          />         
          <button v-if="$hasRole('SuperAdmin')" @click="toggleAddCourse" class="material-symbols-outlined p-1 rounded-md bg-second-500 text-white font-semibold">
            add
          </button>
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
                  v-if="$hasRole('SuperAdmin')"
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
                  Ver Horarios
                </button>

                <!-- Botón Asignar Profesor -->
                <button 
                  v-if="$hasRole('SuperAdmin')"
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

    <!-- Modales y Componentes -->
    <CourseDetails v-if="showCourseDetails" :course="selectedCourse" @close="toogleCourseDetails" />
    <AddCourses v-if="showAddCourse" @updateCourses="getCourses" @close="toggleAddCourse" />
    <SheduleCourse v-if="showSheduleCourse" :course="selectedCourse" @close="toggleSheduleCourse" />
    <AssignProfessorToCourse v-if="showAssignProfessor" :course="selectedCourse" @close="toggleAssignProfessor" />
    <EditCourses v-if="showEditCourse" :course="selectedCourse" @close="toogleEditCourse" />
  </section>
</template>

<script>
import DataView from 'primevue/dataview';
import CourseDetails from '@/components/Curses/CourseDetails.vue';
import AddCourses from '@/components/Curses/AddCourses.vue';
import SheduleCourse from '@/components/Curses/SheduleCourse.vue';
import AssignProfessorToCourse from '@/components/Curses/AssignProfessorToCourse.vue';
import EditCourses from '@/components/Curses/EditCourses.vue';
import { getCourses } from '@/apiServices';

export default {
  components: {
    DataView,
    CourseDetails,
    AddCourses,
    SheduleCourse,
    AssignProfessorToCourse,
    EditCourses,
  },
  data() {
    return {
      // Estados de la interfaz
      showAddCourse: false,
      showSheduleCourse: false,
      showAssignProfessor: false,
      showCourseDetails: false,
      showEditCourse: false,
      // Datos
      courses: [],
      searchQuery: '',
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
    // Filtrar cursos dinámicamente en base a la búsqueda
    filteredCourses() {
      if (!this.searchQuery) return this.courses;
      const query = this.searchQuery.toLowerCase();
      return this.courses.filter(course => 
        course.name.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query)
      );
    },
  },
  methods: {    
    toggleAddCourse() {
      this.showAddCourse = !this.showAddCourse;
    },
    editCourse(course) {
      this.selectedCourse = course;
      this.showEditCourse = true;
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
    viewCourseDetails(course) {
      this.selectedCourse = course;
      this.showCourseDetails = true;
    },
    async getCourses() {
      try {
        this.courses = await getCourses();
      } catch (e) {
        if(e.response.status === 401 && e.response.data.message === 'Token has expired') {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ups, inténtalo de nuevo',
            life: 3000,
          });
        }
      }
    },
  },
  mounted() {
    this.getCourses();
  },
};
</script>
