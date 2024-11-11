<template>
  <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
      <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Curso</h2>

        <!-- Formulario para la creación del curso -->
        <form @submit.prevent="submitCourse">
          <!-- Nombre del curso -->
          <div class="mb-4">
            <label for="courseName" class="block text-gray-600 font-semibold mb-2">Nombre del Curso</label>
            <input
              type="text"
              id="courseName"
              v-model="course.name"
              placeholder="Introduce el nombre del curso"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-second-500"
              required
            />
          </div>

          <div class="mb-4">
            <label for="coursePublisher" class="block text-gray-600 font-semibold mb-2">Nombre de Editorial</label>
            <input
              type="text"
              id="coursePublisher"
              v-model="course.publisher"
              placeholder="Introduce el nombre de la editorial"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-second-500"
              required
            />
          </div>

          <!-- Descripción del curso -->
          <div class="mb-4">
            <label for="courseDescription" class="block text-gray-600 font-semibold mb-2">Descripción del Curso</label>
            <textarea
              id="courseDescription"
              v-model="course.description"
              placeholder="Introduce una breve descripción del curso"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-second-500"
              rows="4"
            ></textarea>
          </div>

          <!-- Módulos del curso -->
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Módulos del Curso</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">                
              <div v-for="(module, index) in course.modules" :key="index" class="flex items-center gap-2">
                  <!-- Número del capítulo -->
                  <span class="text-gray-600 font-bold">Cap {{ module.numbChapter }}:</span>
                  <input
                    type="text"
                    v-model="module.title"
                    placeholder="Título del módulo"
                    class="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-second-500"
                    required
                  />
                  <button type="button" @click="removeModule(index)" class="text-red-600 hover:text-red-800 transition">
                      <i class="pi pi-times"></i>
                  </button>
              </div>
          </div>

          <button
            type="button"
            @click="addModule"
            class="mb-4 w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition"
          >
            <i class="pi pi-plus mr-2"></i>
            Añadir Módulo ó Capítulo
          </button>

          <!-- Botones de acción -->
          <div class="flex justify-end gap-4 mt-6">
            <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">
              Cancelar
            </button>
            <button type="submit" class="px-4 py-2 bg-second-500 text-white rounded-md hover:bg-second-600 transition">
              Guardar Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { saveCourses, saveChaptersCourse } from '@/apiServices/index';

export default {
  data() {
    return {
      course: {
        name: '',
        description: '',
        publisher: '',
        modules: [
          { title: '', numbChapter: 1 }
        ]
      }
    };
  },
  methods: {
    addModule() {
      this.course.modules.push({ title: '', numbChapter: this.course.modules.length + 1 });
    },
    removeModule(index) {
      this.course.modules.splice(index, 1);
      this.reorderChapters();
    },
    reorderChapters() {
      this.course.modules = this.course.modules.map((module, i) => ({
        ...module,
        numbChapter: i + 1
      }));
    },
    async submitCourse() {
      try {
        if(this.course.name === '' || this.course.description === '' || this.course.publisher === '') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Debes completar todos los campos.', life: 3000 });
          return;
        }
        if(this.course.modules.length === 0) {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Debes añadir al menos un módulo al curso.', life: 3000 });
          return;
        }
        let response = await saveCourses(this.course);
        this.$toast.add({ severity: 'success', summary: 'Curso Creado', detail: response.message, life: 3000 });
        const course = response;
        response = await saveChaptersCourse({ courseId: course.data.id, chapters: this.course.modules });
        this.$toast.add({ severity: 'success', summary: 'Capitulos Asociados', detail: response.message, life: 3000 });
        this.$emit('updateCourses');
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style scoped>
/* Añade aquí estilos adicionales si es necesario */
</style>
