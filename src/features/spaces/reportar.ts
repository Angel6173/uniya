import { toast } from '../../components/Toast';
import { PUNTOS } from '../../services/base';
import { spacesService } from '../../services/spacesService';
import type { EstadoEspacio, Lugar } from '../../types';
import { SEMAFORO } from './estado';

/**
 * Reporta un espacio y muestra el aviso con "Deshacer".
 * Se usa igual desde Espacios, Mapa e Inicio (Heurística 4: consistencia).
 */
export async function reportarConAviso(lugar: Lugar, estado: EstadoEspacio) {
  try {
    const reporte = await spacesService.report(lugar.id, estado);
    // Heurística 1: confirmar lo que pasó. Heurística 3: permitir deshacer.
    toast({
      mensaje: `${lugar.nombre}: ${SEMAFORO[estado].etiqueta}. ¡Gracias! +${PUNTOS.reporte} pts`,
      onDeshacer: async () => {
        await spacesService.undoReport(reporte.id);
        toast({ tipo: 'info', mensaje: 'Reporte deshecho. Se quitaron los puntos.' });
      },
    });
  } catch (e) {
    toast({ tipo: 'error', mensaje: (e as Error).message });
  }
}
