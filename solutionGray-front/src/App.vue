<template>
  <NavBar v-if="showNavBar" @toggle-menu="toggleMenu" />
    <MenuUser v-if="showNavBar && showMenuUser" />

  <main :class="[showNavBar ? 'md:pl-[20%] md:py-[10%] lg:py-[4.4%]' : 'ml-0']">
    <RouterView/>
    <toast position="top-left">
      <template #message="slotProps">
        <div class="flex items-center justify-center" :class="getToastClass(slotProps.message.severity)">
          <span class="material-symbols-outlined">{{ slotProps.message.summary }}</span> <!-- este es mi icono que no quiero cambiar -->
          <p>{{ slotProps.message.detail }}</p>
        </div>
      </template>
      <template #closeButton></template>
    </toast>
  </main>
</template>

<script>
import NavBar from './components/NavBar.vue';
import MenuUser from './components/MenuUser.vue';
import { RouterView } from 'vue-router';

export default {
  emits: ['close'],
  components: {
    NavBar,
    MenuUser,
    RouterView
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
    getToastClass(severity) {
      switch (severity) {
        case 'error':
          return 'bg-red-500 text-white p-4 rounded-lg';
        case 'success':
          return 'bg-green-500 text-white p-4 rounded-lg';
        default:
          return 'bg-gray-500 text-white p-4 rounded-lg';
      }
    },
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
