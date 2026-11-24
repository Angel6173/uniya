import { Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fechaCorta, hora } from '../../lib/formato';
import { placesService } from '../../services/placesService';
import type { Evento } from '../../types';
import { TIPOS_EVENTO } from './tipos';

/** Tarjeta de evento. Toda la tarjeta es un enlace al detalle. */
export function EventCard({ evento, ahora, compacta = false }: { evento: Evento; ahora: number; compacta?: boolean }) {
  const tipo = TIPOS_EVENTO[evento.tipo];
  const lugar = placesService.getById(evento.lugarId);
  const enCurso = evento.inicio <= ahora && ahora < evento.fin;

  return (
    <Link
      to={`/eventos/${evento.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-suave transition hover:border-primary-300"
    >
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tipo.clase}`}>{tipo.etiqueta}</span>
        {evento.facultad && <span className="text-xs font-medium text-slate-600">{evento.facultad}</span>}
        {enCurso && (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" aria-hidden /> En curso
          </span>
        )}
      </div>
      <h3 className="font-bold leading-snug text-slate-900">{evento.titulo}</h3>
      <div className="mt-2 space-y-1 text-sm text-slate-700">
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          {enCurso ? `Hasta las ${hora(evento.fin)}` : fechaCorta(evento.inicio, ahora)}
        </p>
        {!compacta && lugar && (
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            <span className="truncate">{lugar.nombre}</span>
          </p>
        )}
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          {evento.interesados.length} interesados
        </p>
      </div>
    </Link>
  );
}
