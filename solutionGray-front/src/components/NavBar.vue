<template>
  <section class="w-full">
    <div 
      class="fixed top-0 right-0 w-full bg-primary-500 py-5 z-10"
      :class="{'w-full': menuUser, 'md:w-[60%] lg:w-[85%]': !menuUser}"
      >
      <nav class="flex justify-between items-center container">
        <button @click="menuUserFun" class="material-symbols-outlined text-white cursor-pointer lg:hidden">menu</button>          
        <div class="flex items-center ml-auto">
          <div @click="toggleMenu" class="relative rounded-full cursor-pointer inline-block">
            <img class="h-12 w-12 rounded-full" src="../assets//solutionGrayLOGO-removebg.png" alt="Profile Picture"/>
            <i class="material-symbols-outlined  text-white absolute bottom-0 right-0 transform translate-x-2 translate-y-2">
                expand_more
            </i>
        </div>
          <!-- MenuOptions -->
          <MenuOptions v-if="isMenuVisible" class="absolute top-24 right-0 z-50" />
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import MenuOptions from './User/MenuOptions.vue';

export default {
  name: 'NavBar',
  components: {
    MenuOptions
  },
  data() {
    return {
      userName: null,
      isMenuVisible: false,
      menuUser: false
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
    },
    isLogin() {
      const session = this.$store.getters.userSession;
      if (session) {
        this.userName = session.name;
      }
    },
    menuUserFun() {
      this.menuUser = !this.menuUser;
      this.$emit('toggle-menu');
    }
  }
};
</script>
