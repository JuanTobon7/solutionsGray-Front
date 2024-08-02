<template>
  <section class="w-full">
    <div class="fixed top-0 right-0 md:w-full  lg:w-[calc(100%-15rem)] bg-primary-500 py-5">
      <nav class="flex justify-between items-center container px-8">
        <span class="material-icons text-white">menu</span>
        <div class="flex right-0 text-primary-50 gap-4 items-center">
          <img class="h-11 w-11" src="../assets/solutionGrayLOGO-removebg.png">
          <p class="text-xl">Juan Carlos Tobon</p>
        </div>
      </nav>
    </div>
    <MenuUser/>
  </section>
</template>

<script>
import MenuUser from './MenuUser.vue';

export default {
  name: 'NavBar',
  components: {
    MenuUser
  }
};
</script>

<style scoped>
</style>
