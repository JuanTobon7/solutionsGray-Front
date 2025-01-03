<template>
  <nav class="w-full bg-primary-950 bg-opacity-90 backdrop-blur-sm p-4 fixed top-0 left-0 right-0 z-50">
    <div class="container flex items-center justify-between">
      <!-- Logo and Name -->
      <div class="flex items-center gap-4 w-1/2">
        <img 
          src="../assets/solutionGrayLOGO-removebg.png" 
          alt="Logo" 
          class="h-12 w-12 rounded-full" 
        />
        <span class="text-white font-semibold text-lg">Ekklesia</span>
      </div>

      <!-- Hamburger Icon -->
      <button
        class="text-white md:hidden focus:outline-none"
        @click="toggleMenu"
      >
        <i class="material-symbols-outlined text-3xl">menu</i>
      </button>

      <!-- Navigation Menu -->
      <ul
        :class="[
          'md:flex gap-6 items-center',
          menuOpen ? 'block' : 'hidden',
          'absolute md:static top-16 left-0 right-0 bg-primary-950 md:bg-transparent md:backdrop-blur-none backdrop-blur-sm md:opacity-100 p-4 md:p-0 z-50'
        ]"
      >
      <li @click="scrollTo('start')">
        <span class="labels cursor-pointer">Inicio</span>
      </li>
      <li @click="scrollTo('ekklesia')">
        <span class="labels cursor-pointer">¿Qué Somos?</span>
      </li>
      <li @click="scrollTo('contact')">
        <span class="labels cursor-pointer">Contáctanos</span>
      </li>
      <li @click="scrollTo('why-ekklesia')">
        <span class="labels cursor-pointer">
          Características
        </span>
      </li>
        <li class="text-white md:hidden px-4 py-2 hover:bg-primary-500 flex items-center gap-2 rounded-md">
          <button @click="to('/login')" class="flex items-center gap-2">
            Login
            <i class="material-symbols-outlined">login</i>
          </button>
        </li>
      </ul>

      <!-- Login Button (Visible on large screens) -->
      <button
        @click="to('/login')"
        class="hidden md:flex text-white px-4 py-2 rounded-md hover:bg-primary-500 items-center gap-2"
      >
        Login
        <i class="material-symbols-outlined">login</i>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false, // State to toggle the menu
    };
  },
  methods: {
    to(path) {
      this.$router.push(path);
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    scrollTo(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

      }
    },
  },
};
</script>

<style>
/* Optional: Smooth menu transition for smaller screens */
nav ul {
  transition: all 0.3s ease-in-out;
}
.labels{
  @apply text-white px-4 py-2 rounded-md hover:bg-primary-500 cursor-pointer;
}
</style>
