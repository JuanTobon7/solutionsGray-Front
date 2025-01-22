<template>
  <section class="container mx-auto p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Mis Cursos Inscritos</h2>

    <!-- Filtros -->
    <div class="flex justify-between items-center mb-4">
      <Dropdown 
        placeholder="Filtrar por estado" 
        :options="statusOptions" 
        v-model="selectedStatus" 
        class="w-auto border" 
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
            v-if="course.status === 'En progreso'" 
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
import { getMyCourses,cancelStudentCourse } from '@/apiServices';

export default {
  components: {
    Dropdown,
    Tag,
  },
  data() {
    return {
      selectedStatus: null,
      statusOptions: ['Todos','En progreso','Aprobado','Reprobado'],
      courses: [],           // Cursos completos
      filteredCourses: [],   // Cursos filtrados
    };
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await getMyCourses();
        this.courses = this.filterDuplicateCourses(response);
        this.filterCourses();
      } catch (e) {         
        if(e.response.status === 401 && e.response.data.message === 'Token has expired'){
          this.$toast.add({severity:'error', summary:'Error', detail:'Ups algo paso, intentalo nuevamente', life: 3000});
        }
      }
    },
    filterDuplicateCourses(courses) {
      // Eliminar cursos duplicados, manteniendo el estado más relevante
      const uniqueCourses = {};

      courses.forEach(course => {
        const { course_id, status } = course;

        // Priorizar estado "Aprobado" y "En progreso"
        if (!uniqueCourses[course_id] || this.isHigherPriority(status, uniqueCourses[course_id].status)) {
          uniqueCourses[course_id] = course;
        }
      });

      return Object.values(uniqueCourses);
    },
    isHigherPriority(newStatus, currentStatus) {
      const priority = {
        'Aprobado': 3,
        'En progreso': 2,
        'Reprobado': 1,
      };

      return (priority[newStatus] || 0) > (priority[currentStatus] || 0);
    },
    filterCourses() {
      // Filtrar cursos basados en el estado seleccionado
      this.filteredCourses = this.selectedStatus
        ? this.courses.filter(course => course.status === this.selectedStatus || this.selectedStatus === 'Todos')
        : this.courses;
    },
    viewDetails(course) {
      // Acción para ver detalles del curso
    },
    async unenroll(course) {
      // Acción para cancelar inscripción del curso
      const user = this.$store.getters.user;
      const data = {
        courseId: course.teachers_courses_id,
        personId: user.id,
      };
      await cancelStudentCourse(data);
      course.status = 'Cancelado';
      this.filterCourses();
    },
    statusSeverity(status) {
      // Definir estilos según el estado
      switch (status) {
        case 'En progreso':
          return 'info';
        case 'Aprobado':
          return 'success';
        case 'Reprobado':
          return 'danger';
        case 'Cancelado':
          return 'warning';
        default:
          return 'secondary';
      }
    },
  },
  mounted() {
    this.fetchCourses();
  },
};
</script>
