<template>
    <section class="w-full md:max-w-6xl container">
      <!-- Header Section -->
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-extrabold text-primary-800 mb-2">Tu Perfil</h1>
        <p class="text-lg text-gray-600">Gestiona tu información personal y actualiza tus datos fácilmente.</p>
      </div>
  
      <!-- Profile Picture and Info -->
      <div class="flex flex-col items-center gap-6">
        <div class="relative group">          
            <Avatar
              v-if="user.avatar"
              :image="avatar"
              size="xlarge"
              shape="circle"
              class="flex items-center justify-center w-60 h-60 rounded-full overflow-hidden"
            />
            <Avatar
              v-else
              :label="getInitials()"
              class="bg-primary-100 flex items-center justify-center text-primary-800 w-36 h-36 rounded-full overflow-hidden"
              size="xlarge"
              shape="circle"
            />
          <label
            for="avatar-upload"
            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity duration-200"
          >
            <span class="text-white font-semibold">Cambiar</span>
          </label>
          <input
            id="avatar-upload"
            type="file"
            class="hidden"
            @change="updateAvatar"
          />
        </div>
  
        <div class="flex flex-col items-center gap-2 mb-6">
          <span class="text-xl font-semibold text-gray-700">{{ user.first_name }} {{ user.last_name }}</span>
          <span class="text-sm text-gray-500">Email: {{ user.email }}</span>
        </div>
      </div>
  
      <!-- Edit Form Section -->
      <form @submit.prevent="saveProfile" class="mb-10 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="first-name" class="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                id="first-name"
                v-model="user.first_name"
                class="input-opt"
              />
            </div>
            <div>
              <label for="last-name" class="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                type="text"
                id="last-name"
                v-model="user.last_name"
                class="input-opt"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                v-model="user.email"
                class="input-opt"
              />
            </div>
            <div>
              <label for="birthdate" class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <input
                type="date"
                id="birthdate"
                v-model="user.birthdate"
                class="input-opt"
              />
            </div>
            <div>
              <label for="country" class="block text-sm font-medium text-gray-700">País</label>
              <input
                type="text"
                id="country"
                v-model="user.country_name"
                class="input-opt"
              />
            </div>
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700">Estado</label>
              <input
                type="text"
                id="state"
                v-model="user.state_name"
                class="input-opt"
              />
            </div>
            <div>
              <label for="church" class="block text-sm font-medium text-gray-700">Iglesia</label>
              <input
                type="text"
                id="church"
                v-model="user.church_name"
                class="input-opt"
              />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="tel"
                id="phone"
                v-model="user.phone"
                class="input-opt"
              />
            </div>           
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">Estado/Departamento</label>
              <input
                type="text"
                id="city"
                v-model="user.state_name"
                class="input-opt"
              />
            </div>
          </div>
          <div class="flex justify-center">
            <button
              type="submit"
              class="px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 transition duration-200"
            >
              Guardar Cambios
            </button>
          </div>
        </form>

        <div class="w-full max-w-4xl mx-auto flex flex-col items-center">
            <h2 class="text-2xl font-bold text-gray-800 text-center mb-4">Estadísticas de mis Servicios</h2>
            <div class="w-full relative" style="max-width: 600px;">
                <canvas id="radarChart"></canvas>
            </div>
        </div>
  </section>
</template>

<script>
import Avatar from 'primevue/avatar';
import { Chart } from 'chart.js';
import {getRatingByServant,getMyprofile,updatePhoto,deletePhoto} from '@/apiServices'

export default {
  name: 'ProfileView',
  components: {
    Avatar,
  },
  data() {
    return {
      user: {},
      rating: [],
      selectedFile: null,
    };
  },
  computed: {
    avatar(){
      return this.user.avatar
    }
  },
  methods: {
    async updateAvatar(event) {
      try {
        this.selectedFile = event.target.files[0];
        const formData = new FormData();
        formData.append('photo', this.selectedFile); // El nombre debe coincidir: 'file'
        if(!['image/jpeg', 'image/png'].includes(this.selectedFile.type)){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Solo se permiten imágenes en formato JPG o PNG' });
          return
        }
        if(this.user.avatar){
          await this.deleteAvatar()
        }
        if(formData.get('photo').size > 5000000){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'La imagen no debe pesar más de 5MB' });
          return
        }
        const response = await updatePhoto(formData);
        this.user.avatar = response.avatar;
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Foto de perfil actualizada', life: 3000 });
      } catch (e) {
        if (e.response.status === 401 && e.response.data.message === 'Token Expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo paso, intentalo de nuevo.' });
        }
      }
    },
    async deleteAvatar() {
      try {
        const fileName = this.user.avatar;
        await deletePhoto(fileName);
        this.user.avatar = null;
        this.$toast.add({ severity: 'success', summary: 'Éxito',
          detail: 'Foto de perfil eliminada', life: 3000 });
      } catch (e) {
        if (e.response.status === 401 && e.response.data.message === 'Token Expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo paso, intentalo de nuevo.' });
        }
      }
    },    
    getInitials() {
      return (
        (this.user.first_name?.charAt(0) || '') + (this.user.last_name?.charAt(0) || '')
      ).toUpperCase();
    },
    saveProfile() {
      alert('Perfil actualizado exitosamente');
    },
    async getRatingByServant(){
      try{
        const userId = this.user.id
        const rating = await getRatingByServant(userId)
        this.rating = rating
      }catch(e){
        if (e.response.status === 401 && e.response.data.message === 'Token Expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo paso, intentalo de nuevo.' });
        }
      }
    },
    async getMyprofile(){
      try{
        const response = await getMyprofile()
        this.user = response
      }catch(e){
        if (e.response.status === 401 && e.response.data.message === 'Token Expired') {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo paso, intentalo de nuevo.' });
        }
      }
    },
    renderRadarChart(){
      const ctx = document.getElementById('radarChart');
      const labels = this.rating.map((item) => item.rol_servant);
      const data = this.rating.map((item) => item.average_rating);
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Rating',
              data: data,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(54, 162, 235)',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            r: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  },
  async mounted() {
    await this.getMyprofile();
    await this.getRatingByServant();
    this.renderRadarChart();
  },
};
</script>

<style scoped>
.input-opt{
    @apply mb-1 p-2 w-full border rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500;
}
</style>