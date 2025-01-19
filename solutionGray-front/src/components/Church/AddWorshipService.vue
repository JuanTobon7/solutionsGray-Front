<template>
    <section class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm  z-50">
        <div class="container h-[95vh] w-full sm:px-6 flex items-center justify-center">
            <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full sm:min-w-[70%] flex flex-col max-h-full overflow-y-auto">
                <div class="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 class="text-lg sm:text-xl font-semibold text-gray-800">{{ !group?'Formulario de Creación de Cultos':'Formulario de Creación de Servicios' }}</h2>
                    <span @click="close" class="material-symbols-outlined text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200">close</span>
                </div>
                <div class="flex-grow flex flex-col overflow-y-auto">
                    <Stepper class="flex-grow">
                        <StepperPanel :header="stepperHeader">
                            <template #content="{ nextCallback }">
                                <div class="flex-grow mb-4 sm:mb-8">
                                    <SheduleServiceWorship
                                        :group="group"
                                    />
                                </div>
                                <div class="flex justify-end">
                                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" class="p-button-primary" @click="nextCallback" />
                                </div>
                            </template>
                        </StepperPanel>
                        <StepperPanel header="Servidores">
                            <template #content="{ prevCallback, nextCallback }">
                                <div class="flex-grow flex flex-col">
                                    <AssingServices 
                                        :group="group"
                                    />
                                </div>
                                <div class="flex justify-between mt-4 sm:mt-6">
                                    <Button label="Atrás" icon="pi pi-arrow-left" class="p-button-secondary" @click="prevCallback" />
                                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" class="p-button-primary" @click="nextCallback" />
                                </div>
                            </template>
                        </StepperPanel>
                        <StepperPanel header="Confirmación">
                            <template #content="{ prevCallback }">
                                <div class="flex-grow flex flex-col">
                                    <ConfirmationWorshipService
                                        :group="group"
                                        @worshipRegistered="close"
                                    />
                                </div>
                                <div class="flex justify-between mt-4 sm:mt-6">
                                    <Button label="Atrás" icon="pi pi-arrow-left" class="p-button-secondary" @click="prevCallback" />
                                </div>
                            </template>
                        </StepperPanel>
                    </Stepper>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Button from 'primevue/button';
import SheduleServiceWorship from '../subComponents/SheduleServiceWorship.vue';
import AssingServices from '../subComponents/AssingServices.vue';
import ConfirmationWorshipService from '../subComponents/ConfirmationWorshipService.vue';
import store from '@/store/index';

export default {
    props:{
        group: {
            type: Object,
            default: null
        }
    },
  components: {
      Stepper,
      StepperPanel,
      Button,
      SheduleServiceWorship,
      AssingServices,
      ConfirmationWorshipService
  },
  computed: {
    stepperHeader() {
      return !this.group ? 'Agendar Culto' : 'Agendar Servicio';
    }
  },
  methods:{
    close(){
        store.dispatch('flushAssignedServices');
        store.dispatch('flushWorshipService');
        this.$emit('close');
    }
  },
  mounted(){
    console.log('group in AddWorshipService',this.group);
  }
}
</script>
