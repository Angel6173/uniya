import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite. `host: true` permite abrir la app desde el celular
// en la misma red Wi-Fi (útil para probar en 375 px reales).
export default defineConfig({
  plugins: [react()],
  server: { host: true },
  build: {
    rollupOptions: {
      output: {
        // Separa las librerías grandes en archivos aparte (cargan en paralelo y se cachean mejor).
        manualChunks: {
          mapa: ['leaflet', 'react-leaflet'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
