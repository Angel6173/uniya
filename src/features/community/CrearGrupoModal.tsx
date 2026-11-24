import { useState, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import { toast } from '../../components/Toast';
import { Button, SelectField, TextField } from '../../components/ui';
import { PUNTOS } from '../../services/base';
import { communityService } from '../../services/communityService';
import { placesService } from '../../services/placesService';
import { CATEGORIAS } from '../map/categorias';

// Formulario para crear un grupo de estudio.
// Heurística 5 (prevención de errores): se valida antes de enviar y los errores salen junto al campo.

const LUGARES_PARA_ESTUDIAR = placesService
  .getAll()
  .filter((l) => ['biblioteca', 'espacio_estudio', 'aula', 'laboratorio'].includes(l.categoria));

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface Errores {
  curso?: string;
  tema?: string;
  lugarId?: string;
  dias?: string;
  hora?: string;
}

/** "16:00" → "4:00 p. m." */
function hora12(valor: string) {
  const [h, m] = valor.split(':').map(Number) as [number, number];
  const sufijo = h < 12 ? 'a. m.' : 'p. m.';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

export function CrearGrupoModal({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const [curso, setCurso] = useState('');
  const [tema, setTema] = useState('');
  const [lugarId, setLugarId] = useState('');
  const [dias, setDias] = useState<string[]>([]);
  const [inicio, setInicio] = useState('16:00');
  const [fin, setFin] = useState('18:00');
  const [cupos, setCupos] = useState(5);
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);

  function validar(): Errores {
    const e: Errores = {};
    if (curso.trim().length < 3) e.curso = 'Escribe el nombre del curso (ej.: Cálculo I).';
    if (tema.trim().length < 5) e.tema = 'Cuenta en pocas palabras qué van a estudiar.';
    if (!lugarId) e.lugarId = 'Elige dónde se van a reunir.';
    if (dias.length === 0) e.dias = 'Marca al menos un día.';
    if (fin <= inicio) e.hora = 'La hora de fin debe ser después de la hora de inicio.';
    return e;
  }

  function limpiar() {
    setCurso('');
    setTema('');
    setLugarId('');
    setDias([]);
    setErrores({});
  }

  async function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    setEnviando(true);
    const ordenados = DIAS.filter((d) => dias.includes(d));
    const horario = `${ordenados.join(', ').replace(/, ([^,]*)$/, ' y $1')} · ${hora12(inicio)}–${hora12(fin)}`;
    const grupo = await communityService.crearGrupo({ curso: curso.trim(), tema: tema.trim(), lugarId, horario, cupos });
    setEnviando(false);
    limpiar();
    onCerrar();
    toast({
      mensaje: `Grupo de ${grupo.curso} creado. +${PUNTOS.grupo_creado} pts`,
      onDeshacer: () => void communityService.eliminarGrupo(grupo.id),
    });
  }

  return (
    <Modal abierto={abierto} titulo="Crear grupo de estudio" onCerrar={onCerrar}>
      <form onSubmit={enviar} noValidate className="space-y-4">
        <TextField
          etiqueta="Curso"
          placeholder="Ej.: Cálculo I"
          list="cursos-sugeridos"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          error={errores.curso}
          maxLength={50}
        />
        {/* Heurística 6: sugiere cursos que ya usan otros estudiantes. */}
        <datalist id="cursos-sugeridos">
          {communityService.getCursos().map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <TextField
          etiqueta="¿Qué van a estudiar?"
          placeholder="Ej.: Repaso para el parcial"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          error={errores.tema}
          maxLength={80}
        />
        <SelectField etiqueta="Lugar" value={lugarId} onChange={(e) => setLugarId(e.target.value)} error={errores.lugarId}>
          <option value="">Elige un lugar…</option>
          {LUGARES_PARA_ESTUDIAR.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nombre} ({CATEGORIAS[l.categoria].etiqueta})
            </option>
          ))}
        </SelectField>

        <fieldset>
          <legend className="mb-1 text-sm font-semibold text-slate-800">Días</legend>
          <div className="flex flex-wrap gap-2">
            {DIAS.map((d) => {
              const activo = dias.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => setDias(activo ? dias.filter((x) => x !== d) : [...dias, d])}
                  className={`h-11 w-12 rounded-xl border text-sm font-semibold ${
                    activo ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          {errores.dias && <p className="mt-1 text-sm text-red-700" role="alert">{errores.dias}</p>}
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <TextField etiqueta="Desde" type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          <TextField etiqueta="Hasta" type="time" value={fin} onChange={(e) => setFin(e.target.value)} error={errores.hora} />
        </div>

        <SelectField etiqueta="Cupos (contándote a ti)" value={cupos} onChange={(e) => setCupos(Number(e.target.value))}>
          {[2, 3, 4, 5, 6, 8, 10].map((n) => (
            <option key={n} value={n}>
              {n} personas
            </option>
          ))}
        </SelectField>

        <Button type="submit" className="w-full" cargando={enviando}>
          Crear grupo
        </Button>
      </form>
    </Modal>
  );
}
