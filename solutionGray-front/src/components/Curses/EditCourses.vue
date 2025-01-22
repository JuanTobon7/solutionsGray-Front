<template>
    <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
        <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-second-600">Editar Curso: <span class="text-gray-800">{{ course.name }}</span></h2>
            <button @click="$emit('close')" class="material-symbols-outlined text-gray-500 hover:text-gray-700 transition">
              close
            </button>
          </div>
          
          <div>
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
    
              <!-- Capítulos del curso -->
              <div class="mb-4">
                <h3 class="text-xl font-semibold text-second-700 mb-2">Capítulos del Curso ({{ chapters.length }})</h3>
                <ul class="space-y-2">
                  <li
                    v-for="(chapter, index) in chapters"
                    :key="index"
                    class="border rounded-md p-3 bg-second-50 flex justify-between items-center"
                  >
                    <div>
                      <p class="text-lg font-medium text-second-800">
                        Capítulo {{ chapter.numb_chapter }}: {{ chapter.name }}
                        <span v-if="chapter.edited" class="text-sm text-yellow-600 ml-2">(Editado)</span>
                      </p>
                    </div>
                    <div class="flex gap-2">
                      <button @click="editChapter(index)" class="text-second-500 hover:text-second-700 transition">
                        <i class="material-symbols-outlined">edit</i>
                      </button>
                      <button @click="removeChapter(index)" class="text-red-500 hover:text-red-700 transition">
                        <i class="material-symbols-outlined">delete</i>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
    
              <button
                type="button"
                @click="addChapter"
                class="mb-4 w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 rounded-md text-gray-600 hover:bg-gray-50 transition"
              >
                <i class="material-symbols-outlined mr-2">add</i>
                Añadir Capítulo
              </button>
    
              <!-- Botones de acción -->
              <div class="flex justify-end gap-4 mt-6">
                <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">
                  Cancelar
                </button>
                <button type="submit" class="px-4 py-2 bg-second-500 text-white rounded-md hover:bg-second-600 transition">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </template>
    
  <script>
  import { getChaptersCourse } from '@/apiServices';
  
  export default {
    props: ['course'],
    data() {
      return {
        chapters: [],
        originalCourse: JSON.parse(JSON.stringify(this.course)) // Copia para detectar cambios
      };
    },
    methods: {
      async getChaptersCourse() {
        const response = await getChaptersCourse(this.course.id);
        this.chapters = response.map(chapter => ({ ...chapter, edited: false }));
      },
      addChapter() {
        const newChapter = {
          numb_chapter: this.chapters.length + 1,
          name: '',
          edited: true
        };
        this.chapters.push(newChapter);
      },
      editChapter(index) {
        const chapterName = prompt('Edita el nombre del capítulo:', this.chapters[index].name);
        if (chapterName !== null) {
          this.chapters[index].name = chapterName;
          this.chapters[index].edited = true;
        }
      },
      removeChapter(index) {
        this.chapters.splice(index, 1);
        this.reorderChapters(index);
      },
      reorderChapters(startIndex) {
        // Reordenar solo los capítulos que vienen después del índice eliminado
        for (let i = startIndex; i < this.chapters.length; i++) {
          this.chapters[i].numb_chapter = i + 1;
          this.chapters[i].edited = true; // Marcar como editado para reflejar el cambio en el orden
        }
      },
      detectChanges() {
        const changes = {};
  
        // Comparar campos básicos
        if (this.course.name !== this.originalCourse.name) {
          changes.name = { old: this.originalCourse.name, new: this.course.name };
        }
        if (this.course.publisher !== this.originalCourse.publisher) {
          changes.publisher = { old: this.originalCourse.publisher, new: this.course.publisher };
        }
        if (this.course.description !== this.originalCourse.description) {
          changes.description = { old: this.originalCourse.description, new: this.course.description };
        }
  
        // Comparar capítulos
        const chapterChanges = this.chapters.filter(ch => ch.edited).map(ch => ({
          numb_chapter: ch.numb_chapter,
          name: ch.name
        }));
  
        if (chapterChanges.length > 0) {
          changes.chapters = chapterChanges;
        }
  
        return changes;
      },
      submitCourse() {
        const changes = this.detectChanges();
        // Enviar cambios al componente padre
        this.$emit('updateCourse', { course: this.course, changes });
  
        // Actualizar la copia original para futuras ediciones
        this.originalCourse = JSON.parse(JSON.stringify(this.course));
      }
    },
    mounted() {
      this.getChaptersCourse();
    }
  };
  </script>
    
  <style scoped>
  /* Estilos adicionales */
  .material-symbols-outlined {
    font-size: 24px;
  }
  </style>
  