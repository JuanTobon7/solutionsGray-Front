<template>
  <NavBar/>
  <main>
    <RouterView/>
  </main>
</template>

<script>
import NavBar from './components/NavBar.vue';
import { RouterView } from 'vue-router';

export default {
  components: {
    NavBar,
    RouterView
  }
};
</script>

<style scoped>
/* Ajusta el contenido principal para que no se superponga con el menú lateral */
#app {
  min-height: 100vh;
}
</style>
