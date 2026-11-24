import { LUGARES } from '../data/campus';
import { useAppStore } from '../store/useAppStore';
import type { Categoria, Lugar } from '../types';
import { crearSuscripcion } from './base';

// Servicio de lugares del campus (Módulo 1 · Mapa).

/** Categorías que son "espacios" con semáforo de disponibilidad. */
export const CATEGORIAS_ESPACIO: Categoria[] = ['biblioteca', 'espacio_estudio', 'estacionamiento'];

const MAX_RECIENTES = 5;

/** Quita tildes y pasa a minúsculas para que "biblióteca" y "BIBLIOTECA" encuentren lo mismo. */
export function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export const placesService = {
  getAll(): Lugar[] {
    return LUGARES;
  },

  getById(id: string): Lugar | undefined {
    return LUGARES.find((l) => l.id === id);
  },

  /**
   * Búsqueda instantánea. Busca en nombre, edificio y alias.
   * Primero salen los que EMPIEZAN con el texto, luego los que lo contienen.
   */
  search(consulta: string, limite = 8): Lugar[] {
    const q = normalizar(consulta);
    if (!q) return [];
    const palabras = q.split(/\s+/);
    const resultados = LUGARES.map((lugar) => {
      const nombre = normalizar(lugar.nombre);
      const texto = [nombre, normalizar(lugar.edificio ?? ''), ...(lugar.alias ?? []).map(normalizar)].join(' ');
      if (!palabras.every((p) => texto.includes(p))) return null;
      const puntaje = nombre.startsWith(q) ? 0 : nombre.includes(q) ? 1 : 2;
      return { lugar, puntaje };
    }).filter((r): r is { lugar: Lugar; puntaje: number } => r !== null);
    resultados.sort((a, b) => a.puntaje - b.puntaje || a.lugar.nombre.localeCompare(b.lugar.nombre));
    return resultados.slice(0, limite).map((r) => r.lugar);
  },

  // ── Búsquedas recientes (Heurística 6: reconocer antes que recordar) ──

  subscribeRecientes(callback: (lugares: Lugar[]) => void) {
    return crearSuscripcion(
      (s) => [s.busquedasRecientes],
      (s) => s.busquedasRecientes.map((id) => LUGARES.find((l) => l.id === id)).filter((l): l is Lugar => !!l),
      callback,
    );
  },

  agregarReciente(lugarId: string) {
    useAppStore.setState((s) => ({
      busquedasRecientes: [lugarId, ...s.busquedasRecientes.filter((id) => id !== lugarId)].slice(0, MAX_RECIENTES),
    }));
  },

  borrarRecientes() {
    useAppStore.setState({ busquedasRecientes: [] });
  },
};
