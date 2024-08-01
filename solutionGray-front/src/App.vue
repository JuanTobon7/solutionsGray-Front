<template>
  <div class="flex">
    <div class="w-[20%]">
      <MenuUser />
    </div>
    <div class="flex flex-col">
      <NavBar />
      <main class="mt-[20%]">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script>
import MenuUser from './components/MenuUser.vue';
import NavBar from './components/NavBar.vue';

export default {
  components: {
    MenuUser,
    NavBar
  }
};
</script>

<style scoped>
/* Ajusta el contenido principal para que no se superponga con el menú lateral */
#app {
  min-height: 100vh;
}
</style>
