<template>
  <section class="container mx-auto p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Mis Cursos Inscritos</h2>

    <!-- Filtros -->
    <div class="flex justify-between items-center mb-4">
      <Dropdown placeholder="Filtrar por estado" :options="statusOptions" v-model="selectedStatus" class="w-40" @change="filterCourses" />
    </div>

    <!-- Lista de Cursos -->
    <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(course, index) in filteredCourses" :key="index" class="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
        <h3 class="text-lg font-semibold text-second-700 mb-1">{{ course.name }}</h3>
        <p class="text-sm text-gray-600">description: {{ course.description }}</p>
        <p class="text-sm text-gray-600 mb-4">Editorial: {{course.publisher}}</p>

        <!-- Estado del Curso y Barra de Progreso -->
        <div class="mb-2 flex items-center gap-2">
          <span :class="statusClass(course.status)" class="px-2 py-1 rounded-full text-sm font-semibold">{{ course.status }}</span>
        </div>

        <ProgressBar :value="progress(course)" class="mb-4" />

        <!-- Botones de Acción -->
        <div class="mt-4 flex justify-between">
          <button @click="viewDetails(course)" class="text-blue-500 hover:underline">Ver Detalles</button>
          <button v-if="course.status === 'En curso'" @click="unenroll(course)" class="text-red-500 hover:underline">Cancelar Inscripción</button>
        </div>
      </div>
    </div>

    <!-- Sin Cursos -->
    <p v-else class="text-gray-500 text-center">No tienes cursos inscritos en esta categoría.</p>
  </section>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import ProgressBar from 'primevue/progressbar';
import { getMyCourses } from '@/apiServices'; // Asegúrate de importar correctamente

export default {
  components: {
    Dropdown,
    ProgressBar
  },
  data() {
    return {
      selectedStatus: null,
      statusOptions: [
        { label: 'Todos', value: null },
        { label: 'En curso', value: 'En curso' },
        { label: 'Completado', value: 'Completado' },
        { label: 'Cancelado', value: 'Cancelado' }
      ],
      courses: [],
      filteredCourses: []
    };
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await getMyCourses();
        this.courses = this.filterDuplicateCourses(response);
        this.filterCourses();
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    },
    filterDuplicateCourses(courses) {
      const uniqueCourses = {};

      courses.forEach(course => {
        const { course_id, status } = course;

        // Si el curso ya existe y su estado es "Completado", no reemplazar
        if (uniqueCourses[course_id]) {
          if (uniqueCourses[course_id].status !== 'Completado' && status === 'Completado') {
            uniqueCourses[course_id] = course;
          }
        } else {
          uniqueCourses[course_id] = course;
        }
      });

      return Object.values(uniqueCourses);
    },
    filterCourses() {
      if (this.selectedStatus) {
        this.filteredCourses = this.courses.filter(course => course.status === this.selectedStatus);
      } else {
        this.filteredCourses = this.courses;
      }
    },
    viewDetails(course) {
      // Acción para ver detalles del curso
      console.log('Ver detalles del curso:', course);
    },
    unenroll(course) {
      // Acción para cancelar inscripción
      console.log('Cancelar inscripción en el curso:', course);
      course.status = 'Cancelado';
      this.filterCourses();
    },
    progress(course) {
      return (course.progress/course.cuantity_chapters)*100	;
    },
    statusClass(status) {
      // Clases condicionales para el estado
      switch (status) {
        case 'En progreso':
          return 'bg-blue-100 text-blue-800';
        case 'Completado':
          return 'bg-green-200 text-green-800';
        case 'Cancelado':
          return 'bg-red-200 text-red-800';
        default:
          return 'bg-gray-200 text-gray-800';
      }
    }
  },
  mounted() {
    this.fetchCourses();
  }
};
</script>
