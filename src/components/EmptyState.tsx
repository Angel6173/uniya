import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

// Heurística 10 (ayuda): un estado vacío explica POR QUÉ no hay nada y QUÉ hacer.

interface EmptyStateProps {
  icono: LucideIcon;
  titulo: string;
  texto: string;
  accion?: ReactNode;
}

export function EmptyState({ icono: Icono, titulo, texto, accion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Icono className="h-7 w-7" aria-hidden />
      </span>
      <h3 className="font-bold text-slate-900">{titulo}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-600">{texto}</p>
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  );
}
