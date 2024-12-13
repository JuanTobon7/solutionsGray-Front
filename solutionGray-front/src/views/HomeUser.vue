<template>
    <section class="w-full container">
        <div class="mb-4">            
            <h2 class="text-3xl sm:text-4xl md:text-5xl mb-4 text-second-800">
                <strong>
                    ¡¡¡¡Novedades!!
                </strong>
            </h2>        
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum necessitatibus quae illum nam facere, praesentium minus pariatur aliquid incidunt deleniti consequuntur ratione consectetur esse eaque modi nihil eveniet animi cupiditate?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas sequi numquam earum odio et blanditiis molestiae, quod voluptas consequatur debitis at exercitationem dignissimos perspiciatis placeat saepe in dicta necessitatibus! Similique.
                </p>            
                <p>Tus servicios Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus recusandae ea molestiae blanditiis, quod totam quae ad officia! Aperiam nesciunt praesentium dolor deleniti nulla, assumenda ad inventore minima cum aliquam.</p>
        </div>
        <div>            
            <h2 class="text-2xl sm:text-3xl md:text-4xl mb-4 text-second-800">
                <strong>
                    Tus proximos servicios
                </strong>
            </h2> 
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis libero aut vitae quaerat aliquam accusantium at repellendus reiciendis quidem corporis non quis qui laborum, provident alias ex quibusdam recusandae ea! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, veniam! Ducimus blanditiis eaque magni incidunt, quasi natus maiores ratione molestiae aliquam quia dolorem mollitia? Corrupti culpa quia quae placeat quidem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam labore inventore nihil ullam consequatur unde debitis, voluptatum voluptates, voluptatibus libero nemo rem placeat reprehenderit eveniet natus corrupti! Natus, distinctio velit.</p>
        </div>
    </section>
    <spanRatingService v-if="!checkQualified" :serviceWorshipId = "serviceWorshipId" @close="checkQualified=true"/>    
</template>

<script>
import {checkQualifiedRating} from '@/apiServices/'
import spanRatingService from '@/components/spanRatingService.vue';
export default {
    components: {
        spanRatingService
    },
    data(){
        return {
            serviceWorshipId: null,
            checkQualified: true,
        }
    },
        methods: {
            async checkQualifiedRatingFun() {
                try {
                    const response = await checkQualifiedRating();
                    console.log('heloo',response);
                    this.checkQualified = true
                } catch (e) {
                    console.log('heyyy',e.response.data)
                    console.log(e.response.status)
                    console.log(e.response.data.message)
                    if (e.response.status !== 401 && e.response.data.message === 'Token has expired') {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Intentalo de nuevo.', life: 3000 });
                    }else if(e.response.status === 400 && e.response.data.message === 'No ha calificado'){
                        this.serviceWorshipId = e.response.data.id
                        console.log('serviceWorshipId in Home',this.serviceWorshipId)
                        this.checkQualified = false
                    }
                }
        },
       
    },
    mounted() {
        this.checkQualifiedRatingFun();
    }
}
</script>