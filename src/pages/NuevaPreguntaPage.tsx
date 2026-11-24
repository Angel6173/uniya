import { ArrowLeft, Lightbulb } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pantalla } from '../app/AppLayout';
import { ConfirmDialog } from '../components/Modal';
import { toast } from '../components/Toast';
import { Button, SelectField, TextArea, TextField } from '../components/ui';
import { FACULTADES } from '../data/campus';
import { PUNTOS } from '../services/base';
import { communityService } from '../services/communityService';

// Formulario para publicar una pregunta.
// Heurística 5: validación antes de enviar. Heurística 9: errores que dicen cómo arreglarlo.

const MIN_TITULO = 10;
const MAX_TITULO = 120;

export function NuevaPreguntaPage() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [detalle, setDetalle] = useState('');
  const [curso, setCurso] = useState('');
  const [facultad, setFacultad] = useState('');
  const [errores, setErrores] = useState<{ titulo?: string; detalle?: string }>({});
  const [enviando, setEnviando] = useState(false);
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  const hayCambios = titulo.trim() !== '' || detalle.trim() !== '';

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const nuevos: typeof errores = {};
    if (titulo.trim().length < MIN_TITULO) {
      nuevos.titulo = `Tu pregunta es muy corta (${titulo.trim().length}/${MIN_TITULO} letras). Escríbela como la dirías: "¿Cómo…?", "¿Dónde…?"`;
    }
    if (detalle.trim().length > 0 && detalle.trim().length < 10) nuevos.detalle = 'Agrega un poco más de detalle o deja este campo vacío.';
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    const pregunta = await communityService.crearPregunta({
      titulo: titulo.trim(),
      detalle: detalle.trim(),
      curso: curso.trim() || undefined,
      facultad: facultad || undefined,
    });
    toast({ mensaje: `Pregunta publicada. +${PUNTOS.pregunta} pts` });
    navigate(`/comunidad/preguntas/${pregunta.id}`, { replace: true });
  }

  function volver() {
    // Heurística 5: no perder lo escrito por un toque accidental.
    if (hayCambios) setConfirmarSalida(true);
    else navigate(-1);
  }

  return (
    <Pantalla>
      <button
        type="button"
        onClick={volver}
        className="-ml-2 flex min-h-[44px] items-center gap-1 rounded-lg px-2 font-semibold text-primary-700 hover:bg-primary-50"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden /> Volver
      </button>
      <h1 className="text-2xl font-extrabold text-slate-900">Hacer una pregunta</h1>

      <div className="flex gap-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
        <Lightbulb className="h-5 w-5 shrink-0" aria-hidden />
        <p>Una buena pregunta dice el curso y qué intentaste. Así te responden más rápido.</p>
      </div>

      <form onSubmit={enviar} noValidate className="space-y-4">
        <TextField
          etiqueta="Tu pregunta"
          placeholder="¿Cómo resuelvo…? ¿Dónde queda…?"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          error={errores.titulo}
          ayuda={`${titulo.length}/${MAX_TITULO}`}
          maxLength={MAX_TITULO}
        />
        <TextArea
          etiqueta="Detalle (opcional)"
          placeholder="Cuenta un poco más: qué intentaste, en qué parte te trabaste…"
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          error={errores.detalle}
          maxLength={600}
        />
        <TextField
          etiqueta="Curso (opcional)"
          placeholder="Ej.: Cálculo I"
          list="cursos-pregunta"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          maxLength={50}
        />
        <datalist id="cursos-pregunta">
          {communityService.getCursos().map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <SelectField etiqueta="Facultad (opcional)" value={facultad} onChange={(e) => setFacultad(e.target.value)}>
          <option value="">Sin facultad / pregunta general</option>
          {FACULTADES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </SelectField>
        <Button type="submit" className="w-full" cargando={enviando}>
          Publicar pregunta
        </Button>
      </form>

      <ConfirmDialog
        abierto={confirmarSalida}
        titulo="¿Descartar tu pregunta?"
        mensaje="Lo que escribiste se perderá."
        textoConfirmar="Descartar"
        peligroso
        onConfirmar={() => navigate(-1)}
        onCancelar={() => setConfirmarSalida(false)}
      />
    </Pantalla>
  );
}
