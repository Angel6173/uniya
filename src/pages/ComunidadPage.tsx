import { MessageCircleQuestion, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Pantalla } from '../app/AppLayout';
import { Chip, ChipRow } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { SearchBar } from '../components/SearchBar';
import { Button, CargandoLista } from '../components/ui';
import { FACULTADES } from '../data/campus';
import { CrearGrupoModal } from '../features/community/CrearGrupoModal';
import { GroupCard } from '../features/community/GroupCard';
import { QuestionCard } from '../features/community/QuestionCard';
import { useAhora, useLive } from '../hooks/useLive';
import { nombreAutor, useUsuarioActual, useUsuarios } from '../hooks/useUsuarioActual';
import { normalizar } from '../services/placesService';
import { communityService } from '../services/communityService';

// Módulo 2 · Comunidad de ayuda: preguntas y respuestas + grupos de estudio.
// La pestaña activa se guarda en la URL (?tab=grupos) para que "atrás" funcione bien.

export function ComunidadPage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'grupos' ? 'grupos' : 'preguntas';

  return (
    <Pantalla titulo="Comunidad" subtitulo="Pregunta, responde y encuentra con quién estudiar.">
      <div role="tablist" aria-label="Secciones de la comunidad" className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200 p-1">
        {(
          [
            ['preguntas', 'Preguntas', MessageCircleQuestion],
            ['grupos', 'Grupos de estudio', Users],
          ] as const
        ).map(([id, texto, Icono]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setParams(id === 'grupos' ? { tab: 'grupos' } : {}, { replace: true })}
            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-lg text-sm font-semibold ${
              tab === id ? 'bg-white text-primary-700 shadow' : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <Icono className="h-4 w-4" aria-hidden />
            {texto}
          </button>
        ))}
      </div>
      <div role="tabpanel">{tab === 'preguntas' ? <Preguntas /> : <Grupos />}</div>
    </Pantalla>
  );
}

function Preguntas() {
  const preguntas = useLive(communityService.subscribePreguntas);
  const usuarios = useUsuarios();
  const yo = useUsuarioActual();
  const ahora = useAhora();
  const [texto, setTexto] = useState('');
  const [facultad, setFacultad] = useState('');
  const [sinResponder, setSinResponder] = useState(false);

  const q = normalizar(texto);
  const filtradas = (preguntas ?? []).filter(
    (p) =>
      (!facultad || p.facultad === facultad) &&
      (!sinResponder || p.respuestas.length === 0) &&
      (!q || normalizar(`${p.titulo} ${p.detalle} ${p.curso ?? ''}`).includes(q)),
  );

  return (
    <div className="space-y-3">
      {/* Heurística 8: la acción principal de la pantalla, bien visible. */}
      <Link
        to="/comunidad/preguntas/nueva"
        className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary-600 font-semibold text-white hover:bg-primary-700"
      >
        <Plus className="h-5 w-5" aria-hidden /> Hacer una pregunta
      </Link>
      <SearchBar etiqueta="Buscar preguntas por curso o tema" placeholder="Busca por curso o tema…" valor={texto} onCambiar={setTexto} />
      <ChipRow etiqueta="Filtrar por facultad">
        <Chip activo={!facultad && !sinResponder} onClick={() => { setFacultad(''); setSinResponder(false); }}>
          Todas
        </Chip>
        <Chip activo={sinResponder} onClick={() => setSinResponder(!sinResponder)}>
          Sin responder
        </Chip>
        {FACULTADES.map((f) => (
          <Chip key={f} activo={facultad === f} onClick={() => setFacultad(facultad === f ? '' : f)}>
            {f}
          </Chip>
        ))}
      </ChipRow>

      {preguntas === undefined ? (
        <CargandoLista />
      ) : filtradas.length === 0 ? (
        <EmptyState
          icono={MessageCircleQuestion}
          titulo="No hay preguntas con estos filtros"
          texto="Cambia el filtro o sé el primero en preguntar: alguien de tu facultad seguro sabe la respuesta."
        />
      ) : (
        filtradas.map((p) => <QuestionCard key={p.id} pregunta={p} autor={nombreAutor(usuarios, p.autorId, yo?.id)} ahora={ahora} />)
      )}
    </div>
  );
}

function Grupos() {
  const grupos = useLive(communityService.subscribeGrupos);
  const usuarios = useUsuarios();
  const yo = useUsuarioActual();
  const [filtro, setFiltro] = useState<'todos' | 'mios' | 'cupos'>('todos');
  const [creando, setCreando] = useState(false);

  if (!yo) return null;
  const filtrados = (grupos ?? []).filter((g) =>
    filtro === 'mios' ? g.miembros.includes(yo.id) : filtro === 'cupos' ? g.miembros.length < g.cupos : true,
  );

  return (
    <div className="space-y-3">
      <Button className="w-full" icono={<Plus className="h-5 w-5" aria-hidden />} onClick={() => setCreando(true)}>
        Crear grupo de estudio
      </Button>
      <ChipRow etiqueta="Filtrar grupos">
        <Chip activo={filtro === 'todos'} onClick={() => setFiltro('todos')}>
          Todos
        </Chip>
        <Chip activo={filtro === 'cupos'} onClick={() => setFiltro('cupos')}>
          Con cupos
        </Chip>
        <Chip activo={filtro === 'mios'} onClick={() => setFiltro('mios')}>
          Mis grupos
        </Chip>
      </ChipRow>

      {grupos === undefined ? (
        <CargandoLista />
      ) : filtrados.length === 0 ? (
        <EmptyState
          icono={Users}
          titulo={filtro === 'mios' ? 'Todavía no estás en ningún grupo' : 'No hay grupos aquí'}
          texto={filtro === 'mios' ? 'Únete a un grupo de la lista o crea uno para tu curso.' : 'Crea uno y otros estudiantes podrán unirse.'}
          accion={
            filtro === 'mios' && (
              <Button variante="secundario" onClick={() => setFiltro('todos')}>
                Ver todos los grupos
              </Button>
            )
          }
        />
      ) : (
        filtrados.map((g) => <GroupCard key={g.id} grupo={g} yoId={yo.id} usuarios={usuarios} />)
      )}

      <CrearGrupoModal abierto={creando} onCerrar={() => setCreando(false)} />
    </div>
  );
}
