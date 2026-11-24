import { useAppStore } from '../store/useAppStore';
import type { GrupoEstudio, Pregunta, Respuesta } from '../types';
import { crearSuscripcion, generarId, idUsuarioActual, quitarAportes, sumarAporte } from './base';

// Servicio de la Comunidad de ayuda (Módulo 2): preguntas y respuestas + grupos de estudio.

export interface NuevaPregunta {
  titulo: string;
  detalle: string;
  curso?: string;
  facultad?: string;
}

export interface NuevoGrupo {
  curso: string;
  tema: string;
  lugarId: string;
  horario: string;
  cupos: number;
}

function recortar(texto: string, max = 40) {
  return texto.length > max ? `${texto.slice(0, max - 1)}…` : texto;
}

function actualizarPregunta(id: string, cambio: (p: Pregunta) => Pregunta) {
  useAppStore.setState((s) => ({ preguntas: s.preguntas.map((p) => (p.id === id ? cambio(p) : p)) }));
}

function buscarPregunta(id: string) {
  const pregunta = useAppStore.getState().preguntas.find((p) => p.id === id);
  if (!pregunta) throw new Error('Esta pregunta ya no existe. Vuelve a la lista de preguntas.');
  return pregunta;
}

export const communityService = {
  // ── Preguntas y respuestas ──────────────────────────────────

  /** Preguntas de la más nueva a la más antigua. */
  subscribePreguntas(callback: (preguntas: Pregunta[]) => void) {
    return crearSuscripcion((s) => [s.preguntas], (s) => [...s.preguntas].sort((a, b) => b.fecha - a.fecha), callback);
  },

  subscribePregunta(id: string, callback: (pregunta: Pregunta | null) => void) {
    return crearSuscripcion((s) => [s.preguntas], (s) => s.preguntas.find((p) => p.id === id) ?? null, callback);
  },

  /** Cursos ya usados en preguntas y grupos (para sugerencias al escribir). */
  getCursos(): string[] {
    const { preguntas, grupos } = useAppStore.getState();
    const cursos = [...preguntas.map((p) => p.curso), ...grupos.map((g) => g.curso)].filter((c): c is string => !!c);
    return [...new Set(cursos)].sort((a, b) => a.localeCompare(b));
  },

  async crearPregunta(datos: NuevaPregunta): Promise<Pregunta> {
    const autorId = idUsuarioActual();
    const pregunta: Pregunta = { id: generarId('p'), ...datos, autorId, fecha: Date.now(), respuestas: [] };
    useAppStore.setState((s) => ({ preguntas: [pregunta, ...s.preguntas] }));
    sumarAporte(autorId, 'pregunta', `Preguntaste: "${recortar(pregunta.titulo)}"`, pregunta.id);
    return pregunta;
  },

  /** Solo el autor puede eliminar su pregunta (la pantalla pide confirmación antes). */
  async eliminarPregunta(id: string) {
    const pregunta = buscarPregunta(id);
    if (pregunta.autorId !== idUsuarioActual()) throw new Error('Solo quien publicó la pregunta puede eliminarla.');
    useAppStore.setState((s) => ({ preguntas: s.preguntas.filter((p) => p.id !== id) }));
    quitarAportes(id);
  },

  async responder(preguntaId: string, texto: string): Promise<Respuesta> {
    const autorId = idUsuarioActual();
    const pregunta = buscarPregunta(preguntaId);
    const respuesta: Respuesta = { id: generarId('res'), texto, autorId, fecha: Date.now(), util: false };
    actualizarPregunta(preguntaId, (p) => ({ ...p, respuestas: [...p.respuestas, respuesta] }));
    sumarAporte(autorId, 'respuesta', `Respondiste: "${recortar(pregunta.titulo)}"`, respuesta.id);
    return respuesta;
  },

  /** Para "Deshacer" una respuesta recién enviada. */
  async eliminarRespuesta(preguntaId: string, respuestaId: string) {
    actualizarPregunta(preguntaId, (p) => ({ ...p, respuestas: p.respuestas.filter((r) => r.id !== respuestaId) }));
    quitarAportes(respuestaId);
    quitarAportes(`util-${respuestaId}`);
  },

  /**
   * Marca cuál respuesta fue útil (solo una por pregunta; `null` = ninguna).
   * Solo el autor de la pregunta puede hacerlo. Quien respondió gana puntos.
   * Devuelve la respuesta útil anterior, para poder deshacer.
   */
  async marcarUtil(preguntaId: string, respuestaId: string | null): Promise<string | null> {
    const pregunta = buscarPregunta(preguntaId);
    if (pregunta.autorId !== idUsuarioActual()) {
      throw new Error('Solo quien hizo la pregunta puede marcar la respuesta útil.');
    }
    const anterior = pregunta.respuestas.find((r) => r.util) ?? null;
    if (anterior) quitarAportes(`util-${anterior.id}`);
    actualizarPregunta(preguntaId, (p) => ({
      ...p,
      respuestas: p.respuestas.map((r) => ({ ...r, util: r.id === respuestaId })),
    }));
    const nueva = pregunta.respuestas.find((r) => r.id === respuestaId);
    if (nueva && nueva.autorId !== pregunta.autorId) {
      sumarAporte(nueva.autorId, 'respuesta_util', `Tu respuesta fue útil en "${recortar(pregunta.titulo)}"`, `util-${nueva.id}`);
    }
    return anterior?.id ?? null;
  },

  // ── Grupos de estudio ───────────────────────────────────────

  subscribeGrupos(callback: (grupos: GrupoEstudio[]) => void) {
    return crearSuscripcion((s) => [s.grupos], (s) => s.grupos, callback);
  },

  async crearGrupo(datos: NuevoGrupo): Promise<GrupoEstudio> {
    const yo = idUsuarioActual();
    const grupo: GrupoEstudio = { id: generarId('g'), ...datos, miembros: [yo] };
    useAppStore.setState((s) => ({ grupos: [grupo, ...s.grupos] }));
    sumarAporte(yo, 'grupo_creado', `Creaste el grupo de ${grupo.curso}`, grupo.id);
    return grupo;
  },

  /** Solo el creador puede eliminar el grupo (la pantalla pide confirmación antes). */
  async eliminarGrupo(id: string) {
    const grupo = useAppStore.getState().grupos.find((g) => g.id === id);
    if (!grupo) return;
    if (grupo.miembros[0] !== idUsuarioActual()) throw new Error('Solo quien creó el grupo puede eliminarlo.');
    useAppStore.setState((s) => ({ grupos: s.grupos.filter((g) => g.id !== id) }));
    quitarAportes(id);
  },

  async unirse(grupoId: string) {
    const yo = idUsuarioActual();
    const grupo = useAppStore.getState().grupos.find((g) => g.id === grupoId);
    if (!grupo) throw new Error('Este grupo ya no existe.');
    if (grupo.miembros.includes(yo)) return;
    // Heurística 5 (prevención de errores): no se puede pasar el cupo.
    if (grupo.miembros.length >= grupo.cupos) throw new Error('El grupo ya está lleno. Prueba con otro grupo o crea uno nuevo.');
    useAppStore.setState((s) => ({
      grupos: s.grupos.map((g) => (g.id === grupoId ? { ...g, miembros: [...g.miembros, yo] } : g)),
    }));
    sumarAporte(yo, 'grupo_unido', `Te uniste al grupo de ${grupo.curso}`, grupoId);
  },

  async salir(grupoId: string) {
    const yo = idUsuarioActual();
    useAppStore.setState((s) => ({
      grupos: s.grupos.map((g) => (g.id === grupoId ? { ...g, miembros: g.miembros.filter((m) => m !== yo) } : g)),
    }));
    quitarAportes(grupoId, 'grupo_unido');
  },
};
