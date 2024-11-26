<template>
    <section class="container w-full">
        <!-- Selector de fecha -->
        <div class="mb-4">
            <p class="text-xl font-semibold">Selecciona una fecha para ver asistencia:</p>
            <Calendar v-model="selectedDate" :dateFormat="'yy-mm-dd'" @change="filterByDate" showButtonBar />
        </div>
        
        <div class="flex flex-wrap w-full items-start justify-between gap-4 mb-10">
            <!-- Tarjeta de Información Principal -->
            <div class="bg-white shadow-lg shadow-gray-300 rounded-lg p-3 flex-grow md:flex-1 md:max-w-md">
                <div>
                    <h3 class="text-lg font-semibold">{{ course.name }}</h3>
                    <p class="text-gray-600 mb-2">{{ course.description }}</p>
                    <ProgressBar :value="progress(course)" class="mb-4" />
                    <p class="text-sm text-gray-600 mb-2">Módulos: {{ course.cuantity_chapters }}</p>
                    <p class="text-sm text-gray-600 mb-2">Estudiantes: {{ course.cuantity_students }}</p>
                </div>
            </div>

            <!-- Información Básica -->
            <div class="bg-second-50 shadow-lg shadow-gray-300 rounded-lg px-4 py-6 md:w-1/2 lg:w-3/4">
                <h3 class="text-xl font-semibold mb-3">Información Básica</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-800 mb-2">Nombre: {{ course.name }}</p>
                        <p class="text-sm text-gray-800 mb-2">Editorial: {{ course.publisher }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-800 mb-2">Descripción: {{ course.description }}</p>
                        <p class="text-sm text-gray-800 mb-2">Cantidad de Estudiantes: {{ course.cuantity_students }}</p>
                    </div>
                    <div>                        
                        <button @click="$emit('close')" class="bg-second-500 text-white px-4 py-2 rounded-md transition-transform duration-200 hover:scale-105 text-sm sm:text-base flex items-center gap-2">
                            Volver
                            <i class="material-symbols-outlined text-primary-50">arrow_back</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lista de Asistentes -->
        <div>
            <h2 class="text-xl text-second-800 font-semibold">Lista de Asistentes</h2>
            <DataView :value="filteredStudents" layout="list" :itemTemplate="itemTemplate" :paginator="true" :rows="5">
                <template #list="slotProps">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                        <div
                        v-for="(item, index) in slotProps.items"
                        :key="index"
                        class="bg-white shadow-lg rounded-lg"
                        >
                            <div class="bg-primary-50 shadow-lg shadow-primary-300 rounded-lg overflow-hidden">
                                <div class="bg-gradient-to-r from-primary-500 to-primary-800 h-20"></div>
                                    <div class="px-4 py-6 -mt-14 relative">
                                        <div class="bg-white p-6 rounded-lg shadow-lg">
                                            <div class="flex items-center space-x-4">
                                                <div class="w-16 h-16 rounded-full overflow-hidden">
                                                    <Avatar
                                                    v-if="item.avatar"
                                                    :image="item.avatar"
                                                    size="xlarge"
                                                    shape="circle"
                                                    />
                                                    <Avatar
                                                    v-else
                                                    :label="getInitials(item)"
                                                    class="bg-primary-100 flex items-center justify-center text-primary-800"
                                                    size="xlarge"
                                                    shape="circle"
                                                    />
                                                </div>
                                                <div>
                                                    <h2 class="text-xl font-bold text-gray-900">
                                                        {{ item.first_name + ' ' + item.last_name }}
                                                    </h2>
                                                    <p class="text-sm text-gray-600">{{ item.email }}</p>
                                                    <p class="text-sm text-gray-600">{{ item.phone }}</p>
                                                    <div class="flex flex-col">                            
                                                        <label for="asistencia">¿Asistió?</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </section>
</template>

<script>
import ProgressBar from 'primevue/progressbar';
import DataView from 'primevue/dataview';
import Avatar from 'primevue/avatar';
import { getStudentsCourse } from '@/apiServices/index';

export default {    
    props: {
        course: {
            type: Object,
            required: true
        }
    },
    components: {
        ProgressBar,
        DataView,
        Avatar
    },
    data() {
        return {
            students: [],
            filteredStudents: [],
            selectedDate: null // Para almacenar la fecha seleccionada
        };
    },
    methods: {
        progress(course) {
            return (course.cuantity_students / course.cuantity_chapters) * 100;
        },
        async getStudents() {
            const students = await getStudentsCourse(this.course.id);
            this.students = students;
            this.filteredStudents = students; // Inicializamos la lista filtrada con todos los estudiantes
        },
        filterByDate() {
            if (this.selectedDate) {
                // Filtrar estudiantes según la fecha seleccionada
                this.filteredStudents = this.students.filter(student => {
                    const attendanceDate = new Date(student.attendanceDate); // Asegúrate de tener un campo 'attendanceDate'
                    return attendanceDate.toISOString().split('T')[0] === this.selectedDate; // Compara solo la fecha (sin la hora)
                });
            } else {
                this.filteredStudents = this.students; // Si no hay fecha seleccionada, mostrar todos los estudiantes
            }
        },
        getInitials(item) {
            return item.first_name.charAt(0) + item.last_name.charAt(0);
        },
    },
    mounted() {
        this.getStudents();
    }
};
</script>
