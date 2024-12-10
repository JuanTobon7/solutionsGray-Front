<template>
     <section class="container w-full">
        <h2>Ya haz calificado a los servidores?</h2>
        <p>Esta evaluación es totalmente anonima y nos ayudara a tener una mayor visión sobre las habilidades y desempeños de los servidores</p>
        <div class="flex flex-col w-full h-auto mb-4">
        <div class="flex items-center gap-2 mb-1">        
            <i class="material-symbols-outlined text-second-800">event</i>
            <h3 class="text-2xl text-second-800 font-semibold">Privilegios Asignados</h3>
        </div>
        <p v-if="!check">Califica men</p>
    </div>
    </section>
</template>

<script>
import {checkQualifiedRating} from '@/apiServices/'
export default {
    data() {
        return {
            servicesAssigned: [],
            check: false
        }
    },
    methods: {
        getInitials(person) {
            if (!person) return '';
            console.log('es aqui',person.person)
            return person.first_name.charAt(0) + person.last_name.charAt(0);
        },
        async checkQualifiedRating() {
            try {
                console.log('entro aquii')
                const response = await checkQualifiedRating();
                console.log(response);
                this.check = true
            } catch (error) {
                console.error(error);
            }
        },
    },
    mounted() {
        this.checkQualifiedRating();
    }
}
</script>