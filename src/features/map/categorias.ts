import { BookOpen, Building2, Car, DoorOpen, FlaskConical, Landmark, Sofa, type LucideIcon } from 'lucide-react';
import type { Categoria } from '../../types';

// Datos visuales de cada categoría de lugar.
// Heurística 2 (coincidencia con el mundo real): nombres e íconos que el estudiante reconoce.
// Los ESPACIOS (biblioteca, estudio, estacionamiento) se pintan con el color del semáforo,
// por eso su color de categoría es neutro y no compite con verde/ámbar/rojo.

export interface InfoCategoria {
  etiqueta: string;
  plural: string;
  icono: LucideIcon;
  color: string;
}

export const CATEGORIAS: Record<Categoria, InfoCategoria> = {
  facultad: { etiqueta: 'Facultad', plural: 'Facultades', icono: Landmark, color: '#4f46e5' },
  aula: { etiqueta: 'Aula', plural: 'Aulas', icono: DoorOpen, color: '#0369a1' },
  laboratorio: { etiqueta: 'Laboratorio', plural: 'Laboratorios', icono: FlaskConical, color: '#7c3aed' },
  biblioteca: { etiqueta: 'Biblioteca', plural: 'Bibliotecas', icono: BookOpen, color: '#334155' },
  oficina: { etiqueta: 'Oficina', plural: 'Oficinas', icono: Building2, color: '#475569' },
  estacionamiento: { etiqueta: 'Estacionamiento', plural: 'Estacionamientos', icono: Car, color: '#334155' },
  espacio_estudio: { etiqueta: 'Espacio de estudio', plural: 'Espacios de estudio', icono: Sofa, color: '#334155' },
};

/** Orden de los chips de filtro en el mapa. */
export const ORDEN_CATEGORIAS: Categoria[] = [
  'facultad',
  'aula',
  'laboratorio',
  'biblioteca',
  'espacio_estudio',
  'estacionamiento',
  'oficina',
];
