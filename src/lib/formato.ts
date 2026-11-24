// Funciones de formato de fechas, distancias y nombres (español de Perú).

const MIN = 60_000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;

/** "hace un momento", "hace 5 min", "hace 2 h", "hace 3 días". */
export function haceCuanto(fecha: number, ahora = Date.now()) {
  const diff = Math.max(0, ahora - fecha);
  if (diff < MIN) return 'hace un momento';
  if (diff < HORA) return `hace ${Math.floor(diff / MIN)} min`;
  if (diff < DIA) return `hace ${Math.floor(diff / HORA)} h`;
  const dias = Math.floor(diff / DIA);
  return dias === 1 ? 'ayer' : `hace ${dias} días`;
}

const formatoHora = new Intl.DateTimeFormat('es-PE', { hour: 'numeric', minute: '2-digit', hour12: true });
const formatoDia = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
const formatoDiaCorto = new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });

export function hora(fecha: number) {
  return formatoHora.format(fecha).replace(/\s+/g, ' ');
}

function inicioDelDia(fecha: number) {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Diferencia en días calendario: 0 = hoy, 1 = mañana. */
export function diasDesdeHoy(fecha: number, ahora = Date.now()) {
  return Math.round((inicioDelDia(fecha) - inicioDelDia(ahora)) / DIA);
}

/** "Hoy", "Mañana" o "jueves 27 de noviembre". */
export function etiquetaDia(fecha: number, ahora = Date.now()) {
  const dias = diasDesdeHoy(fecha, ahora);
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Mañana';
  const texto = formatoDia.format(fecha);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** "Hoy · 4:00 p. m." o "jue. 27 nov. · 10:00 a. m." */
export function fechaCorta(fecha: number, ahora = Date.now()) {
  const dias = diasDesdeHoy(fecha, ahora);
  const dia = dias === 0 ? 'Hoy' : dias === 1 ? 'Mañana' : formatoDiaCorto.format(fecha);
  return `${dia} · ${hora(fecha)}`;
}

/** Distancia en línea recta entre dos coordenadas (fórmula de Haversine), en metros. */
export function distanciaMetros(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6_371_000;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Tiempo aproximado a pie. Se usa 75 m/min (paso tranquilo) y se suma un 30 %
 * porque dentro del campus no se camina en línea recta.
 */
export function minutosAPie(metros: number) {
  return Math.max(1, Math.round((metros * 1.3) / 75));
}

export function metrosTexto(metros: number) {
  const m = Math.round((metros * 1.3) / 10) * 10;
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;
}

/** Iniciales para el avatar: "Lucía Quispe" → "LQ". */
export function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}

export function primerNombre(nombre: string) {
  return nombre.split(/\s+/)[0] ?? nombre;
}

/** "1 respuesta" / "3 respuestas". */
export function plural(n: number, singular: string, pluralTexto = `${singular}s`) {
  return `${n} ${n === 1 ? singular : pluralTexto}`;
}
