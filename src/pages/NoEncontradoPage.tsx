import { MapPinOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pantalla } from '../app/AppLayout';
import { EmptyState } from '../components/EmptyState';

export function NoEncontradoPage() {
  return (
    <Pantalla>
      <EmptyState
        icono={MapPinOff}
        titulo="Esta página no existe"
        texto="Puede que el enlace esté mal escrito. Vuelve al inicio para seguir."
        accion={
          <Link to="/" className="inline-flex min-h-[44px] items-center rounded-xl bg-primary-600 px-4 font-semibold text-white">
            Ir al inicio
          </Link>
        }
      />
    </Pantalla>
  );
}
