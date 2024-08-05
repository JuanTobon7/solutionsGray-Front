<template>
    <p>Iglesia {{ churchName }}</p>
</template>

<script>
import {getChurchInfo} from '../apiServices/index'
export default{
    name: 'HomeView',
    data(){
        return{
            churchName: null
        }
    },
    methods: {
        async getChurh(){
            try{
                const response = await getChurchInfo()
                this.churchName = response.name
            }catch(e){
                console.log(e)
            }
        }
    },
    mounted(){
        this.getChurh()
    }

}
</script>