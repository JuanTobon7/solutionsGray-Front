<template>
    <section class="container">
        <h2 class="text-2xl font-semibold" v-if="!showInfoCourse">Cursos a Cargo</h2>
        <div v-if="lengthCourses && !showInfoCourse">  
            <div class="flex gap-4">
                <Dropdown placeholder="Seleccionar Curso" :options="courseOptions" class="w-40" />
                <Dropdown placeholder="Seleccionar Iglesia" :options="churchOptions" class="w-40" />
                <Dropdown placeholder="Estado" :options="statusOptions" class="w-40" />
            </div>
            <DataView 
            :value="courses" 
            layout="grid" 
            :class="['w-full']" 
            :paginator="true" 
            :rows="6" 
            :sortField="sortField" 
            :sortOrder="sortOrder">
                <template #header>
                    <div class="w-full flex items-center gap-4">
                        <Dropdown class="w-3/4" v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Ordenar por" @change="onSortChange" />
                        <button @click="toggleAddCourse" class="material-symbols-outlined p-1 rounded-md bg-second-500 text-white font-semibold">add</button>
                    </div>
                </template>
                <template #grid="slotProps">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                        <div            
                            v-for="(item, index) in slotProps.items"
                            :key="index"
                            @click="showCourse(item)"
                            class="bg-white shadow-lg shadow-gray-300 rounded-lg p-4 transition-transform duration-200 hover:-translate-y-2 cursor-pointer"
                        >
                            <div>              
                                <h3 class="text-lg font-semibold">{{ item.name }}</h3>
                                <p class="text-gray-600 mb-2">{{ item.description }}</p>
                                <ProgressBar :value="progress(item)" class="mb-4" />
                                <p class="text-sm text-gray-600 mb-2">Módulos: {{ item.cuantity_chapters }}</p>
                                <p class="text-sm text-gray-600 mb-2">Estudiantes: {{ item.cuantity_students }}</p>
                            </div>
                        </div>
                    </div>  
                </template>
            </DataView>
        </div>
        <div v-else-if="!lengthCourses && !showInfoCourse">
            <p>No hay cursos a cargo</p>
        </div>
        <InfoCourseInCharge v-if="showInfoCourse" :course="selectedCourse" @close="showInfoCourse = false" /> 
    </section>
</template>


<script>
    import {getCoursesInCharge} from '@/apiServices/index'
    import Dropdown from 'primevue/dropdown';
    import DataView from 'primevue/dataview';
    import ProgressBar from 'primevue/progressbar';
    import InfoCourseInCharge from '@/components/Curses/InfoCourseInCharge.vue';
    export default {
        components: {
            Dropdown,
            DataView,
            ProgressBar,
            InfoCourseInCharge
        },
        data() {
            return {
                courses: [],
                selectedCourse: null,
                showInfoCourse: false,
                courseOptions: [],
                churchOptions: [],
                statusOptions: [],
                sortKey: null,
                sortOptions: [
                    { label: 'Nombre', value: 'name' },
                    { label: 'Fecha de Inicio', value: 'start_date' },
                    { label: 'Fecha de Fin', value: 'end_date' },
                    { label: 'Estado', value: 'status' },
                ],
                sortField: null,
                sortOrder: null,
            }
        },
        computed:{
            lengthCourses(){
                return this.courses.length
            }
        },
        methods: {
            progress(course){
                return (course.progress/course.cuantity_chapters)*100
            },
            async getCoursesInChargeFun(){
                try{                    
                    const response = await getCoursesInCharge()
                    this.courses = response
                }catch(error){
                    console.log(error)
                }
            },
            showCourse(course){
                this.selectedCourse = course
                this.showInfoCourse = true
            }
        },
        async mounted(){
            await this.getCoursesInChargeFun()
        }
    }
</script>