import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { crearDatosIniciales } from '../data/mock';
import type { Aporte, Evento, GrupoEstudio, Pregunta, ReporteEspacio, Usuario } from '../types';

// Estado global de la app (Fase 1).
// IMPORTANTE: los componentes NO usan este store directamente.
// Solo lo usan los archivos de `src/services/`. En la Fase 2 este store se reemplaza por Firestore.

export interface AppState {
  /** Momento en que se generaron los datos de ejemplo. */
  seedAt: number;
  /** Id del usuario con sesión iniciada (null = sin sesión). */
  sesionId: string | null;
  usuarios: Usuario[];
  reportes: ReporteEspacio[];
  preguntas: Pregunta[];
  grupos: GrupoEstudio[];
  eventos: Evento[];
  aportes: Aporte[];
  /** Ids de lugares buscados recientemente (el más reciente primero). */
  busquedasRecientes: string[];
}

function estadoInicial(): AppState {
  return {
    seedAt: Date.now(),
    sesionId: null,
    aportes: [],
    busquedasRecientes: [],
    ...crearDatosIniciales(),
  };
}

/**
 * Si los datos de ejemplo tienen más de 12 horas, se regeneran para que los
 * reportes y eventos se vean actuales en la demo. Se conserva al usuario con sesión
 * y su historial de aportes.
 */
const VIGENCIA_DATOS = 12 * 60 * 60 * 1000;

export const useAppStore = create<AppState>()(
  persist(() => estadoInicial(), {
    name: 'uniya-datos',
    version: 1,
    merge: (persistido, actual) => {
      const guardado = persistido as AppState | undefined;
      if (!guardado) return actual;
      if (Date.now() - guardado.seedAt < VIGENCIA_DATOS) return { ...actual, ...guardado };

      const nuevo = estadoInicial();
      const yo = guardado.usuarios.find((u) => u.id === guardado.sesionId);
      if (!yo) return nuevo;
      return {
        ...nuevo,
        sesionId: yo.id,
        usuarios: [...nuevo.usuarios, yo],
        aportes: guardado.aportes.filter((a) => a.usuarioId === yo.id),
        busquedasRecientes: guardado.busquedasRecientes,
      };
    },
  }),
);

// Simulación de "tiempo real" en la Fase 1: si se abre la app en dos pestañas,
// lo que se reporta en una aparece al instante en la otra.
// En la Fase 2 esto lo hará Firestore con onSnapshot entre celulares distintos.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'uniya-datos') void useAppStore.persist.rehydrate();
  });
}

/** Borra todo y vuelve a los datos de ejemplo (mantiene la sesión). */
export function restablecerDatos() {
  const { sesionId, usuarios } = useAppStore.getState();
  const yo = usuarios.find((u) => u.id === sesionId);
  const nuevo = estadoInicial();
  // Los puntos y el historial del usuario también vuelven a cero.
  useAppStore.setState(yo ? { ...nuevo, sesionId: yo.id, usuarios: [...nuevo.usuarios, { ...yo, puntos: 0 }] } : nuevo);
}
