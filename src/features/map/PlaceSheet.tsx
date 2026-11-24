import { CalendarDays, Clock, Footprints, Navigation, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/ui';
import { PUERTA_PRINCIPAL } from '../../data/campus';
import { distanciaMetros, fechaCorta, metrosTexto, minutosAPie } from '../../lib/formato';
import type { EspacioConEstado } from '../../services/spacesService';
import type { Evento, Lugar } from '../../types';
import { estadoVisible } from '../spaces/estado';
import { ReportButtons } from '../spaces/ReportButtons';
import { FrescuraDato } from '../spaces/SpaceCard';
import { CATEGORIAS } from './categorias';

// Ficha de lugar: aparece abajo, sobre el mapa, al tocar un marcador o un resultado de búsqueda.
// Heurística 8 (minimalista): la acción principal es "Cómo llegar".

interface PlaceSheetProps {
  lugar: Lugar;
  espacio?: EspacioConEstado;
  eventos: Evento[];
  ahora: number;
  mostrarRuta: boolean;
  onComoLlegar: () => void;
  onCerrar: () => void;
}

export function PlaceSheet({ lugar, espacio, eventos, ahora, mostrarRuta, onComoLlegar, onCerrar }: PlaceSheetProps) {
  const categoria = CATEGORIAS[lugar.categoria];
  const Icono = categoria.icono;
  const metros = distanciaMetros(PUERTA_PRINCIPAL, lugar);

  return (
    <section
      aria-label={`Ficha de ${lugar.nombre}`}
      className="animate-subir absolute inset-x-0 bottom-0 z-[1000] max-h-[62%] overflow-y-auto rounded-t-3xl bg-white px-4 pb-4 pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.18)]"
    >
      <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-slate-300" aria-hidden />
      <div className="flex items-start gap-3">
        <span
          className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: categoria.color }}
        >
          <Icono className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{categoria.etiqueta}</p>
          <h2 className="text-lg font-extrabold leading-snug text-slate-900">{lugar.nombre}</h2>
          {(lugar.edificio || lugar.piso) && (
            <p className="text-sm text-slate-700">
              {[lugar.edificio, lugar.piso && `Piso ${lugar.piso}`].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ficha"
          className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {lugar.horario && (
          <p className="flex items-center gap-2 text-sm text-slate-700">
            <Clock className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            {lugar.horario}
          </p>
        )}
        {lugar.descripcion && <p className="text-sm text-slate-700">{lugar.descripcion}</p>}

        {espacio && (
          <div className="space-y-2 rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-800">Disponibilidad</span>
              <StatusBadge estado={estadoVisible(espacio.ultimoReporte, ahora).estado} />
            </div>
            <FrescuraDato espacio={espacio} ahora={ahora} />
            <ReportButtons lugar={lugar} />
          </div>
        )}

        {/* Heurística 1: tras "Cómo llegar" se ve claramente la distancia y el tiempo. */}
        {mostrarRuta ? (
          <div className="flex items-center gap-3 rounded-2xl bg-primary-50 p-3 text-primary-900" role="status">
            <Footprints className="h-6 w-6 shrink-0" aria-hidden />
            <p className="text-sm">
              <strong className="text-base">
                ≈ {minutosAPie(metros)} min a pie ({metrosTexto(metros)})
              </strong>
              <br />
              desde: {PUERTA_PRINCIPAL.nombre}. Sigue la línea punteada.
            </p>
          </div>
        ) : (
          <Button className="w-full" icono={<Navigation className="h-5 w-5" aria-hidden />} onClick={onComoLlegar}>
            Cómo llegar
          </Button>
        )}

        {eventos.length > 0 && (
          <div>
            <p className="mb-1 text-sm font-semibold text-slate-800">Próximos eventos aquí</p>
            <ul className="space-y-1">
              {eventos.slice(0, 3).map((e) => (
                <li key={e.id}>
                  <Link
                    to={`/eventos/${e.id}`}
                    className="flex min-h-[44px] items-center gap-2 rounded-lg px-1 text-sm text-primary-700 hover:bg-primary-50"
                  >
                    <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="font-semibold">{e.titulo}</span>
                    <span className="ml-auto shrink-0 text-xs text-slate-600">{fechaCorta(e.inicio, ahora)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
