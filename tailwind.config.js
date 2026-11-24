import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Color principal del equipo: índigo universitario.
        primary: colors.indigo,
        // Heurística 4 (consistencia): los colores del semáforo son los mismos en toda la app.
        semaforo: {
          libre: '#16a34a',
          medio: '#d97706',
          lleno: '#dc2626',
          sindatos: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        suave: '0 1px 3px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
};
