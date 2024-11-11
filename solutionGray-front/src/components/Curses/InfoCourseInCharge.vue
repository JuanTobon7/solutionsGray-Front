<template>
    <section class="container w-full">
        <div class="flex flex-wrap w-full items-start justify-between gap-4 mb-10">
            <!-- Tarjeta de Información Principal -->
            <div class="bg-white shadow-lg shadow-gray-300 rounded-lg p-4 flex-grow md:flex-1 md:max-w-md">
                <div>
                    <h3 class="text-lg font-semibold">{{ course.name }}</h3>
                    <p class="text-gray-600 mb-2">{{ course.description }}</p>
                    <ProgressBar :value="progress(course)" class="mb-4" />
                    <p class="text-sm text-gray-600 mb-2">Módulos: {{ course.cuantity_chapters }}</p>
                    <p class="text-sm text-gray-600 mb-2">Estudiantes: {{ course.cuantity_students }}</p>
                </div>
            </div>

            <!-- Información Básica -->
            <div class="bg-second-50 shadow-lg shadow-gray-300 rounded-lg p-4 md:w-1/2 lg:w-3/4">
                <h3 class="text-xl font-semibold mb-3">Información Básica</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-600 mb-2">Nombre: {{ course.name }}</p>
                        <p class="text-sm text-gray-600 mb-2">Editorial: {{ course.publisher }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600 mb-2">Description: {{ course.description }}</p>
                        <p class="text-sm text-gray-600 mb-2">Cantidad de Estudiantes: {{ course.cuantity_students }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<script>
import ProgressBar from 'primevue/progressbar';
export default{    
    props: {
        course: {
            type: Object,
            required: true
        }
    },
    components: {
        ProgressBar
    },
    methods: {
        progress(course){
            return (course.cuantity_students / course.cuantity_chapters) * 100
        }
    }
}
</script>