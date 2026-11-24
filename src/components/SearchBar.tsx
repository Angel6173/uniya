import { Search, X } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes } from 'react';

// Caja de búsqueda con botón para borrar el texto.

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  valor: string;
  onCambiar: (texto: string) => void;
  etiqueta: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { valor, onCambiar, etiqueta, className = '', ...resto },
  ref,
) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden />
      <input
        ref={ref}
        type="search"
        aria-label={etiqueta}
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white pl-10 pr-11 text-base text-slate-900 shadow-suave placeholder:text-slate-500"
        {...resto}
      />
      {valor && (
        <button
          type="button"
          onClick={() => onCambiar('')}
          aria-label="Borrar búsqueda"
          className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      )}
    </div>
  );
});
