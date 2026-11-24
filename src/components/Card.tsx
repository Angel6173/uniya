import type { HTMLAttributes } from 'react';

/** Tarjeta blanca con esquinas redondeadas y sombra suave (misma en todos los módulos). */
export function Card({ className = '', ...resto }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-suave ${className}`} {...resto} />;
}
