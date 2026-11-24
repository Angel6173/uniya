import L from 'leaflet';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DoorOpen } from 'lucide-react';
import type { Lugar } from '../../types';
import { CATEGORIAS } from './categorias';

// Íconos de los marcadores del mapa (círculo de color con el ícono de la categoría).
// Los espacios usan el color del semáforo; el resto, el color de su categoría.

const cache = new Map<string, L.DivIcon>();

function svgDe(icono: typeof DoorOpen) {
  return renderToStaticMarkup(createElement(icono, { size: 16, color: '#ffffff', strokeWidth: 2.5, 'aria-hidden': true }));
}

export function iconoLugar(lugar: Lugar, color: string, activo: boolean) {
  const clave = `${lugar.categoria}-${color}-${activo}`;
  let icono = cache.get(clave);
  if (!icono) {
    const tamano = 34;
    icono = L.divIcon({
      className: '', // sin el fondo blanco por defecto de Leaflet
      html: `<div class="marcador ${activo ? 'marcador--activo' : ''}" style="background:${color}">${svgDe(CATEGORIAS[lugar.categoria].icono)}</div>`,
      iconSize: [tamano, tamano],
      iconAnchor: [tamano / 2, tamano / 2],
    });
    cache.set(clave, icono);
  }
  return icono;
}

export const iconoPuerta = L.divIcon({
  className: '',
  html: `<div class="marcador marcador--puerta">${svgDe(DoorOpen)}</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});
