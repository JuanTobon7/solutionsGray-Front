<template>
  <div id="app">
    <!-- Navbar -->
    <NavBar 
      v-if="showNavBar" 
      @toggle-menu="toggleMenu"
      :class="{
        'w-full': showMenuUser, 
        'md:w-[60%] lg:w-[85%]': !showMenuUser,
        'transition-all duration-300': true
      }"
    />
    
    <!-- Sidebar Menu -->
    <MenuUser 
      v-if="showNavBar && showMenuUser" 
      @close="toggleMenu" 
      class="transition-transform duration-300"
    />

    <!-- Main Content -->
    <main 
      :class="[
        'transition-all duration-300',
        showNavBar && showMenuUser ? 'ml-[10%] py-[30%] sm:py-[8%] lg:py-[5%]' : 'py-[30%] sm:py-[10%] lg:py-[5%]'
      ]"
    >
      <RouterView/>    
    </main>
    
    <!-- Toast Notifications -->
    <Toast/>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import MenuUser from './components/MenuUser.vue';
import { RouterView } from 'vue-router';
import Toast from 'primevue/toast';

export default {
  components: {
    NavBar,
    MenuUser,
    RouterView,
    Toast
  },
  data() {
    return {
      showMenuUser: true,
    };
  },
  computed: {
    showNavBar() {
      const excludedPaths = ['/login', '/sing-in', '/invitation-boarding'];
      return !excludedPaths.includes(this.$route.path);
    }
  },
  methods: {
    toggleMenu() {
      this.showMenuUser = !this.showMenuUser;
    }
  }
};
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

i {
  unicode-bidi: isolate;
}
</style>
