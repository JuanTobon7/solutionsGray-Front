<template>
  <section class="w-full">
    <div class="fixed top-0 right-0 w-full md:w-[60%] lg:w-[80%] bg-primary-500 py-5">
      <nav class="flex justify-between items-center container px-8">
        <i @click="$emit('toggle-menu')" class="cursor-pointer material-symbols-outlined text-white lg:hidden">menu</i>
        <div class="flex items-center gap-4 ml-auto">
          <img class="h-11 w-11" src="../assets/solutionGrayLOGO-removebg.png" />
          <p class="text-xl text-primary-50">{{ userName }}</p>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      userName: null
    };
  },
  methods: {
    isLogin() {
      const session = this.$store.getters.userSession;
      if (!session) {
        return false;
      }
      const user = JSON.parse(session);
      this.userName = user.name;
      return true;
    }
  },
  created() {
    this.isLogin();
  }
};
</script>

<style scoped>
</style>
