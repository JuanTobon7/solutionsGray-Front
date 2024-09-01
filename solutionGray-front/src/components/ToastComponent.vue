<template>
    <toast position="top-left">
      <template #message="slotProps">
        <div  :class="getToastClass(slotProps.message.severity)" class="flex flex-col animate-fade animate-duration-[800ms] animate-delay-[3000ms] animate-ease-linear animate-reverse"> 
          <div class="flex justify-between mb-2">
            <div class="flex items-center gap-2">         
              <i class="material-symbols-outlined">{{getItemClass(slotProps.message.severity)}}</i>
              <span>{{slotProps.message.severity}}</span>
            </div>
            <i 
              @click="customCloseAction(slotProps.message)"
              class="material-symbols-outlined text-right text-current cursor-pointer">
              close
            </i>
          </div>
          <p class="text-black px-3">{{ slotProps.message.detail }}</p>
        </div>
      </template>
      <template #closeButton></template>
    </toast>
</template>

<script>
export default{
    methods:{
      getToastClass(severity) {
        switch (severity) {
            case 'Error':
              return 'error';
            case 'Exitoso':
              return 'success';
            default:
              return 'info';
          }
        },
        getItemClass(severity){
        switch (severity) {
            case 'Error':
              return 'error';
            case 'Exitoso':
              return 'success';
            default:
              return 'info';
        }
      },
      customCloseAction(message) {
        this.$toast.remove(message);
      },
    }
}
</script>

<style scoped>
.error{
  @apply bg-red-100 bg-opacity-70 border border-red-500 text-red-800 p-4 rounded-lg ;
}

.success{
  @apply  bg-green-100 bg-opacity-70 border border-green-500 text-green-800  p-4 rounded-lg;
}

.info{
  @apply bg-gray-100 bg-opacity-70 border border-gray-500 text-gray-800  p-4 rounded-lg;
}
</style>