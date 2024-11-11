<template>
  <aside class="bg-primary-700 w-[80%] md:w-[40%] lg:w-[13%] fixed h-full py-2 flex flex-col gap-2 z-10">
    <!-- Botón para cerrar el menú en pantallas pequeñas -->
    <div class="flex justify-end pr-4 pt-4 lg:hidden">
      <button @click="$emit('close')" class="material-symbols-outlined cursor-pointer text-primary-50">close</button>
    </div>

    <!-- Sección del logo y rol del usuario -->
    <section class="flex flex-col items-center p-4">
      <img src="../assets/solutionGrayLOGO-removebg.png" class="sm:w-15 sm:h-15 md:w-[30vh]" alt="Logo">
      <h2 class="text-2xl font-semibold text-primary-50">{{ rol }}</h2>
    </section>

    <!-- Menú de navegación -->
    <nav>
      <ul class="text-primary-50 text-xl">
        <!-- Sección de la iglesia -->
        <li @click="toggleChurchMenu" class="px-4 py-2 hover:bg-primary-600 flex flex-col gap-4">
          <div class="flex items-center gap-4"> 
            <i class="material-symbols-outlined text-primary-50">church</i>
            <span>Church</span>
          </div>
        </li>
        <div v-if="showMenuChurch" class="pl-6 w-full flex flex-col">
          <ul class="list-disc list-inside mb-2 w-auto px-2">
            <li 
              @click="redirectTo(item.path)" 
              v-for="item in menuItemsChurch" 
              :key="item.label" 
              class="text-primary-50 px-2 py-2 hover:bg-primary-600 transition-all duration-300 rounded-md w-full">
              {{ item.label }}
            </li>
          </ul>
        </div>
        <!-- Sección de Grupos -->
        <li @click="toogleGroupsMenu" class="px-4 py-2 hover:bg-primary-600 flex flex-col gap-4">
          <div class="flex items-center gap-4"> 
            <i class="material-symbols-outlined text-primary-50">communities</i>
            <span>Grupos</span>
          </div>
        </li>
        <div v-if="showGroupsMenu" class="pl-6 w-full flex flex-col">
          <ul class="list-disc list-inside mb-2 w-auto px-2">
            <li 
              @click="redirectTo(item.path)" 
              v-for="item in menuItemsChurch" 
              :key="item.label" 
              class="text-primary-50 px-2 py-2 hover:bg-primary-600 transition-all duration-300 rounded-md w-full">
              {{ item.label }}
            </li>
          </ul>
        </div>

        <!-- Sección combinada de "People" -->
        <li @click="togglePeopleMenu" class="px-4 py-2 hover:bg-primary-600 flex flex-col gap-4">
          <div class="flex items-center gap-4"> 
            <i class="material-symbols-outlined text-primary-50">groups</i>
            <span>People</span>
          </div>
        </li>
        <div v-if="showMenuPeople" class="pl-6 w-full flex flex-col">
          <ul class="list-disc list-inside mb-2 w-auto px-2">
            <li 
              @click="redirectTo(item.path)" 
              v-for="item in menuItemsPeople" 
              :key="item.label" 
              class="text-primary-50 px-2 py-2 hover:bg-primary-600 transition-all duration-300 rounded-md w-full">
              {{ item.label }}
            </li>
          </ul>
        </div>

        <!-- Enlaces de menú adicionales -->
        <li @click="toogleCursesMenu" class="px-4 py-2 hover:bg-primary-600 flex flex-col gap-4">
          <div class="flex items-center gap-4"> 
            <i class="material-symbols-outlined text-primary-50">book</i>
            <span>Cursos</span>
          </div>
        </li>
        <div v-if="showMenuCurses" class="pl-6 w-full flex flex-col">
          <ul class="list-disc list-inside mb-2 w-auto px-2">
            <li 
              @click="redirectTo(item.path)" 
              v-for="item in menuItemsCurses" 
              :key="item.label" 
              class="text-primary-50 px-2 py-2 hover:bg-primary-600 transition-all duration-300 rounded-md w-full">
              {{ item.label }}
            </li>
          </ul>
        </div>
        <li class="px-4 py-2 hover:bg-primary-600 flex items-center gap-4">
          <i class="material-symbols-outlined">paid</i>
          <router-link to="/settings" class="block">Ingresos</router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'MenuUser',
  data(){
    return {
      rol: null,
      showMenuChurch: false,
      showMenuPeople: false,
      showGroupsMenu: false,
      showMenuCurses: false,
      menuItemsChurch: [
        { label: 'Mi iglesia', path: '/my-church' },
        { label: 'Cultos', path: '/worship-services' }
      ],
      menuItemsPeople: [
        { label: 'Servidores', path: '/servants' },
        { label: 'Ovejas', path: '/sheeps' },
        { label: 'Mis ovejas', path: '/my-sheeps' }
      ],
      menuItemsCurses: [
        { label: 'Cursos', path: '/curses' },
        { label: 'Cursos Inscritos', path: '/my-courses' },
        {label: 'Curso a Cargo', path: '/courses-in-charge'}
      ]
    };
  },
  methods: {
    getRol() {
      const session = this.$store.getters.userSession;
      if (!session) {
        return false;
      }
      const user = JSON.parse(session);
      this.rol = user.rol;
      return true;
    },
    toggleChurchMenu() {
      this.showMenuChurch = !this.showMenuChurch;
    },
    togglePeopleMenu() {
      this.showMenuPeople = !this.showMenuPeople;
    },
    toogleGroupsMenu() {
      this.showGroupsMenu = !this.showGroupsMenu;
    },
    toogleCursesMenu() {
      this.showMenuCurses = !this.showMenuCurses;
    },
    redirectTo(path) {
      this.$router.push(path);
    }
  },
  mounted() {
    this.getRol();
  }
};
</script>

<style scoped>
li {
  @apply cursor-pointer;
}
i {
  unicode-bidi: isolate;
}
</style>
