<template>
    <section
      ref="reportSection"
      class="container p-6 bg-white"
      style="position: absolute; top: -9999px; left: -9999px;"
    >
    <div class="grid grid-cols-3 mb-8 items-center">
      <img 
        src="https://s3.us-east-2.amazonaws.com/viddefe.com/photos/solutionGrayLOGO-removebg.png" 
        class="w-20" 
        alt="Logo de Vid de Fe" 
      />
      <h2 class="text-2xl font-semibold text-center">
        Informe Financiero General {{ churchName }}
      </h2>
    </div>

    <div>
      <p class="text-lg mb-4">
        Este informe financiero ha sido elaborado el día <span class="font-medium">{{ dateC }}</span>, 
        bajo la supervisión de <span class="font-medium">{{ userName }}</span>, 
        con base en los registros proporcionados por la iglesia 
        <span class="font-medium">{{ churchName }}</span> a través de la aplicación 
        <strong class="text-primary-950">Vid de Fe</strong>.
      </p>

      <p class="text-lg mb-4">
        Este documento tiene como propósito presentar un resumen detallado sobre los ingresos, 
        gastos y estado financiero de la congregación durante el año <strong>{{ yearProp }}</strong> evaluado. 
        Está dirigido tanto a la iglesia local como a la iglesia madre, proporcionando una visión 
        integral del uso de los recursos y su impacto en el ministerio.
      </p>
    </div>        

    <div class="mb-10">
      <p class="text-lg">
        Agradecemos a todos los contribuyentes y miembros de la iglesia por su compromiso con la obra de Dios. 
        Su fidelidad y generosidad han permitido financiar actividades ministeriales, alcanzar nuevas almas 
        y mantener el crecimiento de la iglesia.
      </p>
    </div>

    <DataTable :value="tableData" class="mb-12">
      <Column field="type_contribution" header="Tipo de Contribución" />
      <Column field="currency" header="Moneda" />
      <Column field="total" header="Total" />
    </DataTable>

    <div>
      <p class="text-lg mb-6">
        Invitamos a continuar utilizando <strong class="text-primary-950">Vid de Fe</strong> como una herramienta 
        que facilita la administración financiera y promueve el crecimiento espiritual de nuestra comunidad.
      </p>
      <p class="text-md text-center italic">
        "Dad, y se os dará; medida buena, apretada, remecida y rebosando darán en vuestro regazo. Porque con la medida con que medís, os será medido."  
      </p>
      <p class="text-md text-center font-semibold mb-10">
        Lucas 6:38
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
import DataTable from 'primevue/datatable';
import html2canvas from 'html2canvas';
import Column from 'primevue/column';

export default {
  components: {
    DataTable,
    Column,
  },
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
    date: {
      type: String,
      required: true,
    },
    churchName: {
      type: String,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.downloadReport();
    this.$toast.add({
      severity: 'success',
      summary: 'Informe descargado',
      detail: 'El informe financiero ha sido descargado con éxito.',
    });
  },
  methods: {
    async downloadReport() {
      const section = this.$refs.reportSection;

      try {
        // Crear canvas con html2canvas
        const canvas = await html2canvas(section, {
          scale: 2, // Mejora la resolución del PDF
          useCORS: true, // Permite cargar imágenes externas como el logo
        });

        // Convertir el canvas a imagen
        const imageData = canvas.toDataURL('image/png');

        // Crear el archivo PDF con jsPDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calcular proporciones de la imagen
        const canvasRatio = canvas.width / canvas.height;
        const adjustedHeight = pdfWidth / canvasRatio;

        // Agregar la imagen al PDF
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
        pdf.save(`Informe_${this.churchName}_${this.date}.pdf`);
      } catch (error) {
        console.error('Error al generar el informe:', error);
      }
    },
  },

};
</script>