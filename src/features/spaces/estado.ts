import type { EstadoEspacio, ReporteEspacio } from '../../types';

// Reglas del semáforo de espacios (Módulo 3).
// Heurística 1 (visibilidad del estado): el usuario siempre sabe qué tan fresco es el dato.

/** Estado que se muestra: el del último reporte, o "sin_datos" si es antiguo. */
export type EstadoVisible = EstadoEspacio | 'sin_datos';
export type Confianza = 'alta' | 'media' | 'ninguna';

/** Más de 60 min → gris "sin datos recientes". */
export const MINUTOS_SIN_DATOS = 60;
/** Hasta 20 min el dato es confiable; entre 20 y 60, se avisa que puede haber cambiado. */
export const MINUTOS_CONFIANZA_ALTA = 20;

export function estadoVisible(ultimo: ReporteEspacio | undefined, ahora: number): { estado: EstadoVisible; confianza: Confianza } {
  if (!ultimo) return { estado: 'sin_datos', confianza: 'ninguna' };
  const minutos = (ahora - ultimo.fecha) / 60_000;
  if (minutos > MINUTOS_SIN_DATOS) return { estado: 'sin_datos', confianza: 'ninguna' };
  return { estado: ultimo.estado, confianza: minutos <= MINUTOS_CONFIANZA_ALTA ? 'alta' : 'media' };
}

// Heurística 4 (consistencia): los mismos colores y textos del semáforo en toda la app.
export const SEMAFORO: Record<
  EstadoVisible,
  { etiqueta: string; corta: string; color: string; fondo: string; texto: string; borde: string }
> = {
  libre: { etiqueta: 'Libre', corta: 'Libre', color: '#16a34a', fondo: 'bg-green-50', texto: 'text-green-800', borde: 'border-green-200' },
  medio: { etiqueta: 'Medio lleno', corta: 'Medio', color: '#d97706', fondo: 'bg-amber-50', texto: 'text-amber-900', borde: 'border-amber-200' },
  lleno: { etiqueta: 'Lleno', corta: 'Lleno', color: '#dc2626', fondo: 'bg-red-50', texto: 'text-red-800', borde: 'border-red-200' },
  sin_datos: { etiqueta: 'Sin datos recientes', corta: 'Sin datos', color: '#6b7280', fondo: 'bg-gray-100', texto: 'text-gray-700', borde: 'border-gray-200' },
};

export const ESTADOS_REPORTABLES: EstadoEspacio[] = ['libre', 'medio', 'lleno'];
