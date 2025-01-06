<template>
    <section class="w-full">
        <div id="start" class="bg-image-start  mb-10">
            <div class=" h-[70vh] bg-black bg-opacity-70">
                <div class="container h-full flex flex-col justify-center gap-2 text-white">
                    <h1 class="text-5xl mb-4 text-center">
                        <strong>
                            Bienvenidos a VidDeFe
                        </strong>
                    </h1>
                    <p class="text-lg text-center mb-6 text-white">
                        En VidDeFe encontrarás soluciones para tu congregación: una herramienta diseñada para transformar la gestión de tu iglesia. Con funciones pensadas para establecer el orden que Dios nos enseña, VidDeFe te permite enfocarte en lo que realmente importa: el crecimiento espiritual de tu comunidad.
                    </p>

                    <div class="flex items-center justify-center">
                        <button class="bg-second-500 hover:bg-second-600 text-white px-4 py-2 rounded-md mt-4">
                            Conocer más
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="VidDeFe" class="container mb-10">
            <h2 class="text-3xl flex items-center gap-2 text-second-900 mb-3">
                <strong>                        
                    ¿Que es VidDeFe?
                </strong>
                <i class="material-symbols-outlined text-3xl font-bold">church</i>
            </h2>
            <p class="text-lg text-gray-700 mb-1">
                VidDeFe es una plataforma diseñada para facilitar la gestión y organización de iglesias, proporcionando herramientas para mantener el orden en cada aspecto de la congregación. Nos enfocamos en el crecimiento espiritual de tu comunidad, ayudándote a llevar un control eficiente de cultos, asistencias, ofrendas y más.
            </p>
            <p class="text-lg text-gray-700">
                Con VidDeFe, podrás gestionar todos los aspectos administrativos de tu iglesia desde un solo lugar, permitiendo que te concentres en lo más importante: el desarrollo espiritual y la unidad de tu comunidad. Esta aplicación ha sido creada pensando en las necesidades de cada iglesia, grande o pequeña, proporcionando una experiencia fácil de usar y completamente integrada.
            </p>
        </div>
        <div id="contact" class="bg-work mb-10">
            <div class="bg-black bg-opacity-70 w-full">
                <div class="container py-16">
                    <div class="py-10 max-w-2xl w-full lg:mx-auto">
                        <div class="mb-4">
                            <h2 class="text-4xl text-center text-white mb-4 font-bold">
                                Cuéntanos de ti y tu iglesia
                            </h2>
                            <span class="text-white">
                                Al llenar este formulario, nos enviarás tu información y la de tu iglesia para que podamos aceptarlos en nuestra aplicación.
                            </span>
                        </div>
                        <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Primer Nombre -->
                            <div>
                                <label for="first_name" class="block text-sm font-medium text-white">Primer Nombre</label>
                                <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                v-model="newPerson.first_name"
                                autocomplete="given-name"
                                class="input-form"
                                />
                            </div>
                            <!-- Primer Apellido -->
                            <div>
                                <label for="last_name" class="block text-sm font-medium text-white">Primer Apellido</label>
                                <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                v-model="newPerson.last_name"
                                autocomplete="family-name"
                                class="input-form"
                                />
                            </div>
                            <!-- Correo -->
                            <div>
                                <label for="email" class="block text-sm font-medium text-white">Correo</label>
                                <input
                                type="email"
                                name="email"
                                id="email"
                                v-model="newPerson.email"
                                autocomplete="email"
                                class="input-form"
                                />
                            </div>
                            <!-- Teléfono -->
                            <div>
                                <label for="phone" class="block text-sm font-medium text-white">Teléfono</label>
                                <input
                                type="tel"
                                name="phone"
                                id="phone"
                                v-model="newPerson.phone"
                                autocomplete="tel"
                                class="input-form"
                                />
                            </div>
                            <div>
                                <label for="church_name" class="block text-sm font-medium text-white">Nombre de la Iglesia</label>
                                <input
                                type="text"
                                name="church_name"
                                id="church_name"
                                v-model="churchName"
                                autocomplete="organization"
                                class="input-form"
                                />
                            </div>
                            <div>
                                <label for="cc" class="block text-sm font-medium text-white">Cedula</label>
                                <input
                                type="number"
                                min="0"
                                name="cc"
                                id="cc"
                                v-model="newPerson.cc"
                                class="input-form"
                                />
                            </div>
                            <!-- País -->
                            <div class="flex flex-col">
                                <label class="block text-sm font-medium text-white mb-1">País</label>
                                <Dropdown
                                id="countries"
                                v-model="newPerson.country_id"
                                :options="countries"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Seleccione un país"
                                required
                                class="w-80 md:w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-second-500 focus:border-second-500 sm:text-sm"
                                @change="onCountryChange"
                                />
                            </div>
                            <!-- Estado/Provincia -->
                            <div class="flex flex-col">
                                <label class="block text-sm font-medium text-white mb-1">Estado/Provincia</label>
                                <Dropdown
                                id="states"
                                v-model="newPerson.state_id"
                                :options="states"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Seleccione un estado/provincia"
                                required
                                class="w-80 md:w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-second-500 focus:border-second-500 sm:text-sm"
                                :disabled="!states.length"
                                />
                            </div>
                        </div>
                        <!-- Botón de Enviar -->
                        <div class="flex justify-end mt-8">
                        <button
                            @click="createPerson"
                            class="bg-second-500 hover:bg-second-600 text-white px-6 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-second-500"
                        >
                        Enviar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="why-VidDeFe" class="container mb-10">
            <div class="mb-8">
                <h2 class="text-3xl flex items-center gap-2 text-second-900 mb-4">
                    <strong>¿Por qué VidDeFe?</strong>
                </h2>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi modi culpa non. Beatae id quaerat earum architecto accusantium recusandae, saepe consectetur cum commodi nostrum tenetur quasi distinctio ipsam, sunt dolor?</p>
            </div>
            <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                    v-for="(feature, index) in features"
                    :key="index"
                    class="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                    <div class="flex flex-col items-center gap-3 mb-4">
                    <div class="bg-second-500 text-white w-12 h-12 flex items-center justify-center rounded-full text-xl">
                        <i class="material-symbols-outlined text-2xl font-bold">{{feature.icon}}</i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800">{{ feature.title }}</h3>
                    </div>
                    <p class="text-gray-600">{{ feature.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import { getCountries, getStatesByCountry,savePeople,sendLead } from '@/apiServices';
export default{
    components: {
        Dropdown,
    },
    data(){
        return {
            countries: [],
            states: [],
            newPerson: {
                cc: null,
                first_name: null,
                last_name: null,
                email: null,
                phone: null,
                country_id: null,
                state_id: null,
                type_person_id: 3,
            },
            churchName: null,
            features: [
                {
                    title: "Gestión de Cultos",
                    description:
                        "Organiza y administra los cultos con horarios, ubicaciones y planificación centralizada.",
                    icon: "event", // Ícono de calendario/evento
                },
                {
                    title: "Control de Asistencias",
                    description:
                        "Lleva un registro detallado de las asistencias de tus miembros y visitantes.",
                    icon: "check_circle", // Ícono de confirmación
                },
                {
                    title: "Gestión de Ofrendas",
                    description:
                        "Registra y monitorea las ofrendas para mantener una administración transparente.",
                    icon: "volunteer_activism", // Ícono de donación
                },
                {
                    title: "Discipulados",
                    description:
                        "Facilita la organización de discipulados con asignación de mentores y seguimiento.",
                    icon: "school", // Ícono de educación
                },
                {
                    title: "Gestión de Personas",
                    description:
                        "Administra la información de los miembros, visitantes y equipos de la iglesia.",
                    icon: "group", // Ícono de grupo/personas
                },
                {
                    title: "Gestión de Usuarios",
                    description:
                        "Administra la información de los usuarios con roles y permisos personalizados.",
                    icon: "assignment_ind", // Ícono especial para usuarios
                },
                {
                    title: "Reportes Detallados",
                    description:
                        "Genera reportes dinámicos de actividades, finanzas y crecimiento de la iglesia.",
                    icon: "analytics", // Ícono de estadísticas
                },
                {
                    title: "Notificaciones y Alertas",
                    description:
                        "Envía notificaciones a los miembros sobre eventos, recordatorios de cultos y anuncios importantes.",
                    icon: "notifications", // Ícono de notificaciones
                },
                {
                    title: "Gestión de Grupos Pequeños (En Desarrollo)",
                    description:
                        "Administra células, reuniones en casas o grupos de vida, asignando líderes y haciendo seguimiento. Próximamente disponible.",
                    icon: "people_outline", // Ícono de grupo pequeño
                },
            ],
        }
    },
    methods: {
        async loadCountries() {
            try {
                const response = await getCountries(); // Obtener países desde la BD
                this.countries = response;
            } catch (error) {
                console.error('Error al cargar los países:', error);
            }
        },
        async onCountryChange() {
            const countryId = this.newPerson.country_id;
            try {
                const response = await getStatesByCountry(countryId); // Obtener estados según el país seleccionado
                this.states = response;
            } catch (error) {
                console.error('Error al cargar los estados:', error);
            }
        },
        async createPerson() {
                if (!this.newPerson.country_id || !this.newPerson.state_id || !this.newPerson.type_person_id || !this.newPerson.cc || !this.newPerson.first_name || !this.newPerson.last_name || !this.newPerson.email || !this.newPerson.phone) {
                    console.log('this.newPerson:', this.newPerson);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos', life: 3000 });
                    return;
                }
                const result = await savePeople(this.newPerson);
                console.log('result of savePeople:', result);
                const data = {
                    churchName: this.churchName, 
                    stateId: this.newPerson.state_id, 
                    email: this.newPerson.email, 
                    firstName: this.newPerson.first_name, 
                    lastName: this.newPerson.last_name, 
                    phone: this.newPerson.phone, 
                    personId: result.id
                }
                await sendLead({...data});
                this.newPerson = {
                    cc: null,
                    first_name: null,
                    last_name: null,
                    email: null,
                    phone: null,
                    country_id: null,
                    state_id: null,
                    type_person_id: 3,
                };
                this.churchName = null;
                this.$toast.add({ severity: 'success', summary: 'Persona creada', detail: 'La petición ha sido exitosa', life: 3000 });
        }
    },
    mounted() {
        this.loadCountries(); // Cargar la lista de países al montar el componente
    }

}
</script>

<style scoped>
.bg-image-start {
  background-image: url('https://vid-de-fe.s3.us-east-2.amazonaws.com/photos/vid.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}
.bg-work {
  background-image: url('https://vid-de-fe.s3.us-east-2.amazonaws.com/photos/work.jpg');
  background-repeat: no-repeat;
  background-position: center left;
  background-size: cover;
}
.input-form{
    @apply mt-1 block w-80 md:w-full  px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-second-500 focus:border-second-500 sm:text-sm;
}
</style>