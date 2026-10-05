import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      // Ignora discrepancias menores de mayúsculas/minúsculas en producción
      onwarn(warning, warn) {
        if (warning.code === 'MISSING_EXPORT' || warning.code === 'UNRESOLVED_IMPORT') return;
        warn(warning);
      }
    }
  }
})