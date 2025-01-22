import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'txt-loader', // Nombre personalizado del plugin
      transform(code, id) {
        if (id.endsWith('.txt')) {
          return `export default ${JSON.stringify(code)}`;
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: 'terser', // Usa Terser como minificador
    terserOptions: {
      format: {
        comments: false, // Elimina todos los comentarios
      },
    },
  },
});
