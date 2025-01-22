<template>
     <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
            <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Inscribir Ovejas y Nuevos</h2>
                    <button @click="$emit('closeAdd')">
                        <i class="material-symbols-outlined">close</i>
                    </button>
                </div>
                <div>
                    <h3 class="text-xl">Personas a Inscribir</h3>
                    <span class="text-sm text-gray-600">haz click sobre el estudiante a inscribir</span>
                    <DataTable
                        :value="people"
                        class="w-full border-collapse"
                        paginator
                        :rows="10"
                        filterDisplay="menu"
                        scrollable
                        selectionMode="single"
                        v-model:selection="selectedPerson"
                        @update:selection="onPersonSelected"
                        dataKey="id"
                        tableStyle="min-width: 50rem"
                        :disabled="isLoading"
                    >
                        <Column field="first_name" header="Nombre" class="p-4  border-b border-primary-200 text-second-800" frozen></Column>
                        <Column field="last_name" header="Apellido" class="p-4  border-b border-primary-200 text-second-800"></Column>
                        <Column field="email" header="Email" class="p-4  border-b border-primary-200 text-second-800"></Column>
                        <Column field="phone" header="Teléfono" class="p-4  border-b border-primary-200 text-second-800"></Column>
                        <Column field="type_person" header="Tipo de Persona" class="p-4  border-b border-primary-200 text-second-800"></Column>
                        <Column header="Inscrito" class="p-4  border-b border-primary-200 text-second-800">
                            <template #body="slotProps">
                                <Tag  :severity="getSeverity(slotProps.data)">
                                    {{ slotProps.data.isStudent ? 'Inscrito' : 'No Inscrito' }}
                                </Tag>
                            </template>
                        </Column>                       
                    </DataTable>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { getPeople,enrrollNoUsersInCourse } from '@/apiServices';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
export default {
    props: {
        course: {
            type: Object,
            required: true,
        },
        students: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            people: [],
            selectedPerson: null,
            isLoading: false,
        };
    },
    components: {
        DataTable,
        Column,
        Tag,
    },    
    methods: {
        async getPeople() {
            const response = await getPeople();
            this.people = response.filter((person) => person.type_person_id == 5 || person.type_person_id == 4);

        },
        async onPersonSelected() {
            try{
                if(!this.selectedPerson) return;
                if(this.selectedPerson.isStudent){
                    this.$toast.add({ severity: 'info', summary: 'Información', detail: 'Esta persona ya está inscrita', life: 3000 });
                    return;
                }
                const personId = this.selectedPerson.id;
                const courseId = this.course.teacher_course_id;
                await enrrollNoUsersInCourse({personId, courseId});
                this.people = this.people.map((person) => {
                    if (person.id === personId) {
                        return {
                            ...person,
                            isStudent: true,
                        };
                    }
                    return person;
                });
                this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Persona inscrita correctamente', life: 3000 });
            }catch(e){
                if (
                    e.response &&
                    (e.response.status === 400 || e.response.status === 401 || e.response.data.message === 'Token Expired')
                ) {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo pasó. Intenta de nuevo', life: 3000 });
                }
            }
        },
        markPeopleStudents() {
            this.people = this.people.map((person) => {
                const isStudent = this.students.some((student) => student.id === person.id);
                return {
                    ...person,
                    isStudent,
                };
            });
        },
        getSeverity(person) {
            return person.isStudent ? 'success' : 'danger';
        }
    },
    async mounted() {        
        await this.getPeople();
        this.markPeopleStudents();
    },
};
</script>
