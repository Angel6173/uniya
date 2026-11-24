import { Clock, MapPin, SearchX, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Chip, ChipRow } from '../components/Chip';
import { SearchBar } from '../components/SearchBar';
import { CampusMap } from '../features/map/CampusMap';
import { CATEGORIAS, ORDEN_CATEGORIAS } from '../features/map/categorias';
import { PlaceSheet } from '../features/map/PlaceSheet';
import { useAhora, useLive } from '../hooks/useLive';
import { eventsService } from '../services/eventsService';
import { placesService } from '../services/placesService';
import { spacesService } from '../services/spacesService';
import type { Categoria, Lugar } from '../types';

// Módulo 1 · Mapa interactivo del campus.
// Parámetros de la URL (para enlazar desde otras pantallas):
//   /mapa?lugar=bib-ingenierias  → abre la ficha de ese lugar
//   /mapa?q=aula 301             → abre el buscador con ese texto

export function MapaPage() {
  const [params, setParams] = useSearchParams();
  const lugares = placesService.getAll();
  const espacios = useLive(spacesService.subscribe) ?? [];
  const eventos = useLive(eventsService.subscribe) ?? [];
  const recientes = useLive(placesService.subscribeRecientes) ?? [];
  const ahora = useAhora();

  const [categoria, setCategoria] = useState<Categoria | 'todas'>('todas');
  const [consulta, setConsulta] = useState(params.get('q') ?? '');
  const [buscando, setBuscando] = useState(!!params.get('q'));
  const [mostrarRuta, setMostrarRuta] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // El lugar seleccionado vive en la URL: así el botón "atrás" del celular cierra la ficha (Heurística 3).
  const seleccionadoId = params.get('lugar');
  const seleccionado = seleccionadoId ? placesService.getById(seleccionadoId) : undefined;

  useEffect(() => {
    if (params.get('q')) inputRef.current?.focus();
  }, []); // solo al entrar

  useEffect(() => setMostrarRuta(false), [seleccionadoId]);

  const resultados = useMemo(() => placesService.search(consulta), [consulta]);
  const visibles = categoria === 'todas' ? lugares : lugares.filter((l) => l.categoria === categoria);
  // El lugar elegido siempre se ve, aunque su categoría esté filtrada.
  const marcadores = seleccionado && !visibles.includes(seleccionado) ? [...visibles, seleccionado] : visibles;

  function seleccionar(id: string | null) {
    setParams(id ? { lugar: id } : {}, { replace: !!seleccionadoId });
  }

  function elegirResultado(lugar: Lugar) {
    placesService.agregarReciente(lugar.id);
    setConsulta('');
    setBuscando(false);
    inputRef.current?.blur();
    seleccionar(lugar.id);
  }

  const mostrarPanel = buscando && (consulta.trim() !== '' || recientes.length > 0);

  return (
    <div className="absolute inset-0">
      <div className="h-full w-full" role="region" aria-label="Mapa del campus">
        <CampusMap
          lugares={marcadores}
          espacios={espacios}
          ahora={ahora}
          seleccionadoId={seleccionadoId}
          mostrarRuta={mostrarRuta}
          onSeleccionar={seleccionar}
        />
      </div>

      {/* Buscador y filtros flotando sobre el mapa */}
      <div className="absolute inset-x-0 top-0 z-[1000] space-y-2 bg-gradient-to-b from-white/90 via-white/70 to-transparent px-4 pb-4 pt-3">
        <SearchBar
          ref={inputRef}
          etiqueta="Buscar un lugar del campus"
          placeholder='Busca "aula 301", "biblioteca"…'
          valor={consulta}
          onCambiar={(t) => {
            setConsulta(t);
            setBuscando(true);
          }}
          onFocus={() => setBuscando(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setBuscando(false);
              inputRef.current?.blur();
            }
            if (e.key === 'Enter' && resultados[0]) elegirResultado(resultados[0]);
          }}
        />

        {mostrarPanel ? (
          <div className="max-h-[55vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
            {consulta.trim() === '' ? (
              // Heurística 6: búsquedas recientes para no tener que volver a escribir.
              <>
                <div className="flex items-center justify-between px-4 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Búsquedas recientes</p>
                  <button
                    type="button"
                    onClick={() => placesService.borrarRecientes()}
                    className="flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm text-slate-600 hover:bg-slate-100"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden /> Borrar
                  </button>
                </div>
                <ListaLugares lugares={recientes} icono="reciente" onElegir={elegirResultado} />
              </>
            ) : resultados.length > 0 ? (
              <ListaLugares lugares={resultados} icono="categoria" onElegir={elegirResultado} />
            ) : (
              // Heurística 9: decir qué pasó y qué probar.
              <div className="flex items-start gap-3 p-4 text-sm text-slate-700">
                <SearchX className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
                <p>
                  No encontramos "<strong>{consulta}</strong>". Prueba con el número del aula, el nombre del pabellón o una palabra
                  como "biblioteca" o "estacionamiento".
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setBuscando(false)}
              className="min-h-[44px] w-full border-t border-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cerrar búsqueda
            </button>
          </div>
        ) : (
          <ChipRow etiqueta="Filtrar lugares por categoría">
            <Chip activo={categoria === 'todas'} onClick={() => setCategoria('todas')}>
              Todos
            </Chip>
            {ORDEN_CATEGORIAS.map((c) => {
              const Icono = CATEGORIAS[c].icono;
              return (
                <Chip key={c} activo={categoria === c} onClick={() => setCategoria(c)} icono={<Icono className="h-4 w-4" aria-hidden />}>
                  {CATEGORIAS[c].plural}
                </Chip>
              );
            })}
          </ChipRow>
        )}
      </div>

      {seleccionado && (
        <PlaceSheet
          key={seleccionado.id}
          lugar={seleccionado}
          espacio={espacios.find((e) => e.lugar.id === seleccionado.id)}
          eventos={eventos.filter((e) => e.lugarId === seleccionado.id)}
          ahora={ahora}
          mostrarRuta={mostrarRuta}
          onComoLlegar={() => setMostrarRuta(true)}
          onCerrar={() => seleccionar(null)}
        />
      )}
    </div>
  );
}

function ListaLugares({ lugares, icono, onElegir }: { lugares: Lugar[]; icono: 'reciente' | 'categoria'; onElegir: (l: Lugar) => void }) {
  return (
    <ul className="py-1">
      {lugares.map((lugar) => {
        const info = CATEGORIAS[lugar.categoria];
        const Icono = icono === 'reciente' ? Clock : info.icono;
        return (
          <li key={lugar.id}>
            <button
              type="button"
              onClick={() => onElegir(lugar)}
              className="flex min-h-[52px] w-full items-center gap-3 px-4 py-2 text-left hover:bg-slate-50"
            >
              <Icono className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-slate-900">{lugar.nombre}</span>
                <span className="block truncate text-sm text-slate-600">
                  {[info.etiqueta, lugar.edificio, lugar.piso && `Piso ${lugar.piso}`].filter(Boolean).join(' · ')}
                </span>
              </span>
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
