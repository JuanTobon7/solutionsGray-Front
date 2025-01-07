<template>
  <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="container bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Horarios del Curso</h2>
        <button @click="$emit('close')" class="text-gray-600 hover:text-gray-800 transition">
          <i class="material-symbols-outlined">close</i>
        </button>
      </div>

      <!-- Grid de Profesores -->
      <div 
        class="grid gap-6"
        :class="{'grid-cols-1': shedulesCourses.length <= 1, 'sm:grid-cols-2 md:grid-cols-3': shedulesCourses.length > 1}"
      >
        <!-- Tarjetas de Profesores -->
        <div 
          v-for="(prof, index) in shedulesCourses" 
          :key="index" 
          class="bg-white shadow-md rounded-lg p-6 cursor-pointer transition-transform duration-200 hover:-translate-y-2 hover:shadow-lg hover:bg-gray-50 flex flex-col justify-between h-full"
        >
          
          <!-- Información del Profesor -->
          <div>
            <div class="w-full flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full flex items-center">
                <Avatar
                  v-if="prof.avatar"
                  :image="prof.avatar"
                  shape="circle"
                />
                <Avatar
                  v-else
                  :label="getInitials(prof.first_name, prof.last_name)"
                  class="bg-primary-100 flex items-center justify-center text-primary-800"
                  shape="circle"                    
                />
              </div>
              <h3 class="text-lg font-semibold text-gray-800">{{ prof.first_name + ' ' + prof.last_name }}</h3>
            </div>
  
            <!-- Lista de Horarios Ordenados -->
            <div class="mt-4">
              <h4 class="text-md font-semibold text-gray-700">Horarios:</h4>
              <ul class="mt-2 space-y-2" :class="{'flex flex-col items-center': prof.schedules.length <= 1}">
                <li 
                  v-for="(schedule, idx) in prof.schedules" 
                  :key="idx" 
                  class="flex flex-col justify-between items-center bg-gray-100 p-2 rounded-md"
                >
                  <span class="text-gray-700 font-medium">{{ schedule.day_of_week }}</span>
                  <span class="text-gray-600">{{ schedule.start_time }} - {{ schedule.end_time }}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Botón Agendar Cita -->
          <div class="flex items-end justify-end mt-4">
            <button @click="sheduleCourseFun(prof)" class="bg-second-500 text-white py-2 px-4 rounded-md hover:bg-second-600 transition-colors shadow-md w-full">
              Inscribirme
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
  import { getShedulesCourses,sheduleCourses } from '@/apiServices';
  import Avatar from 'primevue/avatar';

  export default {
    components: {
      Avatar,
    },
    props: {
      course: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        shedulesCourses: [],
      };
    },
    methods: {
      async getShedulesCoursesFun() {
        try {
            const response = await getShedulesCourses(this.course.id);
            console.log('Datos obtenidos:', response);

            // Group data by `teacher_course_id`
            const groupedData = response.reduce((acc, schedule) => {
                const teacherCourseId = schedule.teacher_course_id;
                
                if (!acc[teacherCourseId]) {
                    acc[teacherCourseId] = {
                        teacherCourseId: teacherCourseId,
                        first_name: schedule.first_name,
                        last_name: schedule.last_name,
                        avatar: schedule.avatar || null, // Ensure avatar exists if available
                        schedules: []
                    };
                }

                // Add each schedule to the corresponding teacher
                acc[teacherCourseId].schedules.push({
                    day_of_week: schedule.day,
                    start_time: schedule.start_time,
                    end_time: schedule.end_time
                });

                return acc;
            }, {});

            // Convert `groupedData` to an array and sort the schedules
            this.shedulesCourses = Object.values(groupedData).map((prof) => {
                return {
                    ...prof,
                    schedules: prof.schedules.sort((a, b) => {
                        const dayOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
                        const dayComparison = dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week);

                        if (dayComparison !== 0) return dayComparison;
                        return a.start_time.localeCompare(b.start_time);
                    })
                };
            });

            this.$toast.add({ 
                severity: 'success', 
                summary: 'Horarios de Curso', 
                detail: 'Horarios cargados', 
                life: 3000 
            });
        } catch (e) {
            console.error('Error al obtener horarios:', e);
            if (e.response?.status === 400) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Horarios de Curso',
                    detail: 'No se encontraron horarios de atención para este curso',
                    life: 3000
                });
            }
        }
    },

      async sheduleCourseFun(prof) {
        try{
          console.log('Inscribiendo al curso:', prof);
          const response = await sheduleCourses({teacherCourseId:prof.teacherCourseId});
          this.$toast.add({
            severity: 'success',
            summary: response.message,
            detail: 'Inscripción exitosa',
            life: 3000
          });
        }catch(e){
          console.error('Error al inscribirme:', e);
          this.$toast.add({
            severity: 'error',
            summary: 'Inscripción a Curso',
            detail: 'No se pudo inscribir al curso',
            life: 3000
          });
        }
      },
      getInitials(first_name, last_name) {
        return first_name.charAt(0) + last_name.charAt(0);
      }
    },
    async mounted() {
      await this.getShedulesCoursesFun();
    }
  };
</script>
