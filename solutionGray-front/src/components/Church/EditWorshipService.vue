<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-lg min-w-[70%] flex flex-col">
          <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-800">Formulario de Edicion de Cultos</h2>
              <span @click="close" class="material-symbols-outlined text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200">close</span>
          </div>
          <div class="flex-grow flex flex-col">
              <Stepper class="flex-grow">
                  <StepperPanel header="Agendar Culto">
                      <template #content="{ nextCallback }">
                          <div class="flex-grow mb-8">
                              <SheduleServiceWorship 
                              :worshipService="worshipService"
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
                              <ConfirmationWorshipService
                              :edit="true"
                              />
                          </div>
                          <div class="flex justify-between mt-6">
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
import {getServices} from '@/apiServices/index'
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Button from 'primevue/button';
import SheduleServiceWorship from '../subComponents/SheduleServiceWorship.vue';
import AssingServices from '../subComponents/AssingServices.vue';
import ConfirmationWorshipService from '../subComponents/ConfirmationWorshipService.vue';
import store from '@/store/index'

export default {
  props: {
      worshipService: {
          type: Object,
          required: true
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
  methods:{
    close(){
        store.dispatch('flushAssignedServices')
        store.dispatch('flushWorshipService')
        this.$emit('close')
    },
    async getAssignedServices(){
        try{            
            const response = await getServices(this.worshipService.id)
            const service = response.map((service) => {
                return {
                    person: {
                        id: service.id,
                        first_name: service.first_name,                        
                        last_name: service.last_name,
                        email: service.email,
                        phone: service.phone,
                        type_person_id: service.type_person_id,
                        state_id: service.state_id,
                        church_id: service.church_id,
                    } ,
                    service: {
                        id: service.rol_id,
                        name: service.rol_servant,
                    }
                }
            })
            console.log('EPA assigned services',service)
            store.dispatch('addAssignedServices', service)
        }catch(e){
            console.log(e)
        }
    }
  },
  mounted() {
    console.log('EPA worshipService',this.worshipService)
    this.getAssignedServices()
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
