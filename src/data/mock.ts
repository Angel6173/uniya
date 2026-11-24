import type { Evento, GrupoEstudio, Pregunta, ReporteEspacio, Usuario } from '../types';

// Datos de ejemplo de la Fase 1.
// - Todos los nombres de estudiantes son FICTICIOS.
// - Las fechas se calculan a partir de `ahora` para que la demo siempre se vea actual.

const MIN = 60_000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;

/** Estudiantes ficticios que "ya usan" la app. */
export const USUARIOS_MOCK: Usuario[] = [
  { id: 'u-lucia', nombre: 'Lucía Quispe', correo: 'lquispe@unsa.edu.pe', carrera: 'Ingeniería de Sistemas', rol: 'estudiante', puntos: 86 },
  { id: 'u-diego', nombre: 'Diego Mamani', correo: 'dmamani@unsa.edu.pe', carrera: 'Ingeniería Civil', rol: 'estudiante', puntos: 42 },
  { id: 'u-valeria', nombre: 'Valeria Flores', correo: 'vflores@unsa.edu.pe', carrera: 'Ingeniería Industrial', rol: 'estudiante', puntos: 130 },
  { id: 'u-renzo', nombre: 'Renzo Huamán', correo: 'rhuaman@unsa.edu.pe', carrera: 'Ingeniería Electrónica', rol: 'estudiante', puntos: 18 },
  { id: 'u-camila', nombre: 'Camila Torres', correo: 'ctorres@unsa.edu.pe', carrera: 'Ingeniería Química', rol: 'estudiante', puntos: 64 },
  { id: 'u-mateo', nombre: 'Mateo Chávez', correo: 'mchavez@unsa.edu.pe', carrera: 'Ingeniería de Minas', rol: 'estudiante', puntos: 9 },
  { id: 'u-andrea', nombre: 'Andrea Ccama', correo: 'accama@unsa.edu.pe', carrera: 'Ingeniería de Sistemas', rol: 'estudiante', puntos: 155 },
  { id: 'u-jhon', nombre: 'Jhon Apaza', correo: 'japaza@unsa.edu.pe', carrera: 'Física', rol: 'estudiante', puntos: 27 },
];

