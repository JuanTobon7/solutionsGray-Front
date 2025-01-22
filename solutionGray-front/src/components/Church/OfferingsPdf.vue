<template>
  <section ref="reportSection" class="container p-4 bg-white">
      <div class="grid grid-cols-3 mb-8 items-center">
            <img 
            src="https://s3.us-east-2.amazonaws.com/viddefe.com/photos/solutionGrayLOGO-removebg.png" 
            class="w-20" 
            alt="Logo de Vid de Fe" 
        />
          <h2 class="text-2xl font-semibold text-center">
              Informe Ofrendas en Cultos {{ churchName }}
          </h2>
      </div>
      <div>
          <p class="text-lg mb-4">
              Este informe ha sido elaborado el día <span class="font-medium">{{ dateNow }}</span>, 
              bajo la supervisión de <span class="font-medium">{{ userName }}</span>, 
              con base en los registros proporcionados por la iglesia 
              <span class="font-medium">{{ churchName }}</span> a través de la aplicación 
              <strong class="text-primary-950">Vid de Fe</strong>.
          </p>
      
          <p class="text-lg mb-4">
              Este documento tiene como propósito presentar un resumen detallado sobre las ofrendas recaudadas 
              durante el <strong>{{wh.worship_name}}</strong> realizados en el dia <strong>{{ date }}</strong>.  
              Está dirigido tanto a la iglesia local como a la iglesia madre, con el objetivo de proporcionar 
              una visión integral de la fidelidad de los contribuyentes y su impacto en el ministerio.
          </p>
      </div>
      <div class="mb-10">
          <p class="text-lg">
              Expresamos nuestro más sincero agradecimiento a todos los miembros de la iglesia que con alegría y compromiso 
              han participado en las ofrendas durante los cultos. Gracias a su generosidad, hemos podido alcanzar nuevas metas 
              ministeriales y fortalecer la obra de Dios en esta comunidad.
          </p>
      </div>      
      <div class="flex items-center justify-evenly gap-6 px-6 mb-10">
          <img :src="chartImage" alt="Gráfico de Ofrendas" class="w-[40vh]"/>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div class="bg-gray-50 p-4 rounded-md shadow-md text-center">
                  <p class="text-sm font-semibold text-gray-800">Total General</p>
                  <p class="text-2xl text-second-500"> $ {{getTotalOfferings() || '0.00'}}</p>
              </div>
              <div v-for="items in offerings" :key="items.type_contribution" class="bg-gray-50 p-4 rounded-md shadow-md text-center">
                  <p class="text-sm font-semibold text-gray-800">{{items.type_contribution}}</p>
                  <p class="text-2xl text-second-500">$ {{items.amount || '0.00'}}</p>
              </div>
          </div>
      </div>
      <DataTable :value="reportOfferings" class="mb-6">
          <Column field="firstName" header="Nombre"  />
          <Column field="lastName" header="Apellido"  />
          <Column field="cc" header="Cédula"  />
          <Column field="email" header="Correo Electrónico"  />
          <Column field="currency" header="Moneda"  />
          <Column field="amount" header="Monto" >
              <template #body="slotProps">
                  <p>{{ slotProps.data.symbol  + ' ' + slotProps.data.amount}}</p>
              </template>
          </Column>
      </DataTable>
      <div>
          <p class="text-lg mb-6">
              Invitamos a continuar utilizando <strong class="text-primary-950">Vid de Fe</strong> como una herramienta 
              para registrar y administrar los recursos de manera transparente, facilitando la obra de Dios en todos los niveles.
          </p>
          <p class="text-md text-center italic">
              "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre."
          </p>
          <p class="text-md text-center font-semibold mb-10">
              2 Corintios 9:7
          </p>
          <p>
              Este informe ha sido generado automáticamente por la aplicación <strong>Vid de Fe</strong>. 
              La información presentada se basa en los datos proporcionados por los usuarios y no hacemos responsables 
              a la aplicación ni a sus desarrolladores por posibles errores o inexactitudes en los registros presentados. 
              Se recomienda verificar los datos antes de tomarlos como definitivos.
          </p>
      </div>
  </section>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {getReportOfferings} from '@/apiServices';

export default {
  props: {      
      chartImage: {
          type: String,
          required: true
      },
      wh: {
          type: Object,
          required: true
      },
      peopleProp: {
          type: Array,
          required: true
      },
      offerings: {
          type: Array,
          required: true
      }
  },
  components: {
      DataTable,
      Column
  },
  computed: {
    churchName() {
        const user = this.$store.getters.user;
        return user.churchName;
    },
      date() {
          return new Date(this.wh.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
          });
      },
      dateNow() {
          return new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
          });
      },
      userName() {
          const user = this.$store.getters.user;
          return `${user.firstName} ${user.lastName}`;
      }
  },
  data() {
      return {
          reportOfferings: [],
          people: []
      };
  },
  mounted() {
      this.people = this.peopleProp;
      this.getReportOfferings().then(() => this.generatePDF());
  },
  methods: {
      getTotalOfferings() {      
          return this.offerings.reduce((acc, item) => acc + Number(item.amount ?? 0), 0).toFixed(2);
      },
      async getReportOfferings() {
          const data = await getReportOfferings(this.wh.id);
          this.reportOfferings = data.map((item) => {
              const person = this.people.find((p) => p.id === item.person_id);
              return {
                  ...item,
                  firstName: person?.first_name || '',
                  lastName: person?.last_name || '',
                  cc: person?.cc || '',
                  email: person?.email || ''
              };
          });
      },
      async generatePDF() {
        this.$toast.add({
            severity: 'success',
            summary: 'Generando PDF',
            detail: 'Por favor, espere un momento...',
            life: 3000
        });
        const section = this.$refs.reportSection;
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
        const canvas = await html2canvas(section, { scale: 4 });
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
        pdf.save(`Informe_Ofrendas_${this.churchName}_${this.dateNow}.pdf`);
        this.$emit('closeDownload');
    }
  }
};
</script>
