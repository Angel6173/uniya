import { restablecerDatos } from '../store/useAppStore';

// Utilidades solo para la demo de la Fase 1.
export const demoService = {
  /** Vuelve a los datos de ejemplo (útil antes de una presentación o prueba con usuarios). */
  async restablecer() {
    restablecerDatos();
  },
};
