<template>
  <section class="w-full h-screen flex items-center justify-center bg-second-200">
    <div
      class="w-[60vh] h-auto md:h-[80vh] shadow-lg shadow-primary-900 rounded-lg bg-gradient-to-b from-primary-800 to-primary-600 p-8 flex flex-col items-center container"
    >
      <div class="flex justify-center mb-4">
        <img src="../assets/solutionGrayLOGO-removebg.png" class="h-[30vh] w-[30vh]" />
      </div>
      <div class="w-full flex flex-col items-center">
        <h1 class="text-center font-serif text-primary-50 text-5xl mb-8">
          <strong>Iniciar Sesión</strong>
        </h1>
        <form class="w-full max-w-sm">
          <div class="mb-4">
            <label class="block text-primary-50 text-md font-bold mb-2" for="email"> Email </label>
            <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div class="mb-6">
            <label class="block text-primary-50 text-md font-bold mb-2" for="password">
              Contraseña
            </label>
            <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="***********"
            />
          </div>
          <div class="flex items-center justify-around mb-8">
            <button
              class="bg-primary-400 hover:bg-primary-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Crear Cuenta
            </button>
            <button
              class="bg-primary-400 hover:bg-primary-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
        <span class="text-primary-50 hover:">Terminos y Condiciones de Privacidad</span>
      </div>
    </div>
  </section>
</template>
