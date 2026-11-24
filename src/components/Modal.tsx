import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from './ui';

// Ventana modal tipo "hoja" que sube desde abajo (cómoda en el celular).
// Se cierra con Escape, con la X o tocando fuera (Heurística 3: siempre hay salida).

interface ModalProps {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}

export function Modal({ abierto, titulo, onCerrar, children }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  // Se guarda en una ref para que el efecto no se repita en cada render (y no robe el foco al escribir).
  const cerrarRef = useRef(onCerrar);
  cerrarRef.current = onCerrar;

  useEffect(() => {
    if (!abierto) return;
    const anterior = document.activeElement as HTMLElement | null;
    // Lleva el foco al primer campo (accesibilidad con teclado / lector de pantalla).
    const primerCampo = panel.current?.querySelector<HTMLElement>('input, select, textarea, button:not([data-cerrar])');
    primerCampo?.focus();
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && cerrarRef.current();
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      anterior?.focus();
    };
  }, [abierto]);

  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-slate-900/50 sm:items-center" onClick={onCerrar}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="animate-subir max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 id="modal-titulo" className="text-lg font-bold text-slate-900">
            {titulo}
          </h2>
          <button
            type="button"
            data-cerrar
            onClick={onCerrar}
            aria-label="Cerrar"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface ConfirmarProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  peligroso?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** Heurística 5 (prevención de errores): confirmar antes de una acción destructiva. */
export function ConfirmDialog({ abierto, titulo, mensaje, textoConfirmar, peligroso, onConfirmar, onCancelar }: ConfirmarProps) {
  return (
    <Modal abierto={abierto} titulo={titulo} onCerrar={onCancelar}>
      <p className="text-slate-600">{mensaje}</p>
      <div className="mt-6 flex gap-3">
        <Button variante="secundario" className="flex-1" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variante={peligroso ? 'peligro' : 'primario'} className="flex-1" onClick={onConfirmar}>
          {textoConfirmar}
        </Button>
      </div>
    </Modal>
  );
}
