<template>
    <section class="w-full container">
        <h1 class="text-3xl text-primary-900 mb-4">
            <strong>Administrativa</strong>
        </h1>
        <p>
            Bienvenido a la sección administrativa de <strong>Vid de Fe</strong>. Aquí puedes gestionar los leads, 
            administrar la información de las iglesias y optimizar el flujo de trabajo en la organización de cultos. 
            Usa las herramientas disponibles para mantener el orden y asegurar un seguimiento efectivo de cada proceso.
        </p>
        <DataTable 
            :value="filteredLeads"
            :paginator="true"
            :rows="10"
        >
            <Column field="first_name" header="Primer Nombre" v-if="hasData('first_name')"></Column>
            <Column field="last_name" header="Primer Apellido" v-if="hasData('last_name')"></Column>
            <Column field="email" header="Email" v-if="hasData('email')"></Column>
            <Column field="church_name" header="Nombre de Iglesia" v-if="hasData('church_name')"></Column>
            <Column field="phone" header="Teléfono" v-if="hasData('phone')"></Column>
            <Column field="lead_status" header="Estado del Lead" v-if="hasData('lead_status')">
                <template #body="slotProps">
                    <select 
                        v-model="slotProps.data.lead_status"
                        @change="updateLead(slotProps.data)"
                        class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Rechazado">Rechazado</option>
                    </select>
                </template>
            </Column>
        </DataTable>
    </section>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { getLeads, updateLead } from '@/apiServices';

export default {
    name: 'AdministrativeView',
    components: {
        DataTable,
        Column,
    },
    data() {
        return {
            leads: [], // Lista de leads cargados desde el servidor
        };
    },
    computed: {
        filteredLeads() {
            // Filtra los leads para excluir aquellos que no tienen datos válidos
            return this.leads.filter(lead =>
                Object.values(lead).some(value => value !== null && value !== '')
            );
        },
    },
    methods: {
        async updateLead(lead) {
            try {
                const payload = {
                    leadId: lead.id,
                    status: lead.lead_status,
                };
                await updateLead(payload);
                console.log('hello im interesting')
                this.$toast.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Lead actualizado correctamente',
                    life: 3000,
                });
            } catch (error) {
                const { response } = error;
                if (response?.status === 401 && response?.data?.message === 'Token has expired') {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Ups, inténtalo de nuevo',
                        life: 3000,
                    });
                }
            }
        },
        async getLeads() {
            try {
                this.leads = await getLeads();
            } catch (error) {
                console.error('Error al cargar los leads:', error);
            }
        },
        hasData(field) {
            // Comprueba si algún lead tiene datos en el campo especificado
            return this.leads.some(lead => lead[field] !== null && lead[field] !== '');
        },
    },
    async mounted() {
        await this.getLeads();
    },
};
</script>
