<template>
  <aside class="bg-primary-700 w-[80%] md:w-[40%] lg:w-[15%] fixed h-full py-2 flex flex-col gap-2 z-10">
      <div class="flex justify-end pr-4 pt-4 lg:hidden">
        <button @click="$emit('close')" class="material-symbols-outlined cursor-pointer text-primary-50">close</button>
      </div>
    <div class="flex flex-col items-center p-4">
      <img src="../assets/solutionGrayLOGO-removebg.png" class="sm:w-15 sm:h-15 md:w-[30vh]">
      <h2 class="text-2xl font-semibold text-primary-50">{{rol}}</h2>
    </div>
    <div>
      <ul class="text-primary-50 text-xl">
        <li  @click="toogleChurchMenu" class="px-4 py-2 hover:bg-primary-600 flex flex-col gap-4">
          <div class="flex items-center gap-4"> 
            <i class="material-symbols-outlined text-primary-50">church</i>
            <span to="/sheeps" class="block">Church</span>
          </div>
          
        </li>
        <div v-if="showMenuChurch" class="pl-8 w-3/4 flex flex-col">
          <ul class="list-disc list-inside mb-2 w-auto">
            <li @click="redirectTo(item.path)" v-for="item in menuItemsChurch" :key="item.label" class="text-primary-50 px-2 py-2 hover:bg-primary-600 transition-all duration-300 rounded-md">
              {{ item.label }}
            </li>
          </ul>
        </div>
        <li class="px-4 py-2 hover:bg-primary-600 flex items-center gap-4">
          <i class="material-symbols-outlined">people</i>
          <router-link to="/servants" class="block">Servidores</router-link>
        </li>
        <li  @click="toggleSheepMenu" class="px-4 py-2 hover:bg-primary-600 flex flex-col gap-4">
          <div class="flex items-center gap-4"> 
            <i class="material-symbols-outlined text-primary-50">digital_wellbeing</i>
            <span to="/sheeps" class="block">Ovejas</span>
          </div>
          
        </li>
        <div v-if="showMenuSheep" class="pl-8 w-3/4 flex flex-col">
          <ul class="list-disc list-inside mb-2 w-auto">
            <li @click="redirectTo(item.path)" v-for="item in menuItemsSheep" :key="item.label" class="text-primary-50 px-2 py-2 hover:bg-primary-600 transition-all duration-300 rounded-md">
              {{ item.label }}
            </li>
          </ul>
        </div>
        <li class="px-4 py-2 hover:bg-primary-600 flex items-center gap-4">
          <i class="material-symbols-outlined">book</i>
          <router-link to="/" class="block">Cursos</router-link>
        </li>
        <li class="px-4 py-2 hover:bg-primary-600 flex items-center gap-4">
          <i class="material-symbols-outlined">paid</i>
          <router-link to="/settings" class="block">Ingresos</router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>

export default {
  name: 'MenuUser',
  data(){
    return {
      rol: null,
      showMenuSheep: false,
      showMenuChurch: false,
      menuItemsChurch: [
        {label: 'Mi iglesia',path:'/my-church'},
        {label: 'Cultos',path:'/worship-services'}
      ],
      menuItemsSheep: [
      { label: 'Ver ovejas en la iglesia', path: '/sheeps' },
      { label: 'Ver mis ovejas', path: '/my-sheeps' },
      ],      
    }
  },
  methods: {
    getRol() {
      const session = this.$store.getters.userSession;

      if (!session) {
        return false;
      }

      const user = JSON.parse(session);
      this.rol = user.rol;
      return true;
    },
    toggleSheepMenu() {
            this.showMenuSheep = !this.showMenuSheep;
    },
    toogleChurchMenu() {
            this.showMenuChurch = !this.showMenuChurch;
    },
    redirectTo(path){
      this.$router.push(path)
    }
  }, 
  mounted(){
    this.getRol()
  }
};
</script>

<style scoped>
li{
  @apply cursor-pointer;
}
i {
  unicode-bidi: isolate;
}
</style>