/** Inicio del día de hoy (medianoche local). */
function inicioDeHoy(ahora: number) {
  const d = new Date(ahora);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function reportesIniciales(ahora: number): ReporteEspacio[] {
  // [lugarId, estado, minutos atrás, autor]
  const filas: [string, ReporteEspacio['estado'], number, string][] = [
    ['bib-ingenierias', 'libre', 50, 'u-lucia'],
    ['bib-ingenierias', 'medio', 12, 'u-diego'],
    ['bib-ingenierias', 'medio', 4, 'u-valeria'],
    ['bib-fips', 'libre', 9, 'u-andrea'],
    ['est-sala-sistemas', 'lleno', 6, 'u-renzo'],
    ['est-sala-sistemas', 'lleno', 2, 'u-lucia'],
    ['est-rotonda', 'libre', 25, 'u-camila'],
    ['est-sala-civil', 'medio', 95, 'u-diego'], // antiguo → se verá gris "sin datos recientes"
    ['est-a', 'lleno', 3, 'u-mateo'],
    ['est-b', 'medio', 18, 'u-jhon'],
    ['est-motos', 'libre', 40, 'u-renzo'],
  ];
  return filas.map(([lugarId, estado, minAtras, usuarioId], i) => ({
    id: `r-seed-${i}`,
    lugarId,
    estado,
    usuarioId,
    fecha: ahora - minAtras * MIN,
  }));
}

function preguntasIniciales(ahora: number): Pregunta[] {
  return [
    {
      id: 'p-1', titulo: '¿Dónde queda la Secretaría de FIPS? Soy cachimbo y necesito mi constancia',
      detalle: 'Me pidieron una constancia de matrícula y no encuentro la oficina. ¿En qué pabellón está y a qué hora atienden?',
      facultad: 'FIPS', autorId: 'u-mateo', fecha: ahora - 3 * HORA,
      respuestas: [
        { id: 'r-1a', texto: 'Está en el primer piso del pabellón FIPS, al costado de la escalera. Atienden de 8 a 15. Búscala en el Mapa como "secretaría".', autorId: 'u-andrea', fecha: ahora - 2.5 * HORA, util: true },
        { id: 'r-1b', texto: 'Llega temprano, a partir de las 11 se forma cola.', autorId: 'u-lucia', fecha: ahora - 2 * HORA, util: false },
      ],
    },
    {
      id: 'p-2', titulo: '¿Alguien entiende la regla de la cadena en derivadas?',
      detalle: 'En la práctica 3 de Cálculo I no me salen los ejercicios de funciones compuestas. ¿Algún video o truco?',
      curso: 'Cálculo I', facultad: 'Ciencias', autorId: 'u-renzo', fecha: ahora - 5 * HORA,
      respuestas: [
        { id: 'r-2a', texto: 'Piensa en "derivada de afuera por derivada de adentro". Escribe u = lo de adentro y deriva paso a paso.', autorId: 'u-valeria', fecha: ahora - 4 * HORA, util: false },
      ],
    },
    {
      id: 'p-3', titulo: 'Error "segmentation fault" con listas enlazadas en C++',
      detalle: 'Al eliminar el último nodo mi programa se cae. Creo que es un puntero que queda colgando.',
      curso: 'Estructuras de Datos', facultad: 'FIPS', autorId: 'u-lucia', fecha: ahora - 9 * HORA,
      respuestas: [
        { id: 'r-3a', texto: 'Después de hacer delete al último nodo, el "siguiente" del penúltimo tiene que quedar en nullptr.', autorId: 'u-andrea', fecha: ahora - 8 * HORA, util: true },
        { id: 'r-3b', texto: 'Usa el depurador de VS Code con un breakpoint en el delete y mira los punteros.', autorId: 'u-renzo', fecha: ahora - 7 * HORA, util: false },
      ],
    },
    {
      id: 'p-4', titulo: '¿El laboratorio de Física pide mandil?',
      detalle: 'Mañana tengo mi primera práctica de Física I y no sé qué llevar.',
      curso: 'Física I', facultad: 'Ciencias', autorId: 'u-diego', fecha: ahora - 1 * DIA,
      respuestas: [
        { id: 'r-4a', texto: 'No es obligatorio en Física, pero sí lleva calculadora científica y la guía impresa.', autorId: 'u-jhon', fecha: ahora - 22 * HORA, util: true },
      ],
    },
    {
      id: 'p-5', titulo: 'Diferencia entre JOIN e INNER JOIN',
      detalle: '¿Son lo mismo en MySQL o cambia el resultado?',
      curso: 'Base de Datos', facultad: 'FIPS', autorId: 'u-valeria', fecha: ahora - 1.5 * DIA,
      respuestas: [
        { id: 'r-5a', texto: 'En MySQL son lo mismo: JOIN sin nada es INNER JOIN.', autorId: 'u-lucia', fecha: ahora - 1.4 * DIA, util: false },
        { id: 'r-5b', texto: 'Ojo que LEFT JOIN sí es distinto: trae también las filas sin coincidencia.', autorId: 'u-andrea', fecha: ahora - 1.3 * DIA, util: false },
      ],
    },
    {
      id: 'p-6', titulo: '¿Cómo balanceo ecuaciones redox por ion-electrón?',
      detalle: 'Me confundo cuando es en medio básico.',
      curso: 'Química General', facultad: 'Procesos', autorId: 'u-camila', fecha: ahora - 2 * DIA,
      respuestas: [],
    },
    {
      id: 'p-7', titulo: '¿Hay wifi en la Biblioteca de Ingenierías?',
      detalle: 'Mi celular no se conecta a la red de la universidad.',
      autorId: 'u-mateo', fecha: ahora - 3 * DIA,
      respuestas: [
        { id: 'r-7a', texto: 'Sí, entras con tu correo institucional y tu contraseña del correo.', autorId: 'u-diego', fecha: ahora - 2.9 * DIA, util: true },
      ],
    },
    {
      id: 'p-8', titulo: '¿Qué conviene más para Estadística: Excel o R?',
      detalle: 'El profe dijo que podemos usar cualquiera para el trabajo final.',
      curso: 'Estadística', facultad: 'FIPS', autorId: 'u-jhon', fecha: ahora - 4 * DIA,
      respuestas: [
        { id: 'r-8a', texto: 'R te sirve más a futuro, pero si el trabajo es corto Excel alcanza.', autorId: 'u-valeria', fecha: ahora - 3.8 * DIA, util: false },
      ],
    },
  ];
}

function gruposIniciales(): GrupoEstudio[] {
  return [
    { id: 'g-1', curso: 'Cálculo I', tema: 'Repaso para el primer parcial: límites y derivadas', lugarId: 'bib-ingenierias', horario: 'Mar y Jue · 4:00–6:00 p. m.', cupos: 6, miembros: ['u-valeria', 'u-renzo', 'u-mateo'] },
    { id: 'g-2', curso: 'Estructuras de Datos', tema: 'Practicar árboles y grafos en C++', lugarId: 'lab-computo-1', horario: 'Lun · 6:00–8:00 p. m.', cupos: 5, miembros: ['u-andrea', 'u-lucia', 'u-renzo', 'u-jhon', 'u-diego'] },
    { id: 'g-3', curso: 'Física I', tema: 'Resolver la guía de dinámica', lugarId: 'est-rotonda', horario: 'Mié · 3:00–5:00 p. m.', cupos: 4, miembros: ['u-jhon', 'u-diego'] },
    { id: 'g-4', curso: 'Química General', tema: 'Estequiometría y redox', lugarId: 'est-sala-civil', horario: 'Vie · 10:00 a. m.–12:00 m.', cupos: 6, miembros: ['u-camila'] },
    { id: 'g-5', curso: 'Base de Datos', tema: 'Proyecto final: modelo entidad-relación', lugarId: 'est-sala-sistemas', horario: 'Sáb · 9:00–11:00 a. m.', cupos: 4, miembros: ['u-lucia', 'u-valeria'] },
  ];
}

function eventosIniciales(ahora: number): Evento[] {
  const hoy = inicioDeHoy(ahora);
  /** Día relativo a hoy + hora local (24 h). */
  const el = (dias: number, hora: number, minutos = 0) => hoy + dias * DIA + hora * HORA + minutos * MIN;
  // Un evento "en curso" y otro "más tarde hoy", sin importar a qué hora se abra la demo.
  const mediaHora = 30 * MIN;
  const redondeado = Math.ceil(ahora / mediaHora) * mediaHora;

  return [
    {
      id: 'e-1', titulo: 'Feria de clubes estudiantiles', tipo: 'actividad', lugarId: 'est-rotonda',
      inicio: redondeado - 2 * mediaHora, fin: redondeado + 3 * mediaHora,
      descripcion: 'Conoce los clubes de robótica, programación competitiva, ajedrez y voluntariado. ¡Ideal para cachimbos!',
      interesados: ['u-mateo', 'u-renzo', 'u-camila', 'u-jhon'],
    },
    {
      id: 'e-2', titulo: 'Taller: Git y GitHub desde cero', tipo: 'taller', facultad: 'FIPS', lugarId: 'lab-computo-1',
      inicio: redondeado + 4 * mediaHora, fin: redondeado + 8 * mediaHora,
      descripcion: 'Aprende a versionar tus proyectos del curso. Trae tu laptop con Git instalado. Cupos limitados al aforo del laboratorio.',
      interesados: ['u-lucia', 'u-andrea', 'u-valeria'],
    },
    {
      id: 'e-3', titulo: 'Conferencia: Inteligencia artificial en la minería', tipo: 'conferencia', facultad: 'FIGMM', lugarId: 'auditorio',
      inicio: el(1, 10), fin: el(1, 12),
      descripcion: 'Cómo se usan los modelos de IA para la seguridad en minas a tajo abierto. Entrega de constancia de asistencia.',
      interesados: ['u-mateo', 'u-andrea'],
    },
    {
      id: 'e-4', titulo: 'Taller de primeros auxilios', tipo: 'taller', lugarId: 'of-topico',
      inicio: el(2, 15), fin: el(2, 17),
      descripcion: 'Organizado por Bienestar Universitario. Aprende RCP básico y qué hacer ante desmayos o quemaduras.',
      interesados: ['u-camila'],
    },
    {
      id: 'e-5', titulo: 'Charla de becas de pregrado', tipo: 'evento', lugarId: 'of-bienestar',
      inicio: el(3, 11), fin: el(3, 12, 30),
      descripcion: 'Requisitos y fechas de postulación a las becas de comedor y de estudio.',
      interesados: ['u-mateo', 'u-renzo', 'u-diego', 'u-jhon', 'u-camila'],
    },
    {
      id: 'e-6', titulo: 'Concurso de puentes de tallarines', tipo: 'actividad', facultad: 'Civil', lugarId: 'fac-fic',
      inicio: el(4, 9), fin: el(4, 13),
      descripcion: 'Equipos de hasta 4 integrantes. Gana el puente que resista más peso. Inscripciones en el pabellón de Civil.',
      interesados: ['u-diego'],
    },
    {
      id: 'e-7', titulo: 'Conferencia: Diseño centrado en el usuario', tipo: 'conferencia', facultad: 'FIPS', lugarId: 'auditorio',
      inicio: el(6, 17), fin: el(6, 19),
      descripcion: 'Qué es la experiencia de usuario, cómo se hacen pruebas de usabilidad y por qué importa en cualquier ingeniería.',
      interesados: ['u-lucia', 'u-valeria', 'u-andrea'],
    },
    {
      id: 'e-8', titulo: 'Taller de laboratorio: seguridad química', tipo: 'taller', facultad: 'Procesos', lugarId: 'lab-quimica',
      inicio: el(8, 10), fin: el(8, 12),
      descripcion: 'Obligatorio para los que llevan Química General este semestre. Trae mandil.',
      interesados: ['u-camila'],
    },
    {
      id: 'e-9', titulo: 'Olimpiada de matemática', tipo: 'evento', facultad: 'Ciencias', lugarId: 'fac-fcnf',
      inicio: el(10, 8, 30), fin: el(10, 12),
      descripcion: 'Competencia individual de razonamiento matemático. Premios para los tres primeros puestos.',
      interesados: ['u-jhon', 'u-renzo'],
    },
    {
      id: 'e-10', titulo: 'Campeonato interfacultades de fulbito', tipo: 'actividad', lugarId: 'est-rotonda',
      inicio: el(12, 14), fin: el(12, 18),
      descripcion: 'Arma tu equipo de 6 con compañeros de tu escuela. Inscripción gratuita.',
      interesados: ['u-diego', 'u-mateo', 'u-renzo'],
    },
  ];
}

/** Crea todos los datos de ejemplo con fechas relativas a `ahora`. */
export function crearDatosIniciales(ahora = Date.now()) {
  return {
    usuarios: USUARIOS_MOCK.map((u) => ({ ...u })),
    reportes: reportesIniciales(ahora),
    preguntas: preguntasIniciales(ahora),
    grupos: gruposIniciales(),
    eventos: eventosIniciales(ahora),
  };
}
