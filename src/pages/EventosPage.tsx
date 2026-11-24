import { CalendarX2, Star } from 'lucide-react';
import { useState } from 'react';
import { Pantalla } from '../app/AppLayout';
import { Chip, ChipRow } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { Button, CargandoLista, SelectField } from '../components/ui';
import { FACULTADES } from '../data/campus';
import { EventCard } from '../features/events/EventCard';
import { TIPOS_EVENTO } from '../features/events/tipos';
import { useAhora, useLive } from '../hooks/useLive';
import { useUsuarioActual } from '../hooks/useUsuarioActual';
import { diasDesdeHoy, etiquetaDia } from '../lib/formato';
import { eventsService } from '../services/eventsService';
import type { Evento, TipoEvento } from '../types';

// Módulo 4 · Agenda de eventos, talleres, conferencias y actividades.

type Cuando = 'todas' | 'hoy' | 'semana' | 'interesan';

const CUANDO: { id: Cuando; texto: string }[] = [
  { id: 'todas', texto: 'Próximos' },
  { id: 'hoy', texto: 'Hoy' },
  { id: 'semana', texto: 'Esta semana' },
  { id: 'interesan', texto: 'Me interesan' },
];

export function EventosPage() {
  const eventos = useLive(eventsService.subscribe);
  const yo = useUsuarioActual();
  const ahora = useAhora();
  const [cuando, setCuando] = useState<Cuando>('todas');
  const [tipo, setTipo] = useState<TipoEvento | 'todos'>('todos');
  const [facultad, setFacultad] = useState('');

  const hayFiltros = cuando !== 'todas' || tipo !== 'todos' || facultad !== '';
  const filtrados = (eventos ?? []).filter((e) => {
    const dias = diasDesdeHoy(e.inicio, ahora);
    if (cuando === 'hoy' && dias > 0) return false;
    if (cuando === 'semana' && dias > 6) return false;
    if (cuando === 'interesan' && !(yo && e.interesados.includes(yo.id))) return false;
    if (tipo !== 'todos' && e.tipo !== tipo) return false;
    if (facultad && e.facultad !== facultad) return false;
    return true;
  });

  // Agrupar por día: "Hoy", "Mañana", "Jueves 27 de noviembre"…
  const grupos = new Map<string, Evento[]>();
  filtrados.forEach((e) => {
    const dia = e.inicio <= ahora ? 'Hoy' : etiquetaDia(e.inicio, ahora);
    grupos.set(dia, [...(grupos.get(dia) ?? []), e]);
  });

  function limpiar() {
    setCuando('todas');
    setTipo('todos');
    setFacultad('');
  }

  return (
    <Pantalla titulo="Eventos" subtitulo="Talleres, conferencias y actividades del campus, en un solo lugar.">
      <ChipRow etiqueta="Filtrar por fecha">
        {CUANDO.map((c) => (
          <Chip
            key={c.id}
            activo={cuando === c.id}
            onClick={() => setCuando(c.id)}
            icono={c.id === 'interesan' ? <Star className="h-4 w-4" aria-hidden /> : undefined}
          >
            {c.texto}
          </Chip>
        ))}
      </ChipRow>
      <ChipRow etiqueta="Filtrar por tipo">
        <Chip activo={tipo === 'todos'} onClick={() => setTipo('todos')}>
          Todos los tipos
        </Chip>
        {(Object.keys(TIPOS_EVENTO) as TipoEvento[]).map((t) => (
          <Chip key={t} activo={tipo === t} onClick={() => setTipo(t)}>
            {TIPOS_EVENTO[t].plural}
          </Chip>
        ))}
      </ChipRow>
      <SelectField etiqueta="Facultad" value={facultad} onChange={(e) => setFacultad(e.target.value)}>
        <option value="">Todas las facultades</option>
        {FACULTADES.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </SelectField>

      {eventos === undefined ? (
        <CargandoLista />
      ) : filtrados.length === 0 ? (
        <EmptyState
          icono={CalendarX2}
          titulo={cuando === 'interesan' && !hayFiltros ? 'Aún no guardaste eventos' : 'No hay eventos con estos filtros'}
          texto={
            cuando === 'interesan'
              ? 'Abre un evento y toca "Me interesa" para tenerlo aquí a la mano.'
              : 'Prueba con otra fecha, otro tipo o todas las facultades.'
          }
          accion={
            hayFiltros && (
              <Button variante="secundario" onClick={limpiar}>
                Quitar filtros
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-slate-600" aria-live="polite">
            {filtrados.length} {filtrados.length === 1 ? 'evento' : 'eventos'}
          </p>
          {[...grupos.entries()].map(([dia, lista]) => (
            <section key={dia} aria-label={dia}>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">{dia}</h2>
              <div className="space-y-3">
                {lista.map((e) => (
                  <EventCard key={e.id} evento={e} ahora={ahora} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Pantalla>
  );
}
