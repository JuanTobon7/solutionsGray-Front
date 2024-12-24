import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'load-txt-as-raw',
      transform(src, id) {
        if (id.endsWith('.txt')) {
          console.log(`Procesando archivo de texto: ${id}`);
          return `export default ${JSON.stringify(src)};`;
        }
      }
    },
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
})
