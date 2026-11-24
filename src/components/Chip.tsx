import type { ReactNode } from 'react';

// Heurística 6 (reconocer antes que recordar): los filtros se eligen tocando chips visibles,
// sin tener que escribir ni recordar opciones.

interface ChipProps {
  activo: boolean;
  onClick: () => void;
  children: ReactNode;
  icono?: ReactNode;
}

export function Chip({ activo, onClick, children, icono }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors ${
        activo
          ? 'border-primary-600 bg-primary-600 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
      }`}
    >
      {icono}
      {children}
    </button>
  );
}

/** Fila de chips con scroll horizontal (en 375 px no entran todos). */
export function ChipRow({ children, etiqueta }: { children: ReactNode; etiqueta: string }) {
  return (
    <div role="group" aria-label={etiqueta} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
      {children}
    </div>
  );
}
