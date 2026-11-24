import { ChevronRight, Map, MessageCirclePlus, ParkingSquare, Users } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pantalla } from '../app/AppLayout';
import { SearchBar } from '../components/SearchBar';
import { StatusBadge } from '../components/StatusBadge';
import { SectionTitle, Skeleton } from '../components/ui';
import { QuestionCard } from '../features/community/QuestionCard';
import { EventCard } from '../features/events/EventCard';
import { CATEGORIAS } from '../features/map/categorias';
import { estadoVisible } from '../features/spaces/estado';
import { useAhora, useLive } from '../hooks/useLive';
import { nombreAutor, useUsuarioActual, useUsuarios } from '../hooks/useUsuarioActual';
import { haceCuanto, primerNombre } from '../lib/formato';
import { communityService } from '../services/communityService';
import { eventsService } from '../services/eventsService';
import { spacesService } from '../services/spacesService';

// Pantalla de inicio (dashboard): un resumen de todo el campus.
// Heurística 7 (flexibilidad): accesos rápidos y búsqueda global para el usuario frecuente.

const ACCESOS = [
  { a: '/mapa', texto: 'Ver mapa', icono: Map, color: 'bg-primary-100 text-primary-800' },
  { a: '/espacios', texto: 'Reportar espacio', icono: ParkingSquare, color: 'bg-green-100 text-green-800' },
  { a: '/comunidad/preguntas/nueva', texto: 'Preguntar', icono: MessageCirclePlus, color: 'bg-amber-100 text-amber-900' },
  { a: '/comunidad?tab=grupos', texto: 'Grupos', icono: Users, color: 'bg-sky-100 text-sky-900' },
];

export function InicioPage() {
  const navigate = useNavigate();
  const yo = useUsuarioActual();
  const usuarios = useUsuarios();
  const espacios = useLive(spacesService.subscribe);
  const eventos = useLive(eventsService.subscribe);
  const preguntas = useLive(communityService.subscribePreguntas);
  const ahora = useAhora();
  const [busqueda, setBusqueda] = useState('');

  function buscar(e: FormEvent) {
    e.preventDefault();
    navigate(busqueda.trim() ? `/mapa?q=${encodeURIComponent(busqueda.trim())}` : '/mapa');
  }

  // Espacios con dato fresco, primero los libres. Los "sin datos" no se muestran aquí.
  const ORDEN = { libre: 0, medio: 1, lleno: 2, sin_datos: 3 };
  const conDatos = (espacios ?? [])
    .map((e) => ({ ...e, visible: estadoVisible(e.ultimoReporte, ahora).estado }))
    .filter((e) => e.visible !== 'sin_datos')
    .sort((a, b) => ORDEN[a.visible] - ORDEN[b.visible]);
  const libres = conDatos.filter((e) => e.visible === 'libre').length;

  return (
    <Pantalla>
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">¡Hola, {yo ? primerNombre(yo.nombre) : ''}! 👋</h1>
        <p className="text-slate-600">¿Qué necesitas hoy en el campus?</p>
      </div>

      <form onSubmit={buscar} role="search">
        <SearchBar
          etiqueta="Buscar un lugar del campus"
          placeholder='Busca "aula 301", "biblioteca"…'
          valor={busqueda}
          onCambiar={setBusqueda}
          enterKeyHint="search"
        />
      </form>

      <nav aria-label="Accesos rápidos" className="grid grid-cols-4 gap-2">
        {ACCESOS.map(({ a, texto, icono: Icono, color }) => (
          <Link key={a} to={a} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2 py-3 text-center shadow-suave hover:bg-slate-50">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
              <Icono className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-semibold leading-tight text-slate-800">{texto}</span>
          </Link>
        ))}
      </nav>

      <section>
        <SectionTitle titulo="Espacios ahora" accion={<VerTodo a="/espacios" />} />
        {espacios === undefined ? (
          <Skeleton className="h-28" />
        ) : conDatos.length === 0 ? (
          <Link to="/espacios" className="block rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
            Nadie reportó espacios en la última hora. <strong className="text-primary-700">Sé el primero en reportar →</strong>
          </Link>
        ) : (
          <>
            <p className="mb-2 text-sm text-slate-600" aria-live="polite">
              {libres === 0 ? 'Ningún espacio libre según los últimos reportes.' : `${libres} ${libres === 1 ? 'espacio libre' : 'espacios libres'} ahora mismo.`}
            </p>
            <ul className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
              {conDatos.map((e) => {
                const Icono = CATEGORIAS[e.lugar.categoria].icono;
                return (
                  <li key={e.lugar.id} className="w-44 shrink-0">
                    <Link
                      to={`/mapa?lugar=${e.lugar.id}`}
                      className="flex h-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-suave hover:border-primary-300"
                    >
                      <Icono className="h-5 w-5 text-slate-500" aria-hidden />
                      <span className="line-clamp-2 text-sm font-bold leading-snug text-slate-900">{e.lugar.nombre}</span>
                      <span className="mt-auto">
                        <StatusBadge estado={e.visible} />
                      </span>
                      <span className="text-xs text-slate-600">{e.ultimoReporte && haceCuanto(e.ultimoReporte.fecha, ahora)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      <section>
        <SectionTitle titulo="Próximos eventos" accion={<VerTodo a="/eventos" />} />
        <div className="space-y-3">
          {eventos === undefined ? <Skeleton className="h-28" /> : eventos.slice(0, 2).map((e) => <EventCard key={e.id} evento={e} ahora={ahora} compacta />)}
        </div>
      </section>

      <section>
        <SectionTitle titulo="Preguntas recientes" accion={<VerTodo a="/comunidad" />} />
        <div className="space-y-3">
          {preguntas === undefined ? (
            <Skeleton className="h-28" />
          ) : (
            preguntas.slice(0, 3).map((p) => <QuestionCard key={p.id} pregunta={p} autor={nombreAutor(usuarios, p.autorId, yo?.id)} ahora={ahora} />)
          )}
        </div>
      </section>

      <p className="pt-2 text-center text-xs text-slate-500">Datos de ejemplo · Prototipo UniYa, Fase 1</p>
    </Pantalla>
  );
}

function VerTodo({ a }: { a: string }) {
  return (
    <Link to={a} className="flex min-h-[44px] items-center gap-0.5 rounded-lg px-1 text-sm font-semibold text-primary-700 hover:underline">
      Ver todo <ChevronRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}
