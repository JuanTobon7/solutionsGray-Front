<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-[80vh] p-8 bg-second-50 rounded-md shadow-md shadow-second-700 container">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-3xl font-bold text-second-900"><strong>Agregar nueva oveja</strong></h2>
        <img src="../../assets/shepPNG-removebg-preview.png" class="w-28 right-0"/>
      </div>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mb-2  sm:items-start md:items-center container">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col">
            <label for="name" class="text-second-800"><strong>Nombre</strong></label>
            <input
              type="text"
              id="name"
              v-model="newSheep.name"
              class="rounded-md bg-second-200 p-1 text-second-950 outline-1 outline-second-500"
            />
          </div>
          <div class="flex flex-col">
            <label for="email" class="text-second-800"><strong>Email</strong></label>
            <input
              type="email"
              id="email"
              v-model="newSheep.email"
              class="rounded-md bg-second-200 p-1 text-second-950 outline-1 outline-second-500"
            />
          </div>
          <div class="flex flex-col">
            <label for="description" class="text-second-800"><strong>Descripcion o peticion de oracion</strong></label>
            <textarea
              id="description"
              v-model="newSheep.description"
              class="rounded-md bg-second-200 p-1 text-second-950 outline-1 outline-second-500"
            ></textarea>
          </div>
        </div>
        <div class="h-full flex flex-col gap-2">
          <h2 class="text-second-800 text-start"><strong>Servidores Disponibles:</strong></h2>
          <div class="servants-container flex flex-col items-center justify-around">
            <ul v-if="servants">
              <li
                v-for="guides in servants"
                :key="guides.name"
                :class="{ 'bg-second-300': newSheep.guide_id === guides.id }"
                class="p-2 bg-second-100 rounded-md shadow shadow-second-300 px-16 hover:bg-second-200 cursor-pointer"
                @click="assingGuide(guides.id)"
              >
                <div class="flex items-center gap-2 mb-2 text-xl text-second-950">
                  <i class="material-symbols-outlined">person</i>
                  <p class="mr-4">{{guides.name}}</p>
                </div>
                <p>ovejas a su cargo: <strong>{{guides.cuantity_sheeps_guide}}</strong></p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button @click="$emit('close')" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
    </div>
  </div>
</template>

<script>
import { getServants } from '../../apiServices/index';
export default {  
  data() {
    return {
      newSheep: {
        name: null,
        email: null,
        description: null,
        arrival_date: null,
        guide_id: null,
        last_visit: null,
        status: null
      },
      servants: [
      { id: 1, name: 'Juan Perez', cuantity_sheeps_guide: 5 },
        { id: 2, name: 'Maria Lopez', cuantity_sheeps_guide: 3 },
        { id: 3, name: 'Carlos Martinez', cuantity_sheeps_guide: 7 },
        { id: 4, name: 'Lucia Gomez', cuantity_sheeps_guide: 4 },
        { id: 5, name: 'Jorge Ramirez', cuantity_sheeps_guide: 2 },
        { id: 6, name: 'Ana Fernandez', cuantity_sheeps_guide: 6 },
        { id: 7, name: 'Luis Torres', cuantity_sheeps_guide: 8 },
        { id: 8, name: 'Elena Gutierrez', cuantity_sheeps_guide: 9 },
        { id: 9, name: 'Pablo Diaz', cuantity_sheeps_guide: 1 },
        { id: 10, name: 'Sofia Herrera', cuantity_sheeps_guide: 11 }
      ]
    }
  },
  methods: {
    async getServantsGuide() {
      try {
        const response = await getServants('/servants')
        this.servants.push({id: response.id,name:response.name,cuantity_sheeps_guide:response.cuantity_sheeps_guide})
      } catch (error) {
        console.log(error)
      }
    },
    async assingGuide(guideId) {
      try{
        this.newSheep.guide_id = guideId
      }catch(error){
        console.log(error)
      }
    }
  },  
  mounted() {
    this.getServantsGuide()
  }
}
</script>

<style scoped>
.servants-container {
  @apply w-full max-h-[20vh] overflow-y-auto;
}
</style>