<template>
  <section class="w-full">
    <div 
      class="fixed top-0 right-0 w-full bg-primary-500 py-5 z-10 transition-all duration-300 ease-in-out"
      :class="menuUser ? 'translate-x-0 pl-40' : ''"
    >
      <nav class="flex justify-between items-center container">
        <div class="flex items-center text-white gap-4">          
          <button @click="menuUserFun" class="material-symbols-outlined text-white cursor-pointer">menu</button>
          <span class="text-xl font-semibold">Hola {{ user.name }} 👋</span>       
        </div>
        <div class="flex items-center ml-auto">
          <div @click="toggleMenu" class="relative rounded-full cursor-pointer inline-block">
            <img class="h-12 w-12 rounded-full" src="https://s3.us-east-2.amazonaws.com/viddefe.com/photos/solutionGrayLOGO-removebg.png" alt="Profile Picture"/>
            <i class="material-symbols-outlined text-white absolute bottom-0 right-0 transform translate-x-2 translate-y-2">
                expand_more
            </i>
          </div>
          <MenuOptions 
            v-if="isMenuVisible" 
            @closeOpt="isMenuVisible = false" 
            class="absolute top-24 right-0 z-50 transition-opacity duration-300" 
          />
        </div>
      </nav>
    </div>
  </section>

  <MenuUser 
    v-if="menuUser"
    class="transition-transform duration-300 ease-in-out"
    :class="menuUser ? 'translate-x-0' : '-translate-x-full'"
    @close="menuUserFun"
  />
</template>


<script>
import MenuOptions from './User/MenuOptions.vue';
import MenuUser from './MenuUser.vue';

export default {
  name: 'NavBar',
  components: {
    MenuOptions,
    MenuUser,
  },
  data() {
    return {
      userName: null,
      isMenuVisible: false,
      menuUser: true,
      user: {},
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
    },
    menuUserFun() {
      this.menuUser = !this.menuUser;
      this.$emit('close',this.menuUser);
    },
    getUser() {
      const session = this.$store.getters.userSession;

      if (!session) {
        return false;
      }

      const user = JSON.parse(session);
      this.user = user;
      return true;
    },
  },    
  mounted(){
    this.getUser()
  }
};
</script>
