import { useState } from 'react';
import { Pantalla } from '../app/AppLayout';
import { Chip, ChipRow } from '../components/Chip';
import { CargandoLista } from '../components/ui';
import { SEMAFORO, estadoVisible, type EstadoVisible } from '../features/spaces/estado';
import { SpaceCard } from '../features/spaces/SpaceCard';
import { useAhora, useLive } from '../hooks/useLive';
import { spacesService } from '../services/spacesService';

// Módulo 3 · Disponibilidad de espacios.

type Filtro = 'todos' | 'estudio' | 'estacionamiento';

const FILTROS: { id: Filtro; texto: string }[] = [
  { id: 'todos', texto: 'Todos' },
  { id: 'estudio', texto: 'Para estudiar' },
  { id: 'estacionamiento', texto: 'Estacionamientos' },
];

export function EspaciosPage() {
  const espacios = useLive(spacesService.subscribe);
  const ahora = useAhora();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  // El orden de la lista es FIJO (no se reordena por estado):
  // si la tarjeta saltara de lugar justo después de tocar "Lleno", el usuario se perdería.
  const visibles = (espacios ?? []).filter((e) =>
    filtro === 'todos' ? true : filtro === 'estacionamiento' ? e.lugar.categoria === 'estacionamiento' : e.lugar.categoria !== 'estacionamiento',
  );

  const conteo: Record<EstadoVisible, number> = { libre: 0, medio: 0, lleno: 0, sin_datos: 0 };
  visibles.forEach((e) => conteo[estadoVisible(e.ultimoReporte, ahora).estado]++);

  return (
    <Pantalla titulo="Espacios" subtitulo="Mira si hay sitio antes de ir. Toca cómo está un lugar y ayudas a todos.">
      <ChipRow etiqueta="Filtrar espacios">
        {FILTROS.map((f) => (
          <Chip key={f.id} activo={filtro === f.id} onClick={() => setFiltro(f.id)}>
            {f.texto}
          </Chip>
        ))}
      </ChipRow>

      {/* Resumen + leyenda del semáforo (Heurística 6: no hay que recordar qué significa cada color). */}
      <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-3 shadow-suave" aria-label="Resumen de disponibilidad">
        {(Object.keys(SEMAFORO) as EstadoVisible[]).map((estado) => (
          <div key={estado} className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: SEMAFORO[estado].color }} aria-hidden />
              <span className="text-xl font-extrabold text-slate-900">{conteo[estado]}</span>
            </div>
            <span className="text-xs leading-tight text-slate-600">{SEMAFORO[estado].etiqueta}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600">Gris = nadie reportó en los últimos 60 minutos.</p>

      {espacios === undefined ? (
        <CargandoLista />
      ) : (
        <div className="space-y-3">
          {visibles.map((e) => (
            <SpaceCard key={e.lugar.id} espacio={e} ahora={ahora} />
          ))}
        </div>
      )}
    </Pantalla>
  );
}
