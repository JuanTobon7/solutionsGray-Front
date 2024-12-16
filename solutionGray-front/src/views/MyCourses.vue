<template>
  <section class="container mx-auto p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Mis Cursos Inscritos</h2>

    <!-- Filtros -->
    <div class="flex justify-between items-center mb-4">
      <Dropdown 
        placeholder="Filtrar por estado" 
        :options="statusOptions" 
        v-model="selectedStatus" 
        class="w-40" 
        @change="filterCourses" 
      />
    </div>

    <!-- Lista de Cursos -->
    <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(course, index) in filteredCourses" 
        :key="index" 
        class="border border-gray-300 rounded-lg p-4 bg-white shadow-md"
      >
        <h3 class="text-lg font-semibold text-second-700 mb-1">{{ course.name }}</h3>
        <p class="text-sm text-gray-600">Descripción: {{ course.description }}</p>
        <p class="text-sm text-gray-600 mb-4">Editorial: {{ course.publisher }}</p>

        <!-- Estado del Curso con Tag -->
        <div class="mb-2 flex items-center gap-2">
          <Tag 
            :value="course.status" 
            :severity="statusSeverity(course.status)" 
            rounded 
          />
        </div>

        <!-- Botones de Acción -->
        <div class="mt-4 flex justify-between">
          <button 
            @click="viewDetails(course)" 
            class="text-blue-500 hover:underline"
          >
            Ver Detalles
          </button>
          <button 
            v-if="course.status === 'En curso'" 
            @click="unenroll(course)" 
            class="text-red-500 hover:underline"
          >
            Cancelar Inscripción
          </button>
        </div>
      </div>
    </div>

    <!-- Sin Cursos -->
    <p v-else class="text-gray-500 text-center">No tienes cursos inscritos en esta categoría.</p>
  </section>
</template>
<script>
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import { getMyCourses } from '@/apiServices'; // Asegúrate de importar correctamente

export default {
  components: {
    Dropdown,
    Tag,
  },
  data() {
    return {
      selectedStatus: null,
      statusOptions: [
        { label: 'Todos', value: null },
        { label: 'En progreso', value: 'En progreso' },
        { label: 'Aprobado', value: 'Aprobado' },
        { label: 'Reprobado', value: 'Reprobado' },
      ],
      courses: [],
      filteredCourses: [],
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
    statusSeverity(status) {
      // Devuelve el nivel de severidad para el Tag
      switch (status) {
        case 'En progreso':
          return 'info';
        case 'Aprobado':
          return 'success';
        case 'Reprobado':
          return 'danger';
        default:
          return 'warning';
      }
    },
  },
  mounted() {
    this.fetchCourses();
  },
};
</script>
