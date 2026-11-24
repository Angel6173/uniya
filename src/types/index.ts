// Tipos del modelo de datos de UniYa.
// Son los mismos que se usarán en Firestore en la Fase 2.

export type Categoria =
  | 'facultad'
  | 'aula'
  | 'laboratorio'
  | 'biblioteca'
  | 'oficina'
  | 'estacionamiento'
  | 'espacio_estudio';

export interface Lugar {
  id: string;
  nombre: string;
  categoria: Categoria;
  edificio?: string;
  piso?: number;
  horario?: string;
  lat: number;
  lng: number;
  descripcion?: string;
  /** Palabras extra para el buscador (siglas, apodos que usan los estudiantes). */
  alias?: string[];
}

export type EstadoEspacio = 'libre' | 'medio' | 'lleno';

export interface ReporteEspacio {
  id: string;
  lugarId: string;
  estado: EstadoEspacio;
  usuarioId: string;
  fecha: number;
}

export interface Respuesta {
  id: string;
  texto: string;
  autorId: string;
  fecha: number;
  util: boolean;
}

export interface Pregunta {
  id: string;
  titulo: string;
  detalle: string;
  curso?: string;
  facultad?: string;
  autorId: string;
  fecha: number;
  respuestas: Respuesta[];
}

export interface GrupoEstudio {
  id: string;
  curso: string;
  tema: string;
  lugarId: string;
  horario: string;
  cupos: number;
  /** El primer miembro es quien creó el grupo. */
  miembros: string[];
}

export interface PedidoAyudaVehicular {
  id: string;
  tipo: 'bateria' | 'llanta' | 'otro';
  lugarId: string;
  detalle: string;
  estado: 'abierto' | 'en_camino' | 'resuelto';
  autorId: string;
  ayudanteId?: string;
  fecha: number;
}

export type TipoEvento = 'evento' | 'taller' | 'conferencia' | 'actividad';

export interface Evento {
  id: string;
  titulo: string;
  tipo: TipoEvento;
  facultad?: string;
  lugarId: string;
  inicio: number;
  fin: number;
  descripcion: string;
  interesados: string[];
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  carrera: string;
  rol: 'estudiante' | 'admin';
  puntos: number;
}

/** Registro de cada aporte que suma puntos (se muestra en el historial del perfil). */
export type TipoAporte = 'reporte' | 'pregunta' | 'respuesta' | 'respuesta_util' | 'grupo_creado' | 'grupo_unido';

export interface Aporte {
  id: string;
  usuarioId: string;
  tipo: TipoAporte;
  descripcion: string;
  puntos: number;
  fecha: number;
  /** Id del reporte, respuesta, grupo, etc. que generó el aporte (sirve para "Deshacer"). */
  refId: string;
}
