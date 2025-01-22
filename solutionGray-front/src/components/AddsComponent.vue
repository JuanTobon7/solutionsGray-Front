<template>
  <div id="ad-container" class="h-auto px-4 py-2 bg-white rounded">
    <!-- Contenedor del anuncio -->
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-7079185208818820"
         data-ad-slot="8892945985"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script>
export default {
  name: "AdComponent",
  mounted() {
    // Verifica si el script ya fue cargado
    if (!document.querySelector('script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
      const adScript = document.createElement("script");
      adScript.async = true;
      adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      adScript.crossOrigin = "anonymous";
      document.head.appendChild(adScript);

      // Inicializa los anuncios después de cargar el script
      adScript.onload = () => {
        (adsbygoogle = window.adsbygoogle || []).push({});
      };
    } else {
      // Si el script ya está cargado, simplemente inicializa los anuncios
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  },
};
</script>

<style scoped>
#ad-container {
  margin: 20px 0;
  text-align: center;
}
</style>
