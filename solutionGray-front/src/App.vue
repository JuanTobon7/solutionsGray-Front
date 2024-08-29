<template>
  <NavBar v-if="showNavBar" @toggle-menu="toggleMenu" />
    <MenuUser v-if="showNavBar && showMenuUser" />

  <main :class="[showNavBar ? 'md:pl-[20%] md:py-[10%] lg:py-[4.4%]' : 'ml-0']">
    <RouterView/>    
  </main>
  <Toast/>
</template>

<script>
import NavBar from './components/NavBar.vue';
import MenuUser from './components/MenuUser.vue';
import { RouterView } from 'vue-router';
import Toast from './components/ToastComponent.vue';

export default {
  emits: ['close'],
  components: {
    NavBar,
    MenuUser,
    RouterView,
    Toast
  },
  data(){
    return{
      showMenuUser: true,
    }
  },
  computed:{
    showNavBar(){
      if(this.$route.path === '/login' || this.$route.path === '/sing-in' || this.$route.path === '/invitation-boarding'){                 
        return false
      }
      return true
      
    },
    isLogin(){
      return true
    }
  },
  methods: {
    toggleMenu() {
      this.showMenuUser = !this.showMenuUser;
    },       
  }
};
</script>

<style>
/* Ajusta el contenido principal para que no se superponga con el menú lateral */
.personal-animated{
  @apply animate-fade-down animate-once animate-duration-[200ms]  animate-ease-linear
}

#app {
  min-height: 100vh;
}
i {
  unicode-bidi: isolate;
}
</style>
