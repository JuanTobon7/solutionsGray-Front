<template>
  <section class="min-h-screen p-8 container">
    <div class="mb-6">
      <p class="text-primary-900 text-3xl font-serif mb-1"><strong>
        Yo me alegré con los que me decían: A la casa de Jehová iremos. Salmos 122:1</strong></p>
        <h1 class="text-5xl mb-4 text-second-800"><strong>Cultos Programados</strong></h1>
    </div>
    <div class="flex items-center gap-2 mb-4 w-full">
      <label for="search" class="text-second-800 text-xl">Buscar</label>
      <input type="text" id="search" placeholder="Buscar" class="p-2 border border-gray-300 rounded-md w-1/2 outline-none bg-second-50" />      
      <button class="right-0 bg-primary-500 text-white p-2 rounded-md">Ver Historial de Cultos</button>
      <button @click="addWorshipService" class="right-0 bg-primary-500 text-white p-2 rounded-md">Agregar Culto</button>
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <div v-for="items in cultos" :key="items.id" class="w-1/4">
        <div class="shadow-md shadow-second-500 rounded-lg bg-second-50  transition-transform duration-200 hover:-translate-y-2">
          <div class="flex flex-col overflow-hidden rounded-md">
            <div>
              <img src="../assets/vid.png" alt="Culto Image" class="w-full h-48 object-cover" />              
            </div>
            <div class="p-4 flex flex-col justify-between gap-1">
              <h2 class="text-3xl text-second-900 font-bold mb-2"><strong>{{ items.name }}</strong> </h2>
              <span class="text-2xl text-gray-800">{{ formatDate(items.date) }}</span>            
              <span>
                <p class="text-gray-800">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus quaerat excepturi dolore</p>              
              </span>
            </div>
            <div class="bg-second-700 p-2 flex">
                <button class="w-full text-second-100 font-bold cursor-pointer">Ver información</button>
            </div>
          </div>
        </div>
      </div>      
    </div>
    <AddServantCard v-if="showAddWorshipService"  @close="closeAddWorhipService"/>
  </section>
</template>


  
  <script>
import AddServantCard from '@/components/Church/AddWorshipService.vue';  

  export default {
    components: {
      AddServantCard
    },
    data() {
      return {
        showAddWorshipService: false,
        cultos: [{
          id: 1,
          name: 'Culto de Jóvenes',
          description: 'Culto de jóvenes de la iglesia',
          date: '2021-10-10'
        },
        {
          id: 2,
          name: 'Culto de Adultos',
          description: 'Culto de adultos de la iglesia',
          date: '2021-10-10'
        },
        {
          id: 3,
          name: 'Culto de Niños',
          description: 'Culto de niños de la iglesia',          
          date: '2021-10-10'
        },
        {
          id: 4,
          name: 'Culto de Jóvenes',
          description: 'Culto de jóvenes de la iglesia',
          date: '2021-10-10'
        },
        {
          id: 5,
          name: 'Culto de Adultos',
          description: 'Culto de adultos de la iglesia',
          date: '2021-10-10'
        },
        {
          id: 6,
          name: 'Culto de Niños',
          description: 'Culto de niños de la iglesia',          
          date: '2021-10-10'
        }
      
      ]
      };
    },
    methods: {
      addWorshipService() {
        this.showAddWorshipService = true;
      },
      closeAddWorhipService() {
        this.showAddWorshipService = false;
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric',weekday: 'long' };
        const dateFormated = date.toLocaleDateString('es-ES', options);
        return dateFormated.charAt(0).toUpperCase() + dateFormated.slice(1);        
      }
    }   
  };
  </script>
  
  <style scoped>
  tr:hover{
  @apply bg-white
  }
  </style>