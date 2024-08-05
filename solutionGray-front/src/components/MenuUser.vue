<template>
  <aside class="bg-primary-700 sm:w-full md:w-[40%] lg:w-[20%] fixed h-full py-2 flex flex-col gap-2">
    <div class="flex flex-col items-center p-4">
      <img src="../assets/solutionGrayLOGO-removebg.png" class="sm:w-15 sm:h-15 md:w-[30vh]">
      <h2 class="text-2xl font-semibold text-primary-50">{{rol}}</h2>
    </div>
    <div>
      <ul class="text-primary-50 text-xl">
        <li class="px-4 py-2 hover:bg-primary-600 flex items-center gap-4">
          <i class="material-icons">home</i>
          <router-link to="/" class="block">Inicio</router-link>
        </li>
        <li class="px-4 py-2 hover:bg-primary-600 flex items-center gap-4">
          <i class="material-icons">info</i>
          <router-link to="/about" class="block">Acerca de</router-link>
        </li>
        <li class="px-4 py-2 hover:bg-primary-600 flex items-center gap-4">
          <i class="material-icons">contacts</i>
          <router-link to="/contact" class="block">Contacto</router-link>
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
      rol: null
    }
  },
  methods: {
    getRol(){
      const session = sessionStorage.getItem('user')
      if(!session){
        return false
      }      
      const user = JSON.parse(session)
      this.rol = user.rol
    }
  }, 
  mounted(){
    this.getRol()
  }
};
</script>

<style scoped>
</style>
