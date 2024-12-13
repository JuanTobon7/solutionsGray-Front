<template>
   <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm  z-50">
        <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
            <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
            <div class="mb-4 flex justify-between items-center">
                <h3 class="text-2xl sm:text-3xl md:text-4xl text-second-800">
                    <strong>
                        Evalua el servicio de los demas
                    </strong>
                </h3>        
                <button @click="$emit('close')" class="text-2xl text-gray-600 hover:text-gray-800 transition duration-200">
                    <i class="material-symbols-outlined">close</i>
                </button>
            </div>
            <p>
                Recuerda que "El hierro se afila con el hierro, y el hombre en el trato con el hombre." (Proverbios 27:17). Tu evaluación es una herramienta valiosa para el crecimiento y mejora de nuestra comunidad.
            </p>
            <p class="text-sm text-gray-700 mb-4">
                Esta evaluación es totalmente anónima y nos ayudará a tener una mayor visión
                sobre las habilidades y desempeños de los servidores. Te invitamos a ser honesto y respetuoso en tu evaluación.
            </p>
        <div class="flex flex-col justify-center w-full h-auto mb-4">
            <div class="flex items-center gap-2 mb-2">                
                <h3 class="text-2xl text-second-800 font-semibold">Privilegios Asignados</h3>
                <i class="material-symbols-outlined text-second-800">event</i>
            </div>
            <div class="flex flex-col w-full h-auto mb-4">
                <DataView 
                    :value="servicesAssigned" 
                    :paginator="true"
                    :rows="8"
                    :emptyMessage="'No hay asistentes disponibles'"
                    :pt="{
                    paginatorPageButton: 'custom-paginator-button'
                    }"
                >
                 <template #list="slotProps">
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                            <div
                            v-for="(item, index) in slotProps.items"
                            :key="index"
                            class="bg-white shadow-lg rounded-lg"
                            >
                            <div class="bg-second-50 shadow-lg shadow-primary-300 rounded-lg overflow-hidden">
                                <div class="bg-gradient-to-r from-primary-500 to-primary-800 h-20"></div>
                                <div class="px-4 py-6 -mt-14">
                                    <div class="bg-white p-6 rounded-lg shadow-lg">
                                        <div class="flex flex-col md:flex-row items-center space-x-4">
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
                                                <p class="text-sm text-gray-600">{{ item.type_person }}</p>
                                                <!-- Servicio asignado -->
                                                <p class="text-sm text-primary-900 font-semibold mt-2">
                                                    {{ item.rol_servant }}
                                                </p>
                                                <Rating v-if="item.rating === 0" v-model="item.rating" :cancel="false" :starts="5" @change="onRatingChange(item)" />
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
        </div>
        </div>
    </div>

    </section>
</template>


<script>
import { getServices,ratingService } from '@/apiServices/';
import DataView from 'primevue/dataview';
import Avatar from 'primevue/avatar';
import Rating from 'primevue/rating';

export default {
    props: {
        serviceWorshipId: {
            type: [String, Number],
            required: true,
        },
    },
    components: {
        DataView,
        Avatar,
        Rating
    },
    data() {
        return {
            servicesAssigned: [],
        };
    },
    methods: {
        async getServicesFun(serviceWorshipId) {
            if (!serviceWorshipId) {
                console.warn('serviceWorshipId is null or undefined.');
                return;
            }
            try {
                console.log('Fetching services for ID:', serviceWorshipId);
                const response = await getServices(serviceWorshipId);
                console.log('response in span',response)
                this.servicesAssigned = response.map((service)=>{
                    return {
                        ...service,
                        rating: 0
                    }
                })
            } catch (e) {
                if (e.response?.status !== 401 && e.response?.data?.message === 'Token has expired') {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Intentalo de nuevo',
                        life: 3000,
                    });
                }
            }
        },
        getInitials(person) {
            if (!person || !person.first_name || !person.last_name) return '';
            return person.first_name.charAt(0) + person.last_name.charAt(0);
        },
        async onRatingChange(person){
            try{
                console.log(person)
                const {rating,service_id} = person;
                if(!rating || !service_id){
                    this.$toast.add({severity:'error', summary: 'Error', detail: 'Ups algo paso intentalo denuevo',life: 3000});
                    return;
                };
                await ratingService({qualification:rating,serviceId:service_id});
                this.$toast.add({severity:'success', summary: 'Success', detail: 'Calificacion Hecha',life: 3000});
            }catch(e){
                if(e.response.status === 400 || e.response.status === 401 || e.response.data.message==='Token Expired'){
                    this.$toast.add({severity:'error', summary: 'Error', detail: 'Ups algo paso intentalo denuevo',life: 3000});
                }
            }
        }
    },
    watch: {
        serviceWorshipId: {
            handler(newVal) {
                if (newVal) this.getServicesFun(newVal);
            },
            immediate: true,
        },
    },
};
</script>
