import type { Lugar } from '../../types';
import { ESTADOS_REPORTABLES, SEMAFORO } from './estado';
import { reportarConAviso } from './reportar';

// Reporte colaborativo en 1 toque: Libre · Medio · Lleno.
// Heurística 8 (minimalista): tres botones grandes, sin formularios.

export function ReportButtons({ lugar }: { lugar: Lugar }) {
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label={`¿Cómo está ${lugar.nombre} ahora?`}>
      {ESTADOS_REPORTABLES.map((estado) => {
        const s = SEMAFORO[estado];
        return (
          <button
            key={estado}
            type="button"
            onClick={() => reportarConAviso(lugar, estado)}
            aria-label={`Reportar ${lugar.nombre} como ${s.etiqueta}`}
            className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border-2 bg-white text-sm font-semibold transition hover:bg-slate-50 active:scale-95 ${s.texto} ${s.borde}`}
          >
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
            {s.corta}
          </button>
        );
      })}
    </div>
  );
}
