<template>
  <aside class="bg-primary-700 w-[80%] md:w-[40%] lg:w-[13%] fixed h-full py-2 flex flex-col gap-2 z-10">
    <!-- Botón para cerrar el menú en pantallas pequeñas -->
    <div class="flex justify-end pr-4 pt-4 lg:hidden">
      <button @click="$emit('close')" class="material-symbols-outlined cursor-pointer text-primary-50 hover:text-primary-300">
        close
      </button>
    </div>

    <!-- Logo y Rol -->
    <section class="flex flex-col items-center p-4">
      <img src="../assets/solutionGrayLOGO-removebg.png" class="sm:w-15 sm:h-15 md:w-[30vh]" alt="Logo">
      <h2 class="text-2xl font-semibold text-primary-50">{{ rol }}</h2>
    </section>

    <!-- Menú de Navegación -->
    <nav>
      <ul class="text-primary-50 text-xl">
        <!-- Inicio -->
        <li class="px-4 py-2 hover:bg-primary-600 flex items-center gap-4 cursor-pointer">
          <i class="material-symbols-outlined">home</i>
          <router-link to="/" class="block hover:text-primary-300">Inicio</router-link>
        </li>

        <!-- Church -->
        <li 
          @click="toggleMenu('church')" 
          class="px-4 py-2 flex items-center justify-between gap-4 hover:bg-primary-600 cursor-pointer" 
          :class="{ 'bg-primary-600': activeMenu === 'church' }"
        >
          <div class="flex items-center gap-4">
            <i class="material-symbols-outlined">church</i>
            <span>Church</span>
          </div>
          <i class="material-symbols-outlined transition-transform duration-300" :class="{ 'rotate-90': activeMenu === 'church' }">chevron_right</i>
        </li>
        <div v-if="activeMenu === 'church'" class="pl-6 transition-all duration-300 overflow-hidden">
          <ul>
            <li v-for="item in menuItemsChurch" :key="item.label" @click="redirectTo(item.path)" class="list-disc  list-inside  hover:bg-primary-600 px-2 py-2 rounded-md cursor-pointer hover:text-primary-300">
              {{ item.label }}
            </li>
          </ul>
        </div>

        <!-- Grupos -->
        <li 
          @click="toggleMenu('groups')" 
          class="px-4 py-2 flex items-center justify-between gap-4 hover:bg-primary-600 cursor-pointer" 
          :class="{ 'bg-primary-600': activeMenu === 'groups' }"
        >
          <div class="flex items-center gap-4">
            <i class="material-symbols-outlined">communities</i>
            <span>Grupos</span>
          </div>
          <i class="material-symbols-outlined transition-transform duration-300" :class="{ 'rotate-90': activeMenu === 'groups' }">chevron_right</i>
        </li>
        <div v-if="activeMenu === 'groups'" class="pl-6 transition-all duration-300 overflow-hidden">
          <ul>
            <li v-for="item in menuItemsGroups" :key="item.label" @click="redirectTo(item.path)" class="list-disc  list-inside hover:bg-primary-600 px-2 py-2 rounded-md cursor-pointer hover:text-primary-300">
              {{ item.label }}
            </li>
          </ul>
        </div>

        <!-- People -->
        <li 
          @click="toggleMenu('people')" 
          class="px-4 py-2 flex items-center justify-between gap-4 hover:bg-primary-600 cursor-pointer" 
          :class="{ 'bg-primary-600': activeMenu === 'people' }"
        >
          <div class="flex items-center gap-4">
            <i class="material-symbols-outlined">groups</i>
            <span>People</span>
          </div>
          <i class="material-symbols-outlined transition-transform duration-300" :class="{ 'rotate-90': activeMenu === 'people' }">chevron_right</i>
        </li>
        <div v-if="activeMenu === 'people'" class="pl-6 transition-all duration-300 overflow-hidden">
          <ul>
            <li v-for="item in menuItemsPeople" :key="item.label" @click="redirectTo(item.path)" class="list-disc  list-inside hover:bg-primary-600 px-2 py-2 rounded-md cursor-pointer hover:text-primary-300">
              {{ item.label }}
            </li>
          </ul>
        </div>

        <!-- Cursos -->
        <li 
          @click="toggleMenu('curses')" 
          class="px-4 py-2 flex items-center justify-between gap-4 hover:bg-primary-600 cursor-pointer" 
          :class="{ 'bg-primary-600': activeMenu === 'curses' }"
        >
          <div class="flex items-center gap-4">
            <i class="material-symbols-outlined">book</i>
            <span>Cursos</span>
          </div>
          <i class="material-symbols-outlined transition-transform duration-300" :class="{ 'rotate-90': activeMenu === 'curses' }">chevron_right</i>
        </li>
        <div v-if="activeMenu === 'curses'" class="pl-6 transition-all duration-300 overflow-hidden">
          <ul>
            <li v-for="item in menuItemsCurses" :key="item.label" @click="redirectTo(item.path)" class="list-disc  list-inside hover:bg-primary-600 px-2 py-2 rounded-md cursor-pointer hover:text-primary-300">
              {{ item.label }}
            </li>
          </ul>
        </div>

        <!-- Ingresos -->
        <li 
          @click="toggleMenu('ingresos')" 
          class="px-4 py-2 flex items-center justify-between gap-4 hover:bg-primary-600 cursor-pointer" 
          :class="{ 'bg-primary-600': activeMenu === 'ingresos' }"
        >
          <div class="flex items-center gap-4">
            <i class="material-symbols-outlined">payments</i>
            <span>Ingresos</span>
          </div>
          <i class="material-symbols-outlined transition-transform duration-300" :class="{ 'rotate-90': activeMenu === 'ingresos' }">chevron_right</i>
        </li>
        <div v-if="activeMenu === 'ingresos'" class="pl-6 transition-all duration-300 overflow-hidden">
          <ul>
            <li v-for="item in menuItemsIngresos" :key="item.label" @click="redirectTo(item.path)" class="list-disc  list-inside hover:bg-primary-600 px-2 py-2 rounded-md cursor-pointer hover:text-primary-300">
              {{ item.label }}
            </li>
          </ul>
        </div>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'MenuUser',
  data() {
    return {
      rol: null,
      activeMenu: null, // Menú actualmente abierto
      menuItemsChurch: [
        { label: 'Mi iglesia', path: '/my-church' },
        { label: 'Cultos', path: '/worship-services' },
      ],
      menuItemsGroups: [
        { label: 'Grupo 1', path: '/group-1' },
        { label: 'Grupo 2', path: '/group-2' },
      ],
      menuItemsPeople: [
        { label: 'Servidores', path: '/servants' },
        { label: 'Ovejas', path: '/sheeps' },
      ],
      menuItemsCurses: [
        { label: 'Cursos', path: '/courses' },
        { label: 'Mis Cursos', path: '/my-courses' },
        {label: 'Cursos a Cargo',path: '/courses-in-charge'},
      ],
      menuItemsIngresos: [
        { label: 'Reportes', path: '/income-statement' },
        { label: 'Transacciones', path: '/transactions' },
      ],
    };
  },
  methods: {
    toggleMenu(menuName) {
      this.activeMenu = this.activeMenu === menuName ? null : menuName;
    },
    redirectTo(path) {
      this.$router.push(path);
    },
  },
  mounted() {
    const session = this.$store.getters.userSession;
    if (session) this.rol = JSON.parse(session).rol;
  },
};
</script>

<style scoped>
.ul {
  @apply list-disc;
}
</style>