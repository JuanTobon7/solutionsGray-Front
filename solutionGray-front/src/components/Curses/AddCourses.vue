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
                  <span class="text-gray-600 font-bold">Cap {{ index + 1 }}:</span>
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
            <button @click="submitCourse" type="submit" class="px-4 py-2 bg-second-500 text-white rounded-md hover:bg-second-600 transition">
              Guardar Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      course: {
        name: '',
        description: '',
        modules: [
          { title: '' }
        ]
      }
    };
  },
  methods: {
    addModule() {
      this.course.modules.push({ title: '' });
    },
    removeModule(index) {
      this.course.modules.splice(index, 1);
      this.reorderChapters();
    },
    reorderChapters() {
      this.course.modules = this.course.modules.map((module, i) => ({
        ...module,
        chapter: i + 1
      }));
    },
    submitCourse() {
      console.log('Course data:', this.course);
      // Aquí puedes enviar los datos al backend o realizar la lógica de guardado
    }
  }
};
</script>

<style scoped>
/* Añade aquí estilos adicionales si es necesario */
</style>
