import { ArrowLeft, CheckCircle2, MessageCircleQuestion, Send, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pantalla } from '../app/AppLayout';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/Modal';
import { toast } from '../components/Toast';
import { Avatar, Button, Skeleton, TextArea } from '../components/ui';
import { useAhora, useLive } from '../hooks/useLive';
import { nombreAutor, useUsuarioActual, useUsuarios } from '../hooks/useUsuarioActual';
import { haceCuanto, plural } from '../lib/formato';
import { PUNTOS } from '../services/base';
import { communityService } from '../services/communityService';
import type { Pregunta, Respuesta } from '../types';

export function PreguntaDetallePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const pregunta = useLive<Pregunta | null>((cb) => communityService.subscribePregunta(id, cb), [id]);
  const usuarios = useUsuarios();
  const yo = useUsuarioActual();
  const ahora = useAhora();
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  const volver = (
    <Link
      to="/comunidad"
      className="-ml-2 inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 font-semibold text-primary-700 hover:bg-primary-50"
    >
      <ArrowLeft className="h-5 w-5" aria-hidden /> Preguntas
    </Link>
  );

  if (pregunta === undefined || !yo) return <Skeleton className="m-4 h-64" />;
  if (pregunta === null) {
    return (
      <Pantalla>
        {volver}
        <EmptyState icono={MessageCircleQuestion} titulo="Esta pregunta ya no existe" texto="Puede que su autor la haya eliminado." />
      </Pantalla>
    );
  }

  const p = pregunta; // referencia estable para las funciones de abajo
  const soyAutor = p.autorId === yo.id;
  // La respuesta útil se muestra primero.
  const respuestas = [...p.respuestas].sort((a, b) => Number(b.util) - Number(a.util) || a.fecha - b.fecha);

  async function responder(e: FormEvent) {
    e.preventDefault();
    if (texto.trim().length < 5) {
      setError('Tu respuesta está vacía o es muy corta. Explica un poco más para que sirva.');
      return;
    }
    setError('');
    setEnviando(true);
    const respuesta = await communityService.responder(p.id, texto.trim());
    setEnviando(false);
    setTexto('');
    toast({
      mensaje: `Respuesta publicada. +${PUNTOS.respuesta} pts`,
      onDeshacer: () => {
        void communityService.eliminarRespuesta(p.id, respuesta.id);
        setTexto(respuesta.texto); // devuelve el texto al campo para editarlo
      },
    });
  }

  async function marcar(r: Respuesta) {
    try {
      const anterior = await communityService.marcarUtil(p.id, r.util ? null : r.id);
      toast({
        mensaje: r.util ? 'Quitaste la marca de respuesta útil' : '¡Marcada como útil! Quien respondió gana puntos.',
        onDeshacer: () => void communityService.marcarUtil(p.id, anterior),
      });
    } catch (e) {
      toast({ tipo: 'error', mensaje: (e as Error).message });
    }
  }

  async function eliminar() {
    setConfirmarBorrado(false);
    await communityService.eliminarPregunta(p.id);
    toast({ tipo: 'info', mensaje: 'Pregunta eliminada' });
    navigate('/comunidad', { replace: true });
  }

  return (
    <Pantalla>
      {volver}

      <article>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {p.curso && <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-800">{p.curso}</span>}
          {p.facultad && <span className="text-xs font-medium text-slate-600">{p.facultad}</span>}
        </div>
        <h1 className="text-xl font-extrabold leading-snug text-slate-900">{p.titulo}</h1>
        {p.detalle && <p className="mt-2 leading-relaxed text-slate-700">{p.detalle}</p>}
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <Avatar nombre={usuarios[p.autorId]?.nombre ?? 'E'} tamano="sm" />
          {nombreAutor(usuarios, p.autorId, yo.id)} · {haceCuanto(p.fecha, ahora)}
          {soyAutor && (
            <button
              type="button"
              onClick={() => setConfirmarBorrado(true)}
              className="ml-auto flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden /> Eliminar
            </button>
          )}
        </div>
      </article>

      <section className="space-y-3" aria-label="Respuestas">
        <h2 className="font-bold text-slate-900">{plural(p.respuestas.length, 'respuesta')}</h2>
        {soyAutor && p.respuestas.length > 0 && (
          <p className="text-sm text-slate-600">Toca "Me sirvió" en la respuesta que te ayudó. Así otros la encuentran rápido.</p>
        )}
        {respuestas.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
            Nadie ha respondido todavía. Si sabes algo, ¡ayuda! Ganas {PUNTOS.respuesta} puntos.
          </p>
        )}
        {respuestas.map((r) => (
          <Card key={r.id} className={r.util ? 'border-green-300 bg-green-50' : ''}>
            {r.util && (
              <p className="mb-2 flex items-center gap-1 text-sm font-bold text-green-800">
                <CheckCircle2 className="h-4 w-4" aria-hidden /> Respuesta útil
              </p>
            )}
            <p className="leading-relaxed text-slate-800">{r.texto}</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <span>
                {nombreAutor(usuarios, r.autorId, yo.id)} · {haceCuanto(r.fecha, ahora)}
              </span>
              {soyAutor && r.autorId !== yo.id && (
                <button
                  type="button"
                  aria-pressed={r.util}
                  onClick={() => marcar(r)}
                  className={`ml-auto flex min-h-[44px] items-center gap-1 rounded-lg px-3 font-semibold ${
                    r.util ? 'text-green-800 hover:bg-green-100' : 'text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden /> {r.util ? 'Te sirvió' : 'Me sirvió'}
                </button>
              )}
            </div>
          </Card>
        ))}
      </section>

      <form onSubmit={responder} noValidate className="space-y-3 rounded-2xl bg-white p-4 shadow-suave">
        <TextArea
          etiqueta="Tu respuesta"
          placeholder="Explica con tus palabras. Si es un lugar, dile cómo llegar."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          error={error}
          rows={3}
          maxLength={600}
        />
        <Button type="submit" className="w-full" cargando={enviando} icono={<Send className="h-4 w-4" aria-hidden />}>
          Responder
        </Button>
      </form>

      <ConfirmDialog
        abierto={confirmarBorrado}
        titulo="¿Eliminar tu pregunta?"
        mensaje={`También se borrarán ${plural(p.respuestas.length, 'respuesta')}. Esta acción no se puede deshacer.`}
        textoConfirmar="Sí, eliminar"
        peligroso
        onConfirmar={eliminar}
        onCancelar={() => setConfirmarBorrado(false)}
      />
    </Pantalla>
  );
}
