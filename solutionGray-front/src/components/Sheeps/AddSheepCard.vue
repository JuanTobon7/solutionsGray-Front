<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="container px-2 mx-auto max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl overflow-hidden flex items-center justify-center">
            <div class="relative bg-white sm:px-10 pt-4 sm:pt-2 pb-3 rounded-lg shadow-lg max-h-[95vh] overflow-auto px-3">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-gray-800">Formulario de Registro</h2>
                    <span @click="closeForm" class="material-symbols-outlined text-2xl cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200">close</span>
                </div>
                <div class="flex-grow flex flex-col">
                    <Stepper v-model:activeIndex="currentStep" class="flex-grow">
                        <StepperPanel header="Persona">
                            <template #content="{ nextCallback }">
                                <div class="flex-grow mb-4">
                                    <SelectPerson />
                                </div>
                                <div class="flex justify-end">
                                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" class="p-button-primary" @click="nextCallback" />
                                </div>
                            </template>
                        </StepperPanel>
                        <StepperPanel header="Guía Espiritual">
                            <template #content="{ prevCallback, nextCallback }">
                                <div class="flex-grow flex flex-col mb-4">
                                    <SelectServant />
                                </div>
                                <div class="flex justify-between">
                                    <Button label="Atrás" icon="pi pi-arrow-left" class="p-button-secondary" @click="prevCallback" />
                                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" class="p-button-primary" @click="nextCallback" />
                                </div>
                            </template>
                        </StepperPanel>
                        <StepperPanel header="Confirmación">
                            <template #content="{ prevCallback }">
                                <div class="flex-grow flex flex-col">
                                    <ConnfirmationSheep
                                        @close="closeForm"
                                    />
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
    </div>
</template>

<script>
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Button from 'primevue/button';
import SelectPerson from '../subComponents/SelectPerson.vue';
import SelectServant from '../subComponents/SelectServant.vue';
import ConnfirmationSheep from '../subComponents/ConnfirmationSheep.vue';

export default {
    data() {
        return {
            currentStep: 0, // Step index starts from 0
        };
    },
    components: {
        Stepper,
        StepperPanel,
        Button,
        SelectPerson,
        SelectServant,
        ConnfirmationSheep
    },
    methods: {
        closeForm() {
            this.currentStep = 0; // Reset to the first step
            this.$emit('close'); // Emit the close event to parent
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
