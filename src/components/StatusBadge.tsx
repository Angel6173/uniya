import { SEMAFORO, type EstadoVisible } from '../features/spaces/estado';

// Insignia del semáforo. Además del color, siempre lleva TEXTO
// (accesibilidad: no depender solo del color, por ejemplo para personas daltónicas).

export function StatusBadge({ estado, grande = false }: { estado: EstadoVisible; grande?: boolean }) {
  const s = SEMAFORO[estado];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${s.fondo} ${s.texto} ${s.borde} ${
        grande ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
      {s.etiqueta}
    </span>
  );
}
