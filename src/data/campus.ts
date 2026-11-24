import type { Lugar } from '../types';

// Datos del campus: Universidad Nacional de San Agustín de Arequipa (UNSA),
// Ciudad Universitaria – Área de Ingenierías (Av. Independencia con calle Paucarpata).
//
// TODO: ajustar coordenadas reales. Las posiciones de los pabellones son APROXIMADAS:
// se ubicaron alrededor del centro del campus para la Fase 1. Para corregirlas,
// abrir openstreetmap.org, clic derecho sobre cada edificio → "Mostrar dirección"
// y copiar latitud/longitud aquí.

export const UNIVERSIDAD = {
  nombre: 'Universidad Nacional de San Agustín de Arequipa',
  sigla: 'UNSA',
  campus: 'Área de Ingenierías',
  dominioCorreo: 'unsa.edu.pe',
};

/** Centro del mapa y zoom inicial. TODO: ajustar coordenadas reales. */
export const CENTRO_CAMPUS = { lat: -16.4052, lng: -71.5243 };
export const ZOOM_INICIAL = 17;

/** Punto de partida para "Cómo llegar" mientras no usamos el GPS (Fase 2). */
export const PUERTA_PRINCIPAL = {
  nombre: 'Puerta principal (Av. Independencia)',
  lat: -16.4061,
  lng: -71.5258,
};

