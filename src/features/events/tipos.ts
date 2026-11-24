import { Mic, Presentation, Sparkles, Wrench, type LucideIcon } from 'lucide-react';
import { toast } from '../../components/Toast';
import { eventsService } from '../../services/eventsService';
import type { Evento, TipoEvento } from '../../types';

export const TIPOS_EVENTO: Record<TipoEvento, { etiqueta: string; plural: string; icono: LucideIcon; clase: string }> = {
  evento: { etiqueta: 'Evento', plural: 'Eventos', icono: Sparkles, clase: 'bg-sky-100 text-sky-900' },
  taller: { etiqueta: 'Taller', plural: 'Talleres', icono: Wrench, clase: 'bg-violet-100 text-violet-900' },
  conferencia: { etiqueta: 'Conferencia', plural: 'Conferencias', icono: Mic, clase: 'bg-rose-100 text-rose-900' },
  actividad: { etiqueta: 'Actividad', plural: 'Actividades', icono: Presentation, clase: 'bg-emerald-100 text-emerald-900' },
};

/** "Me interesa" con aviso y Deshacer (Heurísticas 1 y 3). */
export async function alternarInteres(evento: Evento) {
  try {
    const interesa = await eventsService.toggleInteres(evento.id);
    toast({
      tipo: interesa ? 'exito' : 'info',
      mensaje: interesa ? `Guardado en "Me interesa": ${evento.titulo}` : 'Lo quitaste de "Me interesa"',
      onDeshacer: () => void eventsService.toggleInteres(evento.id),
    });
  } catch (e) {
    toast({ tipo: 'error', mensaje: (e as Error).message });
  }
}
