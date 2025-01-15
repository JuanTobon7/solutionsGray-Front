<template>
  <div id="app">
    <!-- Navbar -->
    <NavBarUser
      @close="toggleMenu"
      class=" hidden"
      v-if="showNavBar && userSession" 
    />
    <NavBar v-if="isFeed" />
    <main 
    v-if="isFeed"
    class="py-20"
    >
      <RouterView     
      />
    </main>
    <main v-else :class="[
      showNavBar && showMenuUser ? 'pl-40' : 'pl-0', 
      !showNavBar && showMenuUser ? '' : 'py-28'
    ]">
      <RouterView     
      />
    </main>
    <Toast/>
    <FooterComponent v-if="isFeed"/>
  </div>
</template>

<script>
import NavBarUser from './components/NavBarUser.vue';
import { RouterView } from 'vue-router';
import Toast from 'primevue/toast';
import FooterComponent from './components/FooterComponent.vue';
import store from './store';
import NavBar from './components/NavBar.vue';

export default {
  components: {
    FooterComponent,
    NavBarUser,
    RouterView,
    NavBar,
    Toast
  },
  data() {
    return {
      showMenuUser: true,
    };
  },
  computed: {
    showNavBar() {
      const excludedPaths = ['login', 'verify-email','sing-in'];
      return !excludedPaths.includes(this.$route.name);
    },
    userSession() {
      return store.getters.userSession;
    },
    isFeed(){
      return this.$route.path === '/';
    }
  },
  methods: {
    toggleMenu(value) {
      this.showMenuUser = value
      console.log('toggleMenu', value)
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
main {
    flex: 1; /* Hace que el contenido principal ocupe el espacio restante */
}
i {
  unicode-bidi: isolate;
}
</style>
