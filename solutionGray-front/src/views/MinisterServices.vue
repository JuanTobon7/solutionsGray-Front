<template>
    <section class="h-screen p-8 container">
      <div v-for="items in cultos" :key="">

      </div>      
    </section>
  </template>
  
  <script>
  import { getMySheeps,getSheepById } from '../apiServices/index'
  
  export default {
    components: {
    },
    data() {
      return {
        sheepsInfo: [],
        sheepInfoById: null,
        showSheepInfoCard: false,
        showEditInfoCard: false,
      };
    },
    methods: {
      async getSheeps() {
        this.sheepsInfo = await getMySheeps();
      },
      async handleSheepInfo(id) {
        try{
          const sheepsInfo = await getSheepById(id);
          this.sheepInfoById = sheepsInfo;
          this.showSheepInfoCard = true;
          this.showEditInfoCard = false;
        }catch(error){
          console.log(error);
        }
      },
      async editInfoSheep(id) {
        try {
          const sheepInfo = await getSheepById(id);
          this.sheepInfoById = sheepInfo;
          this.showEditInfoCard = true;
          this.showSheepInfoCard = false;
        } catch (error) {
          console.log(error);
        }
      },
      closeSheepInfoCard() {
        this.showSheepInfoCard = false;
        this.sheepInfoById = null;
      },
      closeEditInfoCard() {
        this.showEditInfoCard = false;
        this.sheepInfoById = null;
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    },
    mounted() {
      this.getSheeps();
    }
  };
  </script>
  
  <style scoped>
  tr:hover{
  @apply bg-white
  }
  </style>