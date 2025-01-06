<template>
    <MenuUser :model="items" class="w-[35vh] bg-primary-200 rounded-md mr-2 p-4 personal-animated">
        <template #start>
            <div class="flex items-center gap-4 mb-4 border-b-2 border-b-primary-300">
                <img src="https://vid-de-fe.s3.us-east-2.amazonaws.com/photos/solutionGrayLOGO-removebg.png" alt="Picture User" class="w-12">
                <span class="text-primary-900 text-xl">{{ user.name }}</span>
            </div>
        </template>              
        <template #item="{ item }">
            <a 
                class="flex items-center gap-3 hover:bg-primary-300 p-2 cursor-pointer rounded-md"
                @click="handleClick(item)">
                <span class="text-primary-900" :class="item.icon"></span>
                <span class="text-primary-900">{{ item.label }}</span>
            </a>
        </template>
    </MenuUser>
</template>

<script>
import MenuUser from 'primevue/menu';
import { logout } from '@/apiServices';

export default {
    components: {
        MenuUser
    },
    data() {
        return {
            user: {},
            items: [
                {
                    label: 'Perfil',
                    icon: 'pi pi-user',
                    path: '/profile'
                },
                {
                    label: 'Configuraciones',
                    icon: 'pi pi-cog',
                    path: '/configuration'
                },
                {
                    label: 'Cerrar Sesión',
                    icon: 'pi pi-sign-out',
                    action: 'logout' // Identificador para la acción
                }
            ]
        };
    },
    methods: {
        getUser() {
            const session = this.$store.getters.userSession;

            if (!session) {
                return false;
            }

            const user = JSON.parse(session);
            this.user = user;
            return true;
        },
        async logout() {
            await logout();
            this.$router.push('/');
        },
        handleClick(item) {
            if (item.action === 'logout') {
                this.logout();
            } else if (item.path) {
                this.$router.push(item.path);
            }
        }
    },
    mounted() {
        this.getUser();
    }
};
</script>
