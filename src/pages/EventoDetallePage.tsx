import { ArrowLeft, CalendarDays, Clock, MapPin, Star, Users } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pantalla } from '../app/AppLayout';
import { EmptyState } from '../components/EmptyState';
import { Button, Skeleton } from '../components/ui';
import { alternarInteres, TIPOS_EVENTO } from '../features/events/tipos';
import { useAhora, useLive } from '../hooks/useLive';
import { useUsuarioActual } from '../hooks/useUsuarioActual';
import { etiquetaDia, hora } from '../lib/formato';
import { eventsService } from '../services/eventsService';
import { placesService } from '../services/placesService';
import type { Evento } from '../types';

export function EventoDetallePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const evento = useLive<Evento | null>((cb) => eventsService.subscribeOne(id, cb), [id]);
  const yo = useUsuarioActual();
  const ahora = useAhora();

  const volver = (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="-ml-2 flex min-h-[44px] items-center gap-1 rounded-lg px-2 font-semibold text-primary-700 hover:bg-primary-50"
    >
      <ArrowLeft className="h-5 w-5" aria-hidden /> Volver
    </button>
  );

  if (evento === undefined) return <Skeleton className="m-4 h-64" />;
  if (!evento) {
    return (
      <Pantalla>
        {volver}
        <EmptyState
          icono={CalendarDays}
          titulo="No encontramos este evento"
          texto="Puede que lo hayan eliminado o que el enlace esté mal escrito."
          accion={
            <Link to="/eventos" className="font-semibold text-primary-700 underline">
              Ver todos los eventos
            </Link>
          }
        />
      </Pantalla>
    );
  }

  const tipo = TIPOS_EVENTO[evento.tipo];
  const lugar = placesService.getById(evento.lugarId);
  const meInteresa = !!yo && evento.interesados.includes(yo.id);
  const yaTermino = evento.fin <= ahora;

  return (
    <Pantalla>
      {volver}
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tipo.clase}`}>{tipo.etiqueta}</span>
          {evento.facultad && <span className="text-sm font-medium text-slate-600">{evento.facultad}</span>}
        </div>
        <h1 className="text-2xl font-extrabold leading-tight text-slate-900">{evento.titulo}</h1>
      </div>

      <ul className="space-y-3 rounded-2xl bg-white p-4 shadow-suave">
        <li className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
          <span>
            <span className="block font-semibold text-slate-900">{etiquetaDia(evento.inicio, ahora)}</span>
            <span className="flex items-center gap-1 text-sm text-slate-700">
              <Clock className="h-4 w-4" aria-hidden /> {hora(evento.inicio)} – {hora(evento.fin)}
            </span>
          </span>
        </li>
        {lugar && (
          <li>
            {/* El lugar del evento enlaza al mapa. */}
            <Link to={`/mapa?lugar=${lugar.id}`} className="-m-2 flex items-start gap-3 rounded-xl p-2 hover:bg-primary-50">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
              <span>
                <span className="block font-semibold text-slate-900">{lugar.nombre}</span>
                <span className="text-sm font-semibold text-primary-700">Ver en el mapa →</span>
              </span>
            </Link>
          </li>
        )}
        <li className="flex items-center gap-3">
          <Users className="h-5 w-5 shrink-0 text-primary-600" aria-hidden />
          <span className="text-slate-800" aria-live="polite">
            <strong>{evento.interesados.length}</strong> {evento.interesados.length === 1 ? 'persona interesada' : 'personas interesadas'}
            {meInteresa && ', contándote a ti'}
          </span>
        </li>
      </ul>

      <section>
        <h2 className="mb-1 font-bold text-slate-900">Descripción</h2>
        <p className="leading-relaxed text-slate-700">{evento.descripcion}</p>
      </section>

      {/* Heurística 8: una sola acción principal en la pantalla. */}
      <Button
        className="w-full"
        variante={meInteresa ? 'secundario' : 'primario'}
        aria-pressed={meInteresa}
        disabled={yaTermino}
        icono={<Star className={`h-5 w-5 ${meInteresa ? 'fill-amber-400 text-amber-500' : ''}`} aria-hidden />}
        onClick={() => alternarInteres(evento)}
      >
        {yaTermino ? 'Este evento ya terminó' : meInteresa ? 'Te interesa · tocar para quitar' : 'Me interesa'}
      </Button>
    </Pantalla>
  );
}
