<template>
    <section class="container w-full">
        <div class="flex flex-wrap items-center justify-center mb-6">
            <h2 class="text-3xl  text-second-800 mb-4 text-center">
                <strong>
                    Grupo {{group.name}}
                </strong>
            </h2>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores dicta eligendi optio sit incidunt? Odit, sequi expedita! Impedit, iure tenetur velit sapiente beatae et labore nulla nisi dolore officia eius.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus voluptate suscipit praesentium assumenda, illum a tenetur vero aut sint aliquid et consectetur rem atque autem dignissimos optio! Quasi, suscipit impedit.
            </p>
        </div>
        <DataView
            :value="group.servidores"
            :paginator="true"
            :rows="5"
            :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport'"
        >
            <template #list="slotProps">
                <div class="grid grid-cols-1 md:grid-rows-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full sm:grid-rows-2">
                    <div
                        v-for="(item, index) in slotProps.items"
                        :key="index"
                        class="shadow-lg shadow-gray-300 rounded-md overflow-hidden"
                    >
                        <div class="p-4">
                            <h3 class="text-2xl text-second-800 font-semibold">{{item.name}}</h3>
                            <p class="text-gray-700 text-sm">{{item.rol}}</p>
                            <p class="text-gray-700 text-sm">{{item.age}}</p>
                        </div>                        
                    </div>
                </div>    
            </template>
        </DataView>
        <div>
            <div class="flex items-center gap-2 mb-1 font-semibold">        
                <h2 class="text-2xl text-second-800 ">Ubicación del Grupo</h2>
                <i class="material-symbols-outlined text-second-800">pin_drop</i>
            </div>
            <div id="map" class="rounded-md container max-h-[80vh] z-0" style="height: 600px;"></div>
        </div>
    </section>
</template>

<script>
import DataView from 'primevue/dataview';
import L from 'leaflet';

export default {
    props: {
        groupProp:{
            type: Object,
            required: true        
        }
    },
    components: {
        DataView
    },
    data() {
        return {
            group: {
                name: 'Vida Nueva',
                servidores: [
                    {
                        name: 'Juan',
                        rol: 'Lider',
                        age: 25
                    },
                    {
                        name: 'Pedro',
                        rol: 'Co-Lider',
                        age: 30
                    },
                    {
                        name: 'Maria',
                        rol: 'Maestro',
                        age: 28
                    },
                    {
                        name: 'Jose',
                        rol: 'Anfitrion',
                        age: 27
                    },
                    {
                        name: 'Ana',
                        rol: 'Hermano Mayor',
                        age: 26
                    }
                ]
            }
        }        
    },
}
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';

</style>