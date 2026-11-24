import { useAppStore } from '../store/useAppStore';
import type { Evento } from '../types';
import { crearSuscripcion, idUsuarioActual } from './base';

// Servicio de eventos, talleres, conferencias y actividades (Módulo 4).

export const eventsService = {
  /** Eventos que aún no terminan, del más próximo al más lejano. */
  subscribe(callback: (eventos: Evento[]) => void) {
    return crearSuscripcion(
      (s) => [s.eventos],
      (s) => s.eventos.filter((e) => e.fin > Date.now()).sort((a, b) => a.inicio - b.inicio),
      callback,
    );
  },

  subscribeOne(id: string, callback: (evento: Evento | null) => void) {
    return crearSuscripcion(
      (s) => [s.eventos],
      (s) => s.eventos.find((e) => e.id === id) ?? null, // null = no existe
      callback,
    );
  },

  /** Marca o desmarca "Me interesa". Devuelve true si ahora el usuario está interesado. */
  async toggleInteres(eventoId: string): Promise<boolean> {
    const yo = idUsuarioActual();
    const evento = useAppStore.getState().eventos.find((e) => e.id === eventoId);
    if (!evento) throw new Error('Este evento ya no existe.');
    const ahoraInteresa = !evento.interesados.includes(yo);
    useAppStore.setState((s) => ({
      eventos: s.eventos.map((e) =>
        e.id !== eventoId
          ? e
          : { ...e, interesados: ahoraInteresa ? [...e.interesados, yo] : e.interesados.filter((id) => id !== yo) },
      ),
    }));
    return ahoraInteresa;
  },
};
