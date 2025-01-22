<template>
  <section ref="reportSection" class="container p-6 bg-white">
    <div class="grid grid-cols-3 mb-8 items-center">
      <img 
        src="https://s3.us-east-2.amazonaws.com/viddefe.com/photos/solutionGrayLOGO-removebg.png" 
        class="w-20" 
        alt="Logo de Vid de Fe" 
      />
      <h2 class="text-2xl font-semibold text-center">
        Informe General {{ churchName }}
      </h2>
    </div>
    <div>
      <p class="text-lg mb-4">
        Este informe ha sido elaborado el día <span class="font-medium">{{ dateC }}</span>, 
        bajo la supervisión de <span class="font-medium">{{ userName }}</span>, 
        con base en los registros proporcionados por la iglesia 
        <span class="font-medium">{{ churchName }}</span> a través de la aplicación 
        <strong class="text-primary-950">Vid de Fe</strong>.
      </p>
  
      <p class="text-lg mb-4">
        Este documento tiene como propósito presentar un resumen detallado sobre las actividades, 
        tasas de crecimiento y logros alcanzados por la congregación durante el año <strong>{{ yearProp }}</strong> evaluado.  
        Está dirigido tanto a la iglesia local como a la iglesia madre, para proporcionar una visión 
        integral del impacto generado por el cuerpo de Cristo en esta comunidad.
      </p>
    </div>
    <div class="mb-10">
      <p class="text-lg">
        Agradecemos a todos los miembros de la iglesia por su compromiso en la obra de Dios. Su fidelidad y esfuerzo 
        han permitido alcanzar nuevas almas, fortalecer la fe y ampliar el ministerio de la iglesia.
      </p>
    </div>
    <div class="flex flex-wrap gap-2">
      <div v-for="items in chartImages" :key="items.tittle">
        <h3 class="text-2xl text-second-800 font-semibold">{{ items.tittle }}</h3>
        <div class="chart-container">
          <img :src="items.image" :alt="items.tittle" />
        </div>
      </div>
    </div>
    <div>
      <p class="text-lg mb-6">
        Invitamos a continuar utilizando <strong class="text-primary-950">Vid de Fe</strong> como una herramienta 
        que facilita la administración y promueve el crecimiento espiritual de nuestra comunidad.
      </p>
      <p class="text-md text-center italic">
        "Así que ni el que planta es algo, ni el que riega, sino Dios, que da el crecimiento."
      </p>
      <p class="text-md text-center font-semibold mb-10">
        1 Corintios 3:7
      </p>
      <p class="text-center">
        Este informe ha sido generado automáticamente por la aplicación <strong>Vid de Fe</strong>. 
        La información presentada se basa en los datos proporcionados por los usuarios y no hacemos responsables 
        a la aplicación ni a sus desarrolladores por posibles errores o inexactitudes en los registros presentados. 
        Se recomienda verificar los datos antes de tomarlos como definitivos.
      </p>
    </div>
  </section>
</template>

<script>
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  computed: {
    dateC() {
      return new Date().toLocaleDateString();
    },
    yearProp() {
      return new Date(this.date).getFullYear();
    },
    userName() {
      const user = this.$store.getters.user;
      return `${user.firstName} ${user.lastName}`;
    },
  },
  props: {
    externalRef: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    churchName: {
      type: String,
      required: true,
    },
    chartImages: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    // Esperar a que la sección se renderice
    this.downloadReport();
    this.$toast.add({
      severity: 'success',
      summary: 'Descarga iniciada',
      detail: 'El informe se está generando, por favor espere...',
      life: 5000,
    });
  },
  methods: {
    async downloadReport() {
      const section = this.$refs.reportSection;

      try {
        // Asegurarse de que las imágenes estén cargadas
        const promises = Array.from(section.querySelectorAll('img')).map((img) =>
          new Promise((resolve, reject) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = reject;
            }
          })
        );
        await Promise.all(promises);

        // Crear canvas con html2canvas
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          logging: true,
        });

        const imageData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasRatio = canvas.width / canvas.height;
        const adjustedHeight = pdfWidth / canvasRatio;

        if (adjustedHeight > pdfHeight) {
          const pages = Math.ceil(adjustedHeight / pdfHeight);
          for (let i = 0; i < pages; i++) {
            if (i > 0) pdf.addPage();
            pdf.addImage(
              imageData,
              'PNG',
              0,
              -i * pdfHeight,
              pdfWidth,
              adjustedHeight
            );
          }
        } else {
          pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, adjustedHeight);
        }

        // Descargar el archivo PDF
        pdf.save(`Informe_${this.churchName}_${this.dateC}.pdf`);
        this.$emit('close');
      } catch (e) {
        if(e){
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Ups algo ha pasado, intentelo de nuevo',life: 3000 });
        }
      }
    }

},


};
</script>

<style scoped>
.chart-container {
  @apply w-full h-96 mb-10;
}
</style>
