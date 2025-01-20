<template>
    <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
            <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Evaluar Estudiantes</h2>
                    <button @click="$emit('closeEvaluate')">
                        <i class="material-symbols-outlined">close</i>
                    </button>
                </div>
                <div>
                    <h3 class="text-xl font-semibold">Estudiantes a Evaluar</h3>
                    <span class="text-sm text-gray-600 block mb-4">
                        Podrás, en base al estudiante, definir si aprueba o reprueba el curso.
                    </span>
                    <DataTable
                        :value="studentsData"
                        class="w-full border-collapse"
                        paginator
                        :rows="10"
                        filterDisplay="menu"
                        selectionMode="single"
                        scrollable
                        dataKey="id"
                        tableStyle="min-width: 50rem"
                    >
                        <Column header="Foto" class="p-2 border-b border-primary-200 text-second-800" frozen>
                            <template #body="{ data }">
                                <Avatar
                                    v-if="data.avatar"
                                    :image="data.avatar"
                                    size="large"
                                    shape="circle"
                                />
                                <Avatar
                                    v-else
                                    :label="getInitials(data)"
                                    class="bg-primary-100 flex items-center justify-center text-primary-800"
                                    size="large"
                                    shape="circle"
                                />
                            </template>
                        </Column>
                        <Column field="first_name" header="Nombre" class="p-2 border-b border-primary-200 text-second-800" />
                        <Column field="last_name" header="Apellido" class="p-2 border-b border-primary-200 text-second-800" />
                        <Column field="email" header="Email" class="p-2 border-b border-primary-200 text-second-800" />
                        <Column field="phone" header="Teléfono" class="p-2 border-b border-primary-200 text-second-800" />
                        <Column field="attendance" header="Asistencia" class="p-2 border-b border-primary-200 text-second-800">
                            <template #body="{ data }">
                                <Tag :severity=severityAttendance(data.attendance)>
                                    {{ data.attendance }}%
                                </Tag>
                            </template>
                        </Column>
                        <Column header="Acciones" class="p-2 border-b border-primary-200 text-second-800">
                            <template #body="{ data }">
                                <Dropdown 
                                    @change="onStatusChange(data, $event)"
                                    v-model="data.status" 
                                    :options="options" 
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Selecciona el Estado"
                                    class="w-full"
                                >
                                    <template #value="{ value }">
                                        <Tag v-if="value" :severity="getSeverity(value)">
                                            {{ value }}
                                        </Tag>                                        
                                    </template>
                                    <template #option="{ option }">
                                        <div class="flex align-items-center">
                                            <span>{{ option.label }}</span>
                                        </div>
                                    </template>
                                </Dropdown>
                            </template>
                        </Column>
                    </DataTable>
                <div class="flex justify-end">
                    <button class="text-white bg-green-500 hover:bg-green-600 cursor-pointer rounded-md px-2 py-1">
                        Terminar Curso
                    </button>
                </div> 
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import { evaluateStudent, stadisticAttendanceCourse } from '@/apiServices';

export default {
    props: {
        course: {
            type: Object,
            required: true,
        },
        students: {
            type: Array,
            required: true,
        },
    },
    components: {
        DataTable,
        Dropdown,
        Column,
        Avatar,
        Tag,
    },
    data() {
        return {
            studentsData: this.students, // Inicializamos vacío para ser llenado dinámicamente
            options: [
                { label: 'Aprobado', value: 'Aprobado' },
                { label: 'Reprobado', value: 'Reprobado' },
            ],
        };
    },
    methods: {
        getInitials(item) {
            if (!item || !item.first_name || !item.last_name) {
                return "NN"; // Iniciales por defecto
            }
            return `${item.first_name.charAt(0)}${item.last_name.charAt(0)}`;
        },
        getSeverity(status) {
            if (status === 'Aprobado') return 'success';
            if (status === 'Reprobado') return 'danger';
            return 'info'; // Para otros estados
        },
        async onStatusChange(student, newStatus) {
            try {
                const payload = { id: student.id, status: newStatus.value };
                await evaluateStudent(payload);
                this.$toast.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Estudiante evaluado correctamente',
                    life: 3000,
                });
            } catch (e) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo evaluar al estudiante. Intente nuevamente.',
                    life: 3000,
                });
            }
        },
        async getStadisticAttendanceCourse() {
            try {
                const response = await stadisticAttendanceCourse(this.course.teacher_course_id);
                // Usar una nueva referencia para asegurar la reactividad
                const updatedStudents = this.students.map((student) => {
                    const studentAttendance = response.find((attendance) => attendance.student_id === student.id);
                    return {
                        ...student,
                        attendance: studentAttendance
                            ? Math.round((studentAttendance.cuantity_attendance / studentAttendance.cuantity_classes) * 100)
                            : 0,
                    };
                });
                this.studentsData = [...updatedStudents]; // Forzamos una referencia nueva
            } catch (e) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo obtener la asistencia de los estudiantes. Intente nuevamente.',
                    life: 3000,
                });
            }
        },
        severityAttendance(attendance) {
            if (attendance >= 80) return 'success';
            if (attendance >= 50) return 'warning';            
            return 'danger';
        },
    },
    mounted() {
        this.studentsData = [...this.students]; // Inicializamos con una copia reactiva de los datos
        this.getStadisticAttendanceCourse();
    },
};
</script>
