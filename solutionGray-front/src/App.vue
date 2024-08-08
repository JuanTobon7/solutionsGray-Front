<template>
  <NavBar v-if="showNavBar" @toggle-menu="toggleMenu" />
    <MenuUser v-if="showNavBar && showMenuUser" />

  <main :class="[showNavBar ? 'md:pl-[20%] md:py-[10%] lg:py-[4.4%]' : 'ml-0']">
    <RouterView/>
  </main>
</template>

<script>
import NavBar from './components/NavBar.vue';
import MenuUser from './components/MenuUser.vue';
import { RouterView } from 'vue-router';

export default {
  components: {
    NavBar,
    MenuUser,
    RouterView
  },
  data(){
    return{
      showMenuUser: true
    }
  },
  computed:{
    showNavBar(){
      return this.$route.path !== '/login';
    },
    isLogin(){
      return true
    }
  },
  methods: {
    toggleMenu() {
      this.showMenuUser = !this.showMenuUser;
    }
  }
};
</script>

<style scoped>
/* Ajusta el contenido principal para que no se superponga con el menú lateral */
#app {
  min-height: 100vh;
}
i {
      unicode-bidi: isolate;
    }
</style>
