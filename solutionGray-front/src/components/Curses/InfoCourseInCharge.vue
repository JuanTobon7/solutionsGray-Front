<template>
    <AddNoUsersToCourse v-if="showAdd" @closeAdd="showAdd=false" :course="this.course" :students="this.students"/>
    <section class="container w-full">
        <div class="flex flex-wrap w-full items-start justify-between gap-4 mb-10">
            <!-- Tarjeta de Información Principal -->
            <div class="bg-white shadow-lg shadow-gray-300 rounded-lg p-3 flex-grow md:flex-1 md:max-w-md">
                <div>
                    <h3 class="text-lg font-semibold">{{ course.name }}</h3>
                    <p class="text-gray-600 mb-2">{{ course.description }}</p>
                    <ProgressBar :value="progress" class="mb-4" />
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
            
            <!-- Lista de Estudiantes por fecha -->
            <DataView :value="students" layout="list"  :paginator="true" :rows="5">
                <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="mb-4 flex items-center gap-8">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center">
                        <label for="date" class="text-sm text-gray-600">
                            Seleccione la fecha para ver los asistentes:
                        </label>
                        <Calendar
                            id="date"
                            v-model="selectedDate"
                            :show-icon="true"
                            :dateFormat="'yy-mm-dd'"
                            placeholder="Seleccione una fecha"
                            class="w-full min-w-[200px] max-w-[300px] shadow appearance-none border border-second-100 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <!-- Slot para personalizar las fechas -->
                            <template #date="slotProps">
                                <div 
                                    class="p-4 rounded-full"
                                    :class="{
                                        'bg-green-300': verifyAssistance(slotProps.date),
                                        
                                    }"
                                >
                                    <p>{{ slotProps.date.day }}</p>
                                </div>
                            </template>
                        </Calendar>

                    </div>
                </div>

                <div class="flex items-center">                 
                    <label for="date" class="text-sm text-gray-600">Seleccione el capitulo visto visto:</label>
                    <Dropdown for="date" v-model="selectedChapter" :options="chapters" option-label="name" placeholder="Seleccione una capitulo" required
                    class="w-full min-w-[200px] max-w-[300px] shadow appearance-none border border-second-100 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
        </div>    
                    <div>                  
                    <button @click="reload" class="bg-second-500 text-white p-2 rounded-full material-symbols-outlined mr-2">
                        refresh
                    </button>
                    <button 
                    @click="showAdd = true"
                    class="bg-second-500 text-white p-2 rounded-full material-symbols-outlined">
                        person_add
                    </button>
                    </div>
                </div>
          </template>
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
import Calendar from 'primevue/calendar';
import { getStudentsCourse, getAttendanceCourse, registerAttendanceCourse, getChaptersCourse,deleteAttendanceCourse } from '@/apiServices/index';
import { format, parseISO } from 'date-fns';
import AddNoUsersToCourse from '../subComponents/AddNoUsersToCourse.vue';

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
        Dropdown,
        Calendar,
        AddNoUsersToCourse
    },
    data() {
        return {
            students: [],
            attendance: [],
            selectedDate: null,
            chapters: [],
            selectedChapter: null,
            courseProgress: 0,
            dateOptions: [],  // List of available dates
            rowsPerPage: 5,  // Number of rows per page
            showAdd: false
        };
    },
    watch: {
        selectedDate() {
            if (!this.selectedDate) {
                // Si no hay fecha seleccionada, restablecer `isAttend` y `selectedChapter`
                this.students = this.students.map(student => ({
                    ...student,
                    isAttend: false
                }));
                this.selectedChapter = null; // Restablecer el capítulo seleccionado
                return;
            }

            const selectedDateFormatted = new Date(this.selectedDate).toISOString().split('T')[0];

            // Actualizar isAttend en función de la asistencia registrada
            this.students = this.students.map(student => {
                const isAttended = this.attendance.some(att => {
                    const attendanceDateFormatted = new Date(att.date).toISOString().split('T')[0];
                    return att.studentId === student.student_course_id && attendanceDateFormatted === selectedDateFormatted;
                });
                return {
                    ...student,
                    isAttend: isAttended
                };
            });

            // Buscar el capítulo asociado a la fecha seleccionada
            const chapterForDate = this.attendance.find(att => {
                const attendanceDateFormatted = new Date(att.date).toISOString().split('T')[0];
                return attendanceDateFormatted === selectedDateFormatted;
            });

            if (chapterForDate) {
                // Asignar el capítulo correspondiente a `selectedChapter`
                this.selectedChapter = this.chapters.find(chapter => chapter.id === chapterForDate.chapter_id) || null;
            } else {
                // Si no se encuentra un capítulo asociado, restablecer `selectedChapter`
                this.selectedChapter = null;
            }
        }
    },
    computed: {
        progress() {
                if (this.attendance.length === 0) {
                console.log('No hay datos en attendance');
                return 0; // Retorna 0 o lo que tenga sentido para tu lógica
                }
                console.log('attendance:',this.attendance)
                const maxNumbChapter = Math.max(...this.attendance.map(item => item.numb_chapter));
                const progress = Math.round((maxNumbChapter / this.course.cuantity_chapters) * 100);
                return progress; 
        },
    },
    methods: {        
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

            // Formatear el label en 'yyyy-MM-dd'
            const label = `${dateNow.getFullYear()}-${(dateNow.getMonth() + 1).toString().padStart(2, '0')}-${dateNow.getDate().toString().padStart(2, '0')}`;

            // Obtener el valor en formato ISO con hora 'yyyy-MM-ddTHH:mm:ss.sssZ'
            const value = new Date(dateNow).toISOString();

            // Verificar si la fecha ya está en las opciones, si no, agregarla
            if (!this.dateOptions.some(option => option.value === value)) {
                this.dateOptions.push({ label, value });
            }

            // Asignar la fecha seleccionada
            this.selectedDate = { label, value };  // Asignar tanto label como value correctamente
        },

        async onAttendChange(item) {
            try {
                if (this.selectedDate == null || this.selectedDate === '') {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Seleccione una fecha', life: 3000 });
                    throw new Error('No date selected');
                }
                console.log('array',this.attendance)
                console.log('selectedCHapter',this.selectedChapter)
                // Buscar si ya existe un registro de asistencia para el estudiante y la fecha seleccionada
                const attendIndex = this.attendance.findIndex((att) => {
                    const attendanceDateFormatted = new Date(att.date).toISOString().split('T')[0];
                    const selectedDateFormatted = new Date(this.selectedDate).toISOString().split('T')[0];
                    return (
                        att.studentId === item.student_course_id &&
                        attendanceDateFormatted === selectedDateFormatted
                    );
                });
                console.log("attendIndex", attendIndex);
                const indexPerson = this.students.findIndex((student) => student.student_course_id === item.student_course_id);
                console.log("Estudiante:", this.students[indexPerson]);

                // Si el switch está apagado y ya existe un registro de asistencia, lo eliminamos
                if (!this.students[indexPerson].isAttend && attendIndex !== -1) {
                    console.log("Estudiante a quitar asistencia:", this.students[indexPerson]);
                    const attend = this.attendance[attendIndex];
                    await deleteAttendanceCourse(attend.id);

                    // Eliminar la asistencia de la lista local
                    this.attendance.splice(attendIndex, 1);
                    this.$toast.add({ severity: 'success', summary: 'Asistencia eliminada', detail: 'La asistencia ha sido eliminada', life: 3000 });
                    return;
                }

                // Si no hay capítulo seleccionado, mostramos un error y desmarcamos el switch
                if (this.selectedChapter === null) {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Seleccione un capítulo', life: 3000 });
                    // Actualizamos el estado de `isAttend` en students directamente
                    throw new Error('No chapter selected');
                }
                if (!this.selectedDate || isNaN(new Date(this.selectedDate).getTime())) {
                    throw new Error("La fecha seleccionada no es válida.");
                }
                // Formateamos la fecha con zona horaria
                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const attendanceDateFormatted = format(new Date(this.selectedDate), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: userTimeZone });

                // Si la fecha es válida, registramos la asistencia
                const data = {                
                    studentId: item.student_course_id,
                    chapterId: this.selectedChapter ? this.selectedChapter.id : null,
                    date: attendanceDateFormatted, // Pasamos la fecha con la zona horaria correctamente ajustada
                    status: 'En progreso',
                };

                // Registrar la asistencia
                const response = await registerAttendanceCourse(data);
                // Si no existía la asistencia, la agregamos a la lista
                if (attendIndex === -1) {
                    this.attendance.push({
                        id: response.result.id,
                        numb_chapter: this.selectedChapter.numb_chapter,
                        ...data
                    });
                }

                this.$toast.add({ severity: 'success', summary: 'Asistencia registrada', detail: 'La asistencia ha sido registrada', life: 3000 });
            } catch (e) {                
                console.error(e);
                if (
                    e.response &&
                    (e.response.status === 400 || e.response.status === 401 || e.response.data.message === 'Token Expired')
                ) {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo pasó. Intenta de nuevo', life: 3000 });
                }
                const indexPerson = this.students.findIndex((student) => student.student_course_id === item.student_course_id);
                this.students[indexPerson].isAttend = !this.students[indexPerson].isAttend;
            }
        },
        verifyAssistance(date) {

            // Convertir el objeto { day, month, year } en un objeto Date válido
            const convertedDate = new Date(date.year, date.month , date.day); 

            // Formatear la fecha para comparar
            const attendanceDateFormatted = format(convertedDate, 'yyyy-MM-dd');

            // Verificar si existe asistencia en esa fecha
            return this.attendance.some(att => {
                const attDateFormatted = format(new Date(att.date), 'yyyy-MM-dd');
                return attDateFormatted === attendanceDateFormatted;
            });
        },
        // Método para obtener la asistencia de todos los estudiantes
        async getAttendance() {            
            const attendance = await getAttendanceCourse(this.course.teacher_course_id);
            
            // Formatear las fechas en la respuesta para que tengan un formato adecuado
            this.dateOptions = attendance.map(date => {
                   return {
                    date: new Date(date.date),   // Guardar solo la fecha como string
                   };
            });            
            // Seleccionar la última fecha de la lista de opciones
            const length = this.dateOptions.length;
            if (length > 0) {
                this.selectedDate = this.dateOptions[length - 1].date;  // Asegurar que selectedDate sea una cadena de texto
            }
            this.attendance = attendance.map(att => ({
                id: att.id,
                studentId: att.student_id,
                date: parseISO(att.date), // Convertimos la fecha recibida a formato ISO
                chapter_id: att.chapter_id,
                status: att.status,
                numb_chapter: att.numb_chapter
            }));
            console.log('attendance:',this.attendance)
        },

        async getChapters() {
            const chapters = await getChaptersCourse(this.course.course_id);
            this.chapters = chapters;
        },
        async reload(){
           await this.getStudents();
           await this.getAttendance();
           await this.getChapters();
        }
    },

    beforeMount() {
        this.getStudents();
        this.getAttendance();
        this.getChapters();
    }
}
</script>
