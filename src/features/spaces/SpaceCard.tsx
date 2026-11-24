import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { haceCuanto, plural } from '../../lib/formato';
import type { EspacioConEstado } from '../../services/spacesService';
import { CATEGORIAS } from '../map/categorias';
import { estadoVisible } from './estado';
import { ReportButtons } from './ReportButtons';

/** Línea que explica qué tan fresco es el dato (Heurística 1: visibilidad del estado). */
export function FrescuraDato({ espacio, ahora }: { espacio: EspacioConEstado; ahora: number }) {
  const { confianza } = estadoVisible(espacio.ultimoReporte, ahora);
  if (!espacio.ultimoReporte) return <p className="text-sm text-slate-600">Nadie lo ha reportado todavía. ¡Sé el primero!</p>;
  const cuando = `Actualizado ${haceCuanto(espacio.ultimoReporte.fecha, ahora)}`;
  if (confianza === 'ninguna') {
    return <p className="text-sm text-slate-600">{cuando}. Puede haber cambiado: si estás ahí, cuéntanos cómo está.</p>;
  }
  return (
    <p className="text-sm text-slate-600">
      {cuando}
      {espacio.reportesUltimaHora > 1 && ` · ${plural(espacio.reportesUltimaHora, 'reporte')} en la última hora`}
      {confianza === 'media' && ' · podría haber cambiado'}
    </p>
  );
}

export function SpaceCard({ espacio, ahora }: { espacio: EspacioConEstado; ahora: number }) {
  const { lugar } = espacio;
  const { estado } = estadoVisible(espacio.ultimoReporte, ahora);
  const Icono = CATEGORIAS[lugar.categoria].icono;

  return (
    <Card className="space-y-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icono className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-snug text-slate-900">{lugar.nombre}</h3>
          <p className="text-sm text-slate-600">
            {[lugar.edificio, lugar.piso && `Piso ${lugar.piso}`].filter(Boolean).join(' · ') || CATEGORIAS[lugar.categoria].etiqueta}
          </p>
        </div>
        <StatusBadge estado={estado} />
      </div>

      <FrescuraDato espacio={espacio} ahora={ahora} />

      <div>
        <p className="mb-1.5 text-sm font-semibold text-slate-800">¿Cómo está ahora?</p>
        <ReportButtons lugar={lugar} />
      </div>

      <Link
        to={`/mapa?lugar=${lugar.id}`}
        className="inline-flex min-h-[44px] items-center gap-1 rounded-lg text-sm font-semibold text-primary-700 hover:underline"
      >
        <MapPin className="h-4 w-4" aria-hidden />
        Ver en el mapa
      </Link>
    </Card>
  );
}
