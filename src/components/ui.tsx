import { Loader2 } from 'lucide-react';
import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { iniciales } from '../lib/formato';

// Piezas básicas de interfaz. Heurística 4 (consistencia): todas las pantallas usan estas mismas piezas.
// Accesibilidad: alto mínimo de 44 px y foco visible (definido en index.css).

type Variante = 'primario' | 'secundario' | 'fantasma' | 'peligro';

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300',
  secundario: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:text-slate-400',
  fantasma: 'text-primary-700 hover:bg-primary-50 disabled:text-slate-400',
  peligro: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  cargando?: boolean;
  icono?: ReactNode;
}

export function Button({ variante = 'primario', cargando, icono, className = '', children, disabled, ...resto }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTES[variante]} ${className}`}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      {...resto}
    >
      {cargando ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : icono}
      {children}
    </button>
  );
}

export function Avatar({ nombre, tamano = 'md' }: { nombre: string; tamano?: 'sm' | 'md' | 'lg' }) {
  const medidas = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-xl' }[tamano];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-800 ${medidas}`}
      aria-hidden
    >
      {iniciales(nombre)}
    </span>
  );
}

/** Bloque gris animado mientras cargan los datos (Heurística 1). */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} aria-hidden />;
}

export function CargandoLista({ filas = 3 }: { filas?: number }) {
  return (
    <div className="space-y-3" aria-label="Cargando…" role="status">
      {Array.from({ length: filas }, (_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}

// ── Campos de formulario ───────────────────────────────────────
// Texto de 16 px en los inputs (evita el zoom automático en iPhone).
// Heurística 9: el error aparece debajo del campo, en rojo y con texto claro.

const claseCampo = (error?: string) =>
  `w-full rounded-xl border bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-500 ${
    error ? 'border-red-500' : 'border-slate-300'
  }`;

interface CampoBase {
  etiqueta: string;
  error?: string;
  ayuda?: string;
}

function Envoltura({ id, etiqueta, error, ayuda, children }: CampoBase & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-800">
        {etiqueta}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : (
        ayuda && (
          <p id={`${id}-msg`} className="mt-1 text-sm text-slate-600">
            {ayuda}
          </p>
        )
      )}
    </div>
  );
}

export function TextField({ etiqueta, error, ayuda, ...resto }: CampoBase & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Envoltura id={id} etiqueta={etiqueta} error={error} ayuda={ayuda}>
      <input id={id} className={claseCampo(error)} aria-invalid={!!error} aria-describedby={`${id}-msg`} {...resto} />
    </Envoltura>
  );
}

export function TextArea({ etiqueta, error, ayuda, ...resto }: CampoBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Envoltura id={id} etiqueta={etiqueta} error={error} ayuda={ayuda}>
      <textarea id={id} rows={4} className={claseCampo(error)} aria-invalid={!!error} aria-describedby={`${id}-msg`} {...resto} />
    </Envoltura>
  );
}

export function SelectField({ etiqueta, error, ayuda, children, ...resto }: CampoBase & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Envoltura id={id} etiqueta={etiqueta} error={error} ayuda={ayuda}>
      <select id={id} className={claseCampo(error)} aria-invalid={!!error} aria-describedby={`${id}-msg`} {...resto}>
        {children}
      </select>
    </Envoltura>
  );
}

/** Título de sección con un enlace opcional a la derecha ("Ver todo"). */
export function SectionTitle({ titulo, accion }: { titulo: string; accion?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <h2 className="text-base font-bold text-slate-900">{titulo}</h2>
      {accion}
    </div>
  );
}
