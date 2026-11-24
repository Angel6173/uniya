import { useAppStore, type AppState } from '../store/useAppStore';
import type { Aporte, TipoAporte } from '../types';

// Utilidades compartidas por todos los servicios (Fase 1: datos locales).

export type Desuscribir = () => void;

/**
 * Crea una suscripción parecida a `onSnapshot` de Firestore:
 * llama al callback de inmediato con los datos actuales y otra vez cada vez que cambian.
 * @param fuentes  partes del estado de las que dependen los datos (si no cambian, no se avisa)
 * @param calcular arma los datos que recibe la pantalla
 */
export function crearSuscripcion<T>(
  fuentes: (s: AppState) => unknown[],
  calcular: (s: AppState) => T,
  callback: (datos: T) => void,
): Desuscribir {
  let previas = fuentes(useAppStore.getState());
  callback(calcular(useAppStore.getState()));
  return useAppStore.subscribe((estado) => {
    const nuevas = fuentes(estado);
    const cambio = nuevas.some((valor, i) => valor !== previas[i]);
    previas = nuevas;
    if (cambio) callback(calcular(estado));
  });
}

export function generarId(prefijo: string) {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Simula la demora de la red para que se vean los estados de carga. */
export function esperar(ms: number) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

/** Id del usuario con sesión. Lanza un error si nadie inició sesión. */
export function idUsuarioActual(): string {
  const id = useAppStore.getState().sesionId;
  if (!id) throw new Error('Inicia sesión para continuar.');
  return id;
}

// ── Puntos por aportar ──────────────────────────────────────────

/** Puntos que gana cada tipo de aporte (se muestran en la pantalla de ayuda y en el perfil). */
export const PUNTOS: Record<TipoAporte, number> = {
  reporte: 2,
  pregunta: 3,
  respuesta: 5,
  respuesta_util: 10,
  grupo_creado: 5,
  grupo_unido: 1,
};

export function sumarAporte(usuarioId: string, tipo: TipoAporte, descripcion: string, refId: string) {
  const aporte: Aporte = {
    id: generarId('a'),
    usuarioId,
    tipo,
    descripcion,
    puntos: PUNTOS[tipo],
    fecha: Date.now(),
    refId,
  };
  useAppStore.setState((s) => ({
    aportes: [aporte, ...s.aportes],
    usuarios: s.usuarios.map((u) => (u.id === usuarioId ? { ...u, puntos: u.puntos + aporte.puntos } : u)),
  }));
}

/** Quita los aportes ligados a `refId` (y sus puntos). Se usa al deshacer o eliminar. */
export function quitarAportes(refId: string, tipo?: TipoAporte) {
  useAppStore.setState((s) => {
    const quitar = s.aportes.filter((a) => a.refId === refId && (!tipo || a.tipo === tipo));
    if (quitar.length === 0) return s;
    return {
      aportes: s.aportes.filter((a) => !quitar.includes(a)),
      usuarios: s.usuarios.map((u) => {
        const resta = quitar.filter((a) => a.usuarioId === u.id).reduce((t, a) => t + a.puntos, 0);
        return resta ? { ...u, puntos: Math.max(0, u.puntos - resta) } : u;
      }),
    };
  });
}
