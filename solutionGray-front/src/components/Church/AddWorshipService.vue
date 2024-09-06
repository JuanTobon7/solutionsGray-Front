<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-lg min-w-[70%] flex flex-col">
          <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-800">Formulario de Creacion de Cultos</h2>
              <span @click="close" class="material-symbols-outlined text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200">close</span>
          </div>
          <div class="flex-grow flex flex-col">
              <Stepper class="flex-grow">
                  <StepperPanel header="Agendar Culto">
                      <template #content="{ nextCallback }">
                          <div class="flex-grow mb-8">
                              <SheduleServiceWorship />
                          </div>
                          <div class="flex justify-end">
                              <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" class="p-button-primary" @click="nextCallback" />
                          </div>
                      </template>
                  </StepperPanel>
                  <StepperPanel header="Servidores">
                      <template #content="{ prevCallback, nextCallback }">
                          <div class="flex-grow flex flex-col">
                              <AssingServices />
                          </div>
                          <div class="flex justify-between mt-6">
                              <Button label="Atrás" icon="pi pi-arrow-left" class="p-button-secondary" @click="prevCallback" />
                              <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" class="p-button-primary" @click="nextCallback" />
                          </div>
                      </template>
                  </StepperPanel>
                  <StepperPanel header="Confirmación">
                      <template #content="{ prevCallback }">
                          <div class="flex-grow flex flex-col">
                              <ConfirmationWorshipService/>
                          </div>
                          <div class="flex justify-start mt-6">
                              <Button label="Atrás" icon="pi pi-arrow-left" class="p-button-secondary" @click="prevCallback" />
                          </div>
                      </template>
                  </StepperPanel>
              </Stepper>
          </div>
      </div>
  </div>
</template>

<script>
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Button from 'primevue/button';
import SheduleServiceWorship from '../subComponents/SheduleServiceWorship.vue';
import AssingServices from '../subComponents/AssingServices.vue';
import ConfirmationWorshipService from '../subComponents/ConfirmationWorshipService.vue';
import store from '@/store/index'

export default {
  components: {
      Stepper,
      StepperPanel,
      Button,
      SheduleServiceWorship,
      AssingServices,
      ConfirmationWorshipService
  },
  methods:{
    close(){
        this.$store.dispatch('flushAssignedServices')
        this.$store.dispatch('flushWorshipService')
        this.$emit('close')
    }
  }
}
</script>

<style scoped>
.p-stepper {
  max-width: 100%;
  display: flex;
  flex-direction: column;
}
.material-symbols-outlined {
  font-size: 1.5rem;
}
</style>
