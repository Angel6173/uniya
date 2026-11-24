import { LUGARES } from '../data/campus';
import { useAppStore, type AppState } from '../store/useAppStore';
import type { EstadoEspacio, Lugar, ReporteEspacio } from '../types';
import { crearSuscripcion, generarId, idUsuarioActual, quitarAportes, sumarAporte } from './base';
import { CATEGORIAS_ESPACIO } from './placesService';

// Servicio de disponibilidad de espacios (Módulo 3).
// Regla: el estado mostrado es el del REPORTE MÁS RECIENTE.
// La "confianza" (alta, media o sin datos) se calcula en features/spaces/estado.ts según la antigüedad.

export interface EspacioConEstado {
  lugar: Lugar;
  /** Reporte más reciente de cualquier estudiante (undefined si nunca se reportó). */
  ultimoReporte?: ReporteEspacio;
  /** Cantidad de reportes en la última hora (da más confianza al dato). */
  reportesUltimaHora: number;
}

const ETIQUETA: Record<EstadoEspacio, string> = { libre: 'Libre', medio: 'Medio lleno', lleno: 'Lleno' };

function calcular(s: AppState): EspacioConEstado[] {
  const haceUnaHora = Date.now() - 60 * 60 * 1000;
  return LUGARES.filter((l) => CATEGORIAS_ESPACIO.includes(l.categoria)).map((lugar) => {
    const propios = s.reportes.filter((r) => r.lugarId === lugar.id);
    const ultimoReporte = propios.reduce<ReporteEspacio | undefined>(
      (mas, r) => (!mas || r.fecha > mas.fecha ? r : mas),
      undefined,
    );
    return { lugar, ultimoReporte, reportesUltimaHora: propios.filter((r) => r.fecha >= haceUnaHora).length };
  });
}

export const spacesService = {
  getAll(): EspacioConEstado[] {
    return calcular(useAppStore.getState());
  },

  /** Se llama de inmediato y cada vez que alguien reporta. */
  subscribe(callback: (espacios: EspacioConEstado[]) => void) {
    return crearSuscripcion((s) => [s.reportes], calcular, callback);
  },

  /** Reporte colaborativo en 1 toque. Suma puntos al usuario. */
  async report(lugarId: string, estado: EstadoEspacio): Promise<ReporteEspacio> {
    const usuarioId = idUsuarioActual();
    const reporte: ReporteEspacio = { id: generarId('r'), lugarId, estado, usuarioId, fecha: Date.now() };
    useAppStore.setState((s) => ({ reportes: [...s.reportes, reporte] }));
    const lugar = LUGARES.find((l) => l.id === lugarId);
    sumarAporte(usuarioId, 'reporte', `Reportaste ${lugar?.nombre ?? 'un espacio'}: ${ETIQUETA[estado]}`, reporte.id);
    return reporte;
  },

  /** Heurística 3 (control y libertad): deshace un reporte recién hecho. */
  async undoReport(reporteId: string) {
    useAppStore.setState((s) => ({ reportes: s.reportes.filter((r) => r.id !== reporteId) }));
    quitarAportes(reporteId);
  },
};
