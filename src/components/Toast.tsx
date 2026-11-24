import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { create } from 'zustand';

// Sistema de avisos (toasts).
// Heurística 1 (visibilidad del estado): confirma cada acción.
// Heurística 3 (control y libertad): botón "Deshacer" después de reportar, votar o unirse.

type TipoToast = 'exito' | 'error' | 'info';

interface ToastDatos {
  id: number;
  mensaje: string;
  tipo: TipoToast;
  onDeshacer?: () => void;
}

interface ToastStore {
  actual: ToastDatos | null;
  mostrar: (t: Omit<ToastDatos, 'id'>) => void;
  cerrar: () => void;
}

const useToastStore = create<ToastStore>((set) => ({
  actual: null,
  mostrar: (t) => set({ actual: { ...t, id: Date.now() } }),
  cerrar: () => set({ actual: null }),
}));

/** Muestra un aviso. Ej: toast({ mensaje: 'Reporte enviado', onDeshacer: () => ... }) */
export function toast(opciones: { mensaje: string; tipo?: TipoToast; onDeshacer?: () => void }) {
  useToastStore.getState().mostrar({ tipo: 'exito', ...opciones });
}

const ICONOS = { exito: CheckCircle2, error: XCircle, info: Info };
const COLOR_ICONO = { exito: 'text-green-400', error: 'text-red-400', info: 'text-sky-300' };

/** Se coloca una sola vez en el layout. */
export function ToastHost() {
  const { actual, cerrar } = useToastStore();

  useEffect(() => {
    if (!actual) return;
    // Con "Deshacer" se deja más tiempo para reaccionar.
    const id = setTimeout(cerrar, actual.onDeshacer ? 6000 : 3500);
    return () => clearTimeout(id);
  }, [actual, cerrar]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[3000] mx-auto flex max-w-[480px] justify-center px-4"
      role="status"
      aria-live="polite"
    >
      {actual && (
        <div
          key={actual.id}
          className="animate-entrar pointer-events-auto flex w-full items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-lg"
        >
          {(() => {
            const Icono = ICONOS[actual.tipo];
            return <Icono className={`h-5 w-5 shrink-0 ${COLOR_ICONO[actual.tipo]}`} aria-hidden />;
          })()}
          <p className="flex-1 text-sm leading-snug">{actual.mensaje}</p>
          {actual.onDeshacer && (
            <button
              type="button"
              className="min-h-[44px] shrink-0 rounded-lg px-3 text-sm font-semibold text-indigo-300 hover:bg-white/10"
              onClick={() => {
                actual.onDeshacer?.();
                cerrar();
              }}
            >
              Deshacer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
