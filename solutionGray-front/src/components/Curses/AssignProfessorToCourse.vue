<template>
  <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="container max-w-3xl bg-white rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto">
      <div class="flex w-full items-center justify-between">
        <h2 class="text-2xl font-semibold mb-6">Asignar Profesor a Curso {{ course.name }}</h2>
        <button @click="$emit('close')" class="text-gray-600 hover:text-gray-800 transition">
          <i class="material-symbols-outlined">close</i>
        </button>
      </div>

      <!-- Mostrar Curso y Seleccionar Profesor -->
      <div class="flex flex-col gap-4 mb-6">
        <p class="text-lg font-semibold text-gray-800">Curso: {{ course?.label || "Selecciona un curso" }}</p>
        
        <div class="flex flex-col mb-4">
          <label for="person" class="text-gray-600 mb-2 font-semibold">Seleccionar un Profesor</label>
          <Dropdown
            v-model="professorSelected"
            :options="people"
            optionLabel="name"
            placeholder="Selecciona un Profesor"
            class="w-full"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center">
                  <Avatar
                    v-if="slotProps.value.avatar"
                    :image="slotProps.value.avatar"
                    shape="circle"
                  />
                  <Avatar
                    v-else
                    :label="getInitials(slotProps.value)"
                    class="bg-primary-100 flex items-center justify-center text-primary-800"
                    shape="circle"
                  />
                </div>
                <div>{{ slotProps.value.first_name + ' ' + slotProps.value.last_name }} - CC: {{ slotProps.value.cc }} - Teléfono: {{ slotProps.value.phone }}</div>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>

            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center">
                  <Avatar
                    v-if="slotProps.option.avatar"
                    :image="slotProps.option.avatar"
                    shape="circle"
                  />
                  <Avatar
                    v-else
                    :label="getInitials(slotProps.option)"
                    class="bg-primary-100 flex items-center justify-center text-primary-800"
                    shape="circle"
                  />
                </div>
                <div>{{ slotProps.option.first_name + ' ' + slotProps.option.last_name }} - CC: {{ slotProps.option.cc }} - Teléfono: {{ slotProps.option.phone }}</div>
              </div>
            </template>
          </Dropdown>
        </div>

        <p v-if="professorSelected" class="text-md font-semibold text-green-600">
          Profesor seleccionado: {{ professorSelected.name }}
        </p>
      </div>

      <!-- Configurar Horarios -->
      <div class="mb-4">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-lg font-semibold text-gray-700">Configurar Horarios</h3>
          <button @click="addSchedule" class="material-symbols-outlined p-1 rounded-md bg-second-500 text-white font-semibold">add</button>
        </div>
        <div v-for="(schedule, index) in schedules" :key="index" class="flex gap-4 mb-2 items-center">
          <select v-model="schedule.day" class="p-2 border rounded-md w-full md:w-1/3">
            <option disabled value="">Día</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
          <label class="md:col-span-1">
            Hora de Inicio:
            <input type="time" v-model="schedule.startTime" class="p-2 border rounded-md w-full" />
          </label>
          <label class="md:col-span-1">
            Hora de Fin:
            <input type="time" v-model="schedule.endTime" class="p-2 border rounded-md w-full" />
          </label>
          <button @click="removeSchedule(index)" class="text-red-500 hover:text-red-700 transition">Eliminar</button>
        </div>
      </div>

      <!-- Guardar Asignación -->
      <div class="mt-6 flex justify-end">
        <button @click="saveAssignment" class="bg-second-500 text-white py-2 px-4 rounded-md hover:bg-second-600 transition">Guardar Asignación</button>
      </div>

    </div>
  </section>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import { getPeople, assignCourses,saveSheduleCourses } from '@/apiServices';

export default {
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  components: {
    Dropdown,
    Avatar
  },
  data() {
    return {
      people: [],
      professorSelected: null,
      schedules: [],
    };
  },
  methods: {
    addSchedule() {
      this.schedules.push({ day: '', startTime: '', endTime: '' });
    },
    removeSchedule(index) {
      this.schedules.splice(index, 1);
    },    
    async saveAssignment() {
      try {
        if (!this.course || !this.professorSelected || this.schedules.length === 0) {
          alert('Por favor, complete todos los campos');
          return;
        }

        const assignmentData = {
          courseId: this.course.id,
          teacherId: this.professorSelected.id,
        };

        let response = await assignCourses(assignmentData);
        this.$toast.add({
          severity: 'success',
          summary: 'Asignación Exitosa',
          detail: response.message,
          life: 3000
        });
        // Guardar los horarios
        response = await saveSheduleCourses({teacherCourseId:response.id, schedules:this.schedules});

        this.$toast.add({
          severity: 'success',
          summary: 'Asignación Exitosa',
          detail: response.message,
          life: 3000
        });
        this.resetForm();
      } catch (e) {
        if (e.response?.status === 400) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en los datos ingresados',
            life: 3000
          });
        }
      }
    },
    resetForm() {
      this.professorSelected = null;
      this.schedules = [];
    },
    async getPeopleFun() {
      try {
        const response = await getPeople();        
        this.people = response.filter(person => person.type_person === 'Usuario');
      } catch (e) {
        console.error(e);
      }
    },
    getInitials(person) {
      return person.first_name.charAt(0) + person.last_name.charAt(0);
    }
  },
  async mounted() {
    await this.getPeopleFun();
  }
};
</script>

