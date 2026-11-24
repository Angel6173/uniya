import { Clock, MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { ConfirmDialog } from '../../components/Modal';
import { toast } from '../../components/Toast';
import { Avatar, Button } from '../../components/ui';
import { PUNTOS } from '../../services/base';
import { communityService } from '../../services/communityService';
import { placesService } from '../../services/placesService';
import type { GrupoEstudio, Usuario } from '../../types';

interface GroupCardProps {
  grupo: GrupoEstudio;
  yoId: string;
  usuarios: Record<string, Usuario>;
}

export function GroupCard({ grupo, yoId, usuarios }: GroupCardProps) {
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const lugar = placesService.getById(grupo.lugarId);
  const soyMiembro = grupo.miembros.includes(yoId);
  const soyCreador = grupo.miembros[0] === yoId;
  const lleno = grupo.miembros.length >= grupo.cupos;
  const libres = grupo.cupos - grupo.miembros.length;

  async function unirme() {
    try {
      await communityService.unirse(grupo.id);
      toast({
        mensaje: `Te uniste al grupo de ${grupo.curso}. +${PUNTOS.grupo_unido} pt`,
        onDeshacer: () => void communityService.salir(grupo.id),
      });
    } catch (e) {
      toast({ tipo: 'error', mensaje: (e as Error).message });
    }
  }

  async function salir() {
    await communityService.salir(grupo.id);
    toast({ tipo: 'info', mensaje: `Saliste del grupo de ${grupo.curso}`, onDeshacer: () => void unirme() });
  }

  async function eliminar() {
    setConfirmarBorrado(false);
    try {
      await communityService.eliminarGrupo(grupo.id);
      toast({ tipo: 'info', mensaje: 'Grupo eliminado' });
    } catch (e) {
      toast({ tipo: 'error', mensaje: (e as Error).message });
    }
  }

  return (
    <Card className="space-y-3">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-800">{grupo.curso}</span>
          {soyCreador && <span className="text-xs font-medium text-slate-600">Creado por ti</span>}
        </div>
        <h3 className="font-bold leading-snug text-slate-900">{grupo.tema}</h3>
      </div>

      <div className="space-y-1 text-sm text-slate-700">
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-slate-500" aria-hidden /> {grupo.horario}
        </p>
        {lugar && (
          <Link to={`/mapa?lugar=${lugar.id}`} className="flex min-h-[32px] items-center gap-2 text-primary-700 hover:underline">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden /> {lugar.nombre}
          </Link>
        )}
      </div>

      {/* Cupos: barra + texto (Heurística 1) */}
      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <div className="flex -space-x-2">
            {grupo.miembros.slice(0, 5).map((id) => (
              <span key={id} className="rounded-full ring-2 ring-white">
                <Avatar nombre={usuarios[id]?.nombre ?? '?'} tamano="sm" />
              </span>
            ))}
          </div>
          <span className={`font-semibold ${lleno ? 'text-red-700' : 'text-slate-700'}`}>
            {lleno ? 'Sin cupos' : `${libres} ${libres === 1 ? 'cupo libre' : 'cupos libres'}`} · {grupo.miembros.length}/{grupo.cupos}
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label="Cupos ocupados"
          aria-valuemin={0}
          aria-valuemax={grupo.cupos}
          aria-valuenow={grupo.miembros.length}
        >
          <div className={`h-full rounded-full ${lleno ? 'bg-red-500' : 'bg-primary-500'}`} style={{ width: `${(grupo.miembros.length / grupo.cupos) * 100}%` }} />
        </div>
      </div>

      <div className="flex gap-2">
        {soyCreador ? (
          <Button variante="secundario" className="flex-1" icono={<Trash2 className="h-4 w-4" aria-hidden />} onClick={() => setConfirmarBorrado(true)}>
            Eliminar grupo
          </Button>
        ) : soyMiembro ? (
          <Button variante="secundario" className="flex-1" onClick={salir}>
            Salir del grupo
          </Button>
        ) : (
          // Heurística 5: si está lleno, el botón se desactiva y explica por qué.
          <Button className="flex-1" disabled={lleno} onClick={unirme}>
            {lleno ? 'Grupo lleno' : 'Unirme'}
          </Button>
        )}
      </div>

      <ConfirmDialog
        abierto={confirmarBorrado}
        titulo="¿Eliminar este grupo?"
        mensaje={`Se borrará el grupo de ${grupo.curso} y sus ${grupo.miembros.length} miembros dejarán de verlo. Esta acción no se puede deshacer.`}
        textoConfirmar="Sí, eliminar"
        peligroso
        onConfirmar={eliminar}
        onCancelar={() => setConfirmarBorrado(false)}
      />
    </Card>
  );
}
