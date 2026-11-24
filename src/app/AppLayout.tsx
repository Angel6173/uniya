import { CircleHelp, Star } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { ToastHost } from '../components/Toast';
import { Avatar } from '../components/ui';
import { UNIVERSIDAD } from '../data/campus';
import { useUsuarioActual } from '../hooks/useUsuarioActual';

// Estructura común de todas las pantallas (menos el login):
// cabecera arriba, contenido al centro y barra de navegación abajo.
// En escritorio la app va centrada con un ancho máximo de 480 px sobre un fondo de color.

export function AppLayout() {
  const usuario = useUsuarioActual();
  const { pathname } = useLocation();
  const contenido = useRef<HTMLElement>(null);

  // Al cambiar de pantalla, vuelve arriba.
  useEffect(() => {
    contenido.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-dvh">
      <div className="mx-auto flex h-dvh max-w-[480px] flex-col bg-slate-50 shadow-2xl">
        <header className="z-[1100] flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <Link to="/" className="mr-auto flex min-h-[44px] items-center gap-2 rounded-lg" aria-label="UniYa, ir al inicio">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            <span className="leading-tight">
              <span className="block text-lg font-extrabold text-primary-700">UniYa</span>
              <span className="block text-[11px] font-medium text-slate-600">
                {UNIVERSIDAD.sigla} · {UNIVERSIDAD.campus}
              </span>
            </span>
          </Link>
          {/* Heurística 10: la ayuda siempre está a un toque. */}
          <Link
            to="/ayuda"
            aria-label="¿Cómo funciona UniYa?"
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
          >
            <CircleHelp className="h-6 w-6" aria-hidden />
          </Link>
          {usuario && (
            <Link
              to="/perfil"
              aria-label={`Mi perfil: ${usuario.nombre}, ${usuario.puntos} puntos`}
              className="flex min-h-[44px] items-center gap-1.5 rounded-full py-1 pl-2.5 pr-1 hover:bg-slate-100"
            >
              {/* Heurística 1: los puntos se ven siempre y suben al aportar. */}
              <span className="flex items-center gap-0.5 text-sm font-bold text-amber-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden />
                {usuario.puntos}
              </span>
              <Avatar nombre={usuario.nombre} tamano="sm" />
            </Link>
          )}
        </header>

        <main ref={contenido} className="relative flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <BottomNav />
      </div>
      <ToastHost />
    </div>
  );
}

/** Contenedor estándar de una pantalla con su título. */
export function Pantalla({ titulo, subtitulo, children }: { titulo?: string; subtitulo?: string; children: ReactNode }) {
  return (
    <div className="space-y-4 px-4 pb-8 pt-4">
      {titulo && (
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{titulo}</h1>
          {subtitulo && <p className="mt-0.5 text-sm text-slate-600">{subtitulo}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
