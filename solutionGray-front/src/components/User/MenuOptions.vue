<template>
    <MenuUser :model="items" class="w-[35vh] bg-primary-200 rounded-md mr-2 p-4 personal-animated">
        <template #start>
            <div class="flex items-center gap-4 mb-4 border-b-2 border-b-primary-300">
                <img src="../../assets/solutionGrayLOGO-removebg.png" alt="Picture User"  class="w-12">
                <span class="text-primary-900 text-xl">{{ user.name }}</span>
            </div>
        </template>              
        <template #item="{ item, props }">
            <a class="flex items-center gap-3 hover:bg-primary-300 p-2 cursor-pointer rounded-md">
                <span class="text-primary-900" :class="item.icon" />
                <span class="text-primary-900">{{ item.label }}</span>
            </a>
        </template>

    </MenuUser>
</template>

<script>
import MenuUser from 'primevue/menu';
export default{
    components:{
        MenuUser
    },
    data(){
        return {
            user: {},
            items: [
                {
                    label: 'Perfil',
                    icon: 'pi pi-user',
                    path: '/user/profile'
                },
                {
                    label: 'Configuraciones',
                    icon: 'pi pi-cog',
                    path: '/user/settings'
                },
                {
                    label: 'Cerrar Sesión',
                    icon: 'pi pi-sign-out',
                    path:   '/'
                }
            ]
        }
    },
    methods:{
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
}
</script>