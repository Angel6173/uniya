import { CalendarDays, Home, Map, MessagesSquare, ParkingSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Barra de navegación inferior con las 5 secciones principales.
// Heurística 1: la pestaña activa se resalta (color + texto en negrita) para saber dónde estoy.

const PESTANAS = [
  { a: '/', texto: 'Inicio', icono: Home },
  { a: '/mapa', texto: 'Mapa', icono: Map },
  { a: '/comunidad', texto: 'Comunidad', icono: MessagesSquare },
  { a: '/espacios', texto: 'Espacios', icono: ParkingSquare },
  { a: '/eventos', texto: 'Eventos', icono: CalendarDays },
];

export function BottomNav() {
  return (
    <nav aria-label="Secciones principales" className="border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {PESTANAS.map(({ a, texto, icono: Icono }) => (
          <li key={a}>
            <NavLink
              to={a}
              end={a === '/'}
              className={({ isActive }) =>
                `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] ${
                  isActive ? 'font-bold text-primary-700' : 'font-medium text-slate-600 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-7 w-12 items-center justify-center rounded-full ${isActive ? 'bg-primary-100' : ''}`}>
                    <Icono className="h-5 w-5" aria-hidden />
                  </span>
                  {texto}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