export const LUGARES: Lugar[] = [
  // ── Facultades ──────────────────────────────────────────────
  {
    id: 'fac-fips', nombre: 'Facultad de Ingeniería de Producción y Servicios', categoria: 'facultad',
    edificio: 'Pabellón FIPS', horario: 'Lun–Vie 7:00–21:00', lat: -16.4046, lng: -71.5238,
    descripcion: 'Escuelas de Sistemas, Industrial, Electrónica, Eléctrica, Mecánica y Telecomunicaciones.',
    alias: ['fips', 'sistemas', 'industrial', 'electronica'],
  },
  {
    id: 'fac-fic', nombre: 'Facultad de Ingeniería Civil', categoria: 'facultad',
    edificio: 'Pabellón de Civil', horario: 'Lun–Vie 7:00–21:00', lat: -16.4058, lng: -71.5234,
    alias: ['fic', 'civil'],
  },
  {
    id: 'fac-figmm', nombre: 'Facultad de Ingeniería Geológica, Geofísica y Minas', categoria: 'facultad',
    edificio: 'Pabellón de Minas', horario: 'Lun–Vie 7:00–20:00', lat: -16.4040, lng: -71.5250,
    alias: ['figmm', 'minas', 'geologia', 'geofisica'],
  },
  {
    id: 'fac-fip', nombre: 'Facultad de Ingeniería de Procesos', categoria: 'facultad',
    edificio: 'Pabellón de Procesos', horario: 'Lun–Vie 7:00–20:00', lat: -16.4050, lng: -71.5227,
    alias: ['fip', 'quimica', 'metalurgica', 'alimentarias'],
  },
  {
    id: 'fac-fcnf', nombre: 'Facultad de Ciencias Naturales y Formales', categoria: 'facultad',
    edificio: 'Pabellón de Ciencias', horario: 'Lun–Vie 7:00–20:00', lat: -16.4064, lng: -71.5245,
    alias: ['fcnf', 'ciencias', 'fisica', 'matematica'],
  },

  // ── Aulas ───────────────────────────────────────────────────
  {
    id: 'aula-301', nombre: 'Aula 301', categoria: 'aula', edificio: 'Pabellón FIPS', piso: 3,
    lat: -16.40452, lng: -71.52395, descripcion: 'Aula con proyector, 60 carpetas.',
  },
  {
    id: 'aula-205', nombre: 'Aula 205', categoria: 'aula', edificio: 'Pabellón FIPS', piso: 2,
    lat: -16.40472, lng: -71.52362,
  },
  {
    id: 'aula-102', nombre: 'Aula 102', categoria: 'aula', edificio: 'Pabellón de Civil', piso: 1,
    lat: -16.40595, lng: -71.52322,
  },
  {
    id: 'aula-401', nombre: 'Aula 401', categoria: 'aula', edificio: 'Pabellón de Procesos', piso: 4,
    lat: -16.40488, lng: -71.52255,
  },
  {
    id: 'auditorio', nombre: 'Auditorio del Área de Ingenierías', categoria: 'aula', edificio: 'Pabellón FIPS', piso: 1,
    horario: 'Según programación de eventos', lat: -16.40505, lng: -71.52405,
    descripcion: 'Capacidad para 250 personas. Aquí se hacen conferencias y ceremonias.',
    alias: ['auditorio', 'paraninfo'],
  },

  // ── Laboratorios ────────────────────────────────────────────
  {
    id: 'lab-computo-1', nombre: 'Laboratorio de Cómputo 1', categoria: 'laboratorio', edificio: 'Pabellón FIPS', piso: 2,
    horario: 'Lun–Sáb 7:00–21:00', lat: -16.40438, lng: -71.52372, alias: ['lab computo', 'lab 1', 'computadoras'],
  },
  {
    id: 'lab-fisica', nombre: 'Laboratorio de Física', categoria: 'laboratorio', edificio: 'Pabellón de Ciencias', piso: 1,
    horario: 'Lun–Vie 8:00–18:00', lat: -16.40655, lng: -71.52432,
  },
  {
    id: 'lab-quimica', nombre: 'Laboratorio de Química General', categoria: 'laboratorio', edificio: 'Pabellón de Procesos', piso: 1,
    horario: 'Lun–Vie 8:00–18:00', lat: -16.40515, lng: -71.52282, descripcion: 'Ingreso con mandil y lentes de seguridad.',
  },
  {
    id: 'lab-electronica', nombre: 'Laboratorio de Electrónica', categoria: 'laboratorio', edificio: 'Pabellón FIPS', piso: 1,
    horario: 'Lun–Vie 8:00–20:00', lat: -16.40425, lng: -71.52342,
  },

  // ── Bibliotecas (también son espacios con semáforo) ──────────
  {
    id: 'bib-ingenierias', nombre: 'Biblioteca del Área de Ingenierías', categoria: 'biblioteca', edificio: 'Edificio de Biblioteca', piso: 1,
    horario: 'Lun–Vie 7:30–20:30 · Sáb 8:00–13:00', lat: -16.40532, lng: -71.52478,
    descripcion: 'Préstamo de libros, sala de lectura silenciosa y wifi.', alias: ['biblioteca central', 'biblio'],
  },
  {
    id: 'bib-fips', nombre: 'Hemeroteca FIPS', categoria: 'biblioteca', edificio: 'Pabellón FIPS', piso: 2,
    horario: 'Lun–Vie 8:00–18:00', lat: -16.40478, lng: -71.52412, alias: ['hemeroteca', 'revistas'],
  },

  // ── Espacios de estudio ─────────────────────────────────────
  {
    id: 'est-sala-sistemas', nombre: 'Sala de estudio de Sistemas', categoria: 'espacio_estudio', edificio: 'Pabellón FIPS', piso: 3,
    horario: 'Lun–Vie 7:00–21:00', lat: -16.40445, lng: -71.52412, descripcion: 'Mesas grupales y enchufes.',
  },
  {
    id: 'est-rotonda', nombre: 'Rotonda y áreas verdes', categoria: 'espacio_estudio',
    horario: 'Todo el día', lat: -16.40515, lng: -71.52342, descripcion: 'Bancas al aire libre. Ideal para estudiar en grupo.',
    alias: ['jardin', 'bancas', 'rotonda'],
  },
  {
    id: 'est-sala-civil', nombre: 'Sala de estudio de Civil', categoria: 'espacio_estudio', edificio: 'Pabellón de Civil', piso: 2,
    horario: 'Lun–Vie 8:00–20:00', lat: -16.40568, lng: -71.52305,
  },

  // ── Estacionamientos ────────────────────────────────────────
  {
    id: 'est-a', nombre: 'Estacionamiento A', categoria: 'estacionamiento', edificio: 'Puerta Av. Independencia',
    horario: 'Lun–Sáb 6:30–22:00', lat: -16.40625, lng: -71.52545, descripcion: '80 espacios para autos.',
    alias: ['parqueo a', 'cochera'],
  },
  {
    id: 'est-b', nombre: 'Estacionamiento B', categoria: 'estacionamiento', edificio: 'Puerta calle Paucarpata',
    horario: 'Lun–Vie 6:30–21:00', lat: -16.40395, lng: -71.52215, descripcion: '45 espacios para autos.',
    alias: ['parqueo b', 'paucarpata'],
  },
  {
    id: 'est-motos', nombre: 'Estacionamiento de motos y bicicletas', categoria: 'estacionamiento',
    horario: 'Lun–Sáb 6:30–22:00', lat: -16.40598, lng: -71.52502, alias: ['bicicletas', 'bici', 'motos'],
  },

  // ── Oficinas ────────────────────────────────────────────────
  {
    id: 'of-secretaria-fips', nombre: 'Secretaría académica FIPS', categoria: 'oficina', edificio: 'Pabellón FIPS', piso: 1,
    horario: 'Lun–Vie 8:00–15:00', lat: -16.40462, lng: -71.52382,
    descripcion: 'Constancias, matrícula y trámites académicos.', alias: ['mesa de partes', 'tramites', 'constancia'],
  },
  {
    id: 'of-direccion-sistemas', nombre: 'Dirección de la Escuela de Ingeniería de Sistemas', categoria: 'oficina',
    edificio: 'Pabellón FIPS', piso: 3, horario: 'Lun–Vie 8:00–14:00', lat: -16.40432, lng: -71.52392,
  },
  {
    id: 'of-bienestar', nombre: 'Oficina de Bienestar Universitario', categoria: 'oficina', edificio: 'Pabellón de Ciencias', piso: 1,
    horario: 'Lun–Vie 8:00–15:30', lat: -16.40628, lng: -71.52462, descripcion: 'Becas, comedor y asistencia social.',
    alias: ['becas', 'comedor', 'asistenta social'],
  },
  {
    id: 'of-topico', nombre: 'Tópico de salud', categoria: 'oficina', edificio: 'Pabellón de Ciencias', piso: 1,
    horario: 'Lun–Vie 7:30–19:00', lat: -16.40612, lng: -71.52412, descripcion: 'Primeros auxilios.',
    alias: ['enfermeria', 'medico', 'salud'],
  },
];

/** Facultades del área, con el nombre corto que usan los estudiantes (filtros y formularios). */
export const FACULTADES = ['FIPS', 'Civil', 'FIGMM', 'Procesos', 'Ciencias'];

export const CARRERAS = [
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Ingeniería Electrónica',
  'Ingeniería Eléctrica',
  'Ingeniería Mecánica',
  'Ingeniería de Telecomunicaciones',
  'Ingeniería Civil',
  'Ingeniería de Minas',
  'Ingeniería Geológica',
  'Ingeniería Geofísica',
  'Ingeniería Química',
  'Ingeniería Metalúrgica',
  'Ingeniería de Industrias Alimentarias',
  'Ciencias de la Computación',
  'Física',
  'Matemáticas',
  'Química',
];
