<template>
    <section class="container w-full">
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

        <div>
            <h2 class="text-xl text-second-800 font-semibold">Lista de asistentes</h2>

            <!-- Paginación por fecha -->
            <div class="mb-4 flex items-center gap-8">
                <div class="flex items-center justify-between gap-2">                    
                    <div class="flex items-center ">                 
                        <label for="date" class="text-sm text-gray-600">Seleccione la fecha para ver los asistentes:</label>
                        <Dropdown for="date" v-model="selectedDate" :options="dateOptions" option-label="label" placeholder="Seleccione una fecha" @change="filterByDate" required
                        class="w-full min-w-[200px] max-w-[300px] shadow appearance-none border border-second-100 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <button @click="newPage" class="cursor-pointer flex items-center gap-2">
                        Agregar Nueva Hoja Asistencia
                        <i class="material-symbols-outlined bg-second-500 hover:bg-second-600 text-white px-1 py-0 rounded-md">add</i>
                    </button>
                </div>
                <div class="flex items-center">                 
                    <label for="date" class="text-sm text-gray-600">Seleccione el capitulo visto visto:</label>
                    <Dropdown for="date" v-model="selectedChapter" :options="chapters" option-label="name" placeholder="Seleccione una capitulo" required
                    class="w-full min-w-[200px] max-w-[300px] shadow appearance-none border border-second-100 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>                    
        </div>    
            <!-- Lista de Estudiantes por fecha -->
            <DataView :value="students" layout="list"  :paginator="true" :rows="5">
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
                                            <!-- Avatar o iniciales de la persona -->
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
                                            <!-- Información de la persona -->
                                            <div>
                                                <h2 class="text-xl font-bold text-gray-900">
                                                {{ item.first_name + ' ' + item.last_name }}
                                                </h2>
                                                <p class="text-sm text-gray-600">{{ item.email }}</p>
                                                <p class="text-sm text-gray-600">{{ item.phone }}</p>
                                                <div class="flex flex-col">                            
                                                    <label for="asistencia">¿Asistió?</label>
                                                    <InputSwitch 
                                                    id="asistencia"
                                                    v-model="item.isAttend"  
                                                    :checked="isAttend(item)"
                                                    @change="onAttendChange(item)" 
                                                />
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
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import { getStudentsCourse, getAttendanceCourse, registerAttendanceCourse,getChaptersCourse } from '@/apiServices/index';
import { format } from 'date-fns';

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
        Avatar,
        InputSwitch,
        Dropdown
    },
    data() {
        return {
            students: [],
            attendance: [],
            selectedDate: null,
            chapters : [],
            selectedChapter: null,
            dateOptions: [],  // List of available dates
            rowsPerPage: 5,  // Number of rows per page
        };
    },
    computed: {
        // Método para verificar si un estudiante asistió en una fecha seleccionada
        checkDate() {
            return this.selectedDate !== null;
        },
        // Método para obtener el estado de asistencia de un estudiante
        isAttend() {
            return (person) => {
                const attendanceRecord = this.attendance.find(att => att.student_id === person.id && att.date === this.selectedDate);
                return attendanceRecord ? attendanceRecord.isAttend : false; // Retorna true/false
            };
        }
    },
    methods: {
        progress(course) {
            return (course.cuantity_students / course.cuantity_chapters) * 100;
        },

        // Método para obtener los estudiantes
        async getStudents() {
            const students = await getStudentsCourse(this.course.teacher_course_id);
            this.students = students.map(student => ({
                ...student,
                isAttend: false, // Inicializamos isAttend como false para cada estudiante
            }));
        },

        // Obtener las iniciales de un estudiante
        getInitials(item) {
            return item.first_name.charAt(0) + item.last_name.charAt(0);
        },

        // Método para agregar nuevas fechas de asistencia
        newPage() {
            const dateNow = new Date();
            const date = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`;
            if(this.dateOptions.find(date => date.value === this.selectedDate)){
                this.selectedDate = this.dateOptions[this.dateOptions.length - 1];
                return
            }
            this.dateOptions.push({ label: date, value: date });
            this.selectedDate = this.dateOptions[this.dateOptions.length - 1];
        },

        // Método para manejar el cambio de estado de asistencia
        async onAttendChange(person) {
            try {
                if (this.selectedDate === null) {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Seleccione una fecha', life: 3000 });
                    person.isAttend = !person.isAttend; // O simplemente desmarcar el switch si es necesario
                    return;
                }

                // Formato de la fecha para asegurar que sea compatible con la base de datos
                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const fullDate = format(new Date(this.selectedDate.value), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });

                // Verificamos si ya existe un registro de asistencia para este estudiante y fecha
                const studentIndex = this.attendance.findIndex(att => att.student_id === person.id && att.date === this.selectedDate);
                const data = {
                        studentId: person.id,
                        chapterId: this.selectedChapter.id,
                        date: fullDate,
                        status: 'En progreso'
                    }
                if (studentIndex !== -1) {
                    // Si el estudiante ya está en la lista de asistencia, lo actualizamos
                    this.attendance[studentIndex].isAttend = person.isAttend;
                    const data = {
                        studentId: person.id,
                        chapterId: this.selectedChapter.id,
                        date: fullDate,
                        status: 'En progreso'
                    }
                    const response = await registerAttendanceCourse(data);
                    console.log(response);
                    return
                }
                    
                // Si no está en la lista, lo agregamos
                const response = await registerAttendanceCourse(data);
                console.log(response);

                this.attendance.push({
                    student_id: person.id,
                    date: fullDate,
                    course_id: this.course.teacher_course_id,
                    isAttend: person.isAttend,
                });
                

                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Asistencia actualizada', life: 3000 });
            } catch (e) {
                console.error(e);
                if (e.response && (e.response.status === 400 || e.response.status === 401 || e.response.data.message === 'Token Expired')) {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo paso intentalo denuevo', life: 3000 });
                }
            }
        },

        // Método para obtener la asistencia de todos los estudiantes
        async getAttendance() {
            const attendance = await getAttendanceCourse(this.course.teacher_course_id);
            this.dateOptions = attendance.map(date => ({ label: date, value: date }));
            const length = this.dateOptions.length;
            this.selectedDate = this.dateOptions[length - 1].value;
            this.attendance = attendance;  // Actualizamos el estado de asistencia
        },
        async getChaperts(){
            console.log("here here jiji",this.course.course_id);
            const chapters = await getChaptersCourse(this.course.course_id);
            this.chapters = chapters;
        },
    },    
    mounted() {
        this.getStudents();
        this.getAttendance();
        this.getChaperts();
    }
}
</script>