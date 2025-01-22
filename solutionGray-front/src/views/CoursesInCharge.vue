<template>
    <section class="container">
      <h2 class="text-2xl font-semibold" v-if="!showInfoCourse">Cursos a Cargo</h2>
  
      <!-- Filtros -->
      <div v-if="lengthCourses && !showInfoCourse">       
  
        <!-- DataView de Cursos -->
        <DataView 
          :value="filteredCourses" 
          layout="grid"
          :paginator="true"
          :rows="6"
          :sortField="sortField"
          :sortOrder="sortOrder"
          class="w-full"
        >
          <template #header>
            <!-- Filtro de Búsqueda -->
            <div class="w-full flex items-center gap-4">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Buscar por nombre o descripción" 
                class="w-full border p-2 rounded-sm"
                @input="filterCourses"
              />
              <Dropdown 
                placeholder="Filtrar por Estado" 
                :options="statusOptions" 
                option-label="label"
                v-model="selectedStatus"
                class="w-auto border" 
                @change="filterCourses"
            />              
            </div>
          </template>
  
          <!-- Cursos Grid -->
          <template #grid="slotProps">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              <div 
                v-for="(item, index) in slotProps.items" 
                :key="index"
                @click="showCourse(item)"
                class="bg-white shadow-lg shadow-gray-300 rounded-lg p-4 transition-transform duration-200 hover:-translate-y-2 cursor-pointer"
              >
                <div>
                  <h3 class="text-lg font-semibold">{{ item.name }}</h3>
                  <p class="text-gray-600 mb-2">{{ item.description }}</p>                                
                  <p class="text-sm text-gray-600 mb-2">Módulos: {{ item.cuantity_chapters }}</p>
                  <p class="text-sm text-gray-600 mb-2">Estudiantes: {{ item.cuantity_students }}</p>
                  <div class="mb-2 flex items-center gap-2">
                    <Tag 
                      :value="item.status_course" 
                      :severity="statusSeverity(item.status_course)" 
                      rounded 
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
  
      <!-- Sin Cursos -->
      <div v-else-if="!lengthCourses && !showInfoCourse">
        <p>No hay cursos a cargo</p>
      </div>
  
      <!-- Detalle del Curso -->
      <InfoCourseInCharge 
        v-if="showInfoCourse" 
        :course="selectedCourse" 
        @close="showInfoCourse = false" 
      /> 
    </section>
  </template>
  
  <script>
  import { getCoursesInCharge } from '@/apiServices/index';
  import Dropdown from 'primevue/dropdown';
  import DataView from 'primevue/dataview';
  import Tag from 'primevue/tag';
  import InfoCourseInCharge from '@/components/Curses/InfoCourseInCharge.vue';
  
  export default {
    components: {
      Dropdown,
      DataView,
      Tag,
      InfoCourseInCharge,
    },
    data() {
      return {
        courses: [],
        filteredCourses: [],
        selectedCourse: null,
        showInfoCourse: false,
        searchQuery: '',
        selectedStatus: null,
        statusOptions: [
          { label: 'Todos', value: null },
          { label: 'En progreso', value: 'En progreso' },
          { label: 'Terminado', value: 'Terminado' },
        ],
        sortField: null,
        sortOrder: null,
      };
    },
    computed: {
      lengthCourses() {
        return this.courses.length;
      },
    },
    methods: {
      async getCoursesInChargeFun() {
        try {
          const response = await getCoursesInCharge();
          this.courses = response;
          this.filterCourses();
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
      filterCourses() {
        this.filteredCourses = this.courses.filter((course) => {
          const matchesStatus =
            !this.selectedStatus || course.status_course === this.selectedStatus.value || this.selectedStatus.value === null;
          const matchesSearch =
            !this.searchQuery ||
            course.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(this.searchQuery.toLowerCase());
  
          return matchesStatus && matchesSearch;
        });
      },
      showCourse(course) {
        this.selectedCourse = course;
        this.showInfoCourse = true;
      },
      statusSeverity(status) {
        switch (status) {
          case 'En progreso':
            return 'secondary';
          case 'Terminado':
            return 'success';
          default:
            return 'warning';
        }
      },
    },
    mounted() {
      this.getCoursesInChargeFun();
    },
  };
  </script>
  