import { CheckCircle2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { haceCuanto, plural } from '../../lib/formato';
import type { Pregunta } from '../../types';

export function QuestionCard({ pregunta, autor, ahora }: { pregunta: Pregunta; autor: string; ahora: number }) {
  const resuelta = pregunta.respuestas.some((r) => r.util);
  return (
    <Link
      to={`/comunidad/preguntas/${pregunta.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-suave transition hover:border-primary-300"
    >
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        {pregunta.curso && <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-800">{pregunta.curso}</span>}
        {pregunta.facultad && <span className="text-xs font-medium text-slate-600">{pregunta.facultad}</span>}
      </div>
      <h3 className="font-bold leading-snug text-slate-900">{pregunta.titulo}</h3>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
        <span>
          {autor} · {haceCuanto(pregunta.fecha, ahora)}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <MessageCircle className="h-4 w-4" aria-hidden />
          {plural(pregunta.respuestas.length, 'respuesta')}
        </span>
        {resuelta && (
          <span className="flex items-center gap-1 font-semibold text-green-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Resuelta
          </span>
        )}
      </div>
    </Link>
  );
}
