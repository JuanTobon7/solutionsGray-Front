<template>
    <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div class="container h-[95vh] w-full sm:px-6  flex items-center justify-center">
            <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
                <div class="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Formulario de Creación de Cultos</h2>
                    <span @click="$emit('close')" class="material-symbols-outlined text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200">close</span>
                </div>
            </div>
        </div>
    </section>
</template>