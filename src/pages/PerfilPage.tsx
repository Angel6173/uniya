import { CircleHelp, LogOut, Pencil, RotateCcw, Star, Trophy } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pantalla } from '../app/AppLayout';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog, Modal } from '../components/Modal';
import { toast } from '../components/Toast';
import { Avatar, Button, SectionTitle, SelectField, TextField } from '../components/ui';
import { CARRERAS } from '../data/campus';
import { calcularNivel } from '../features/profile/niveles';
import { useAhora, useLive } from '../hooks/useLive';
import { useUsuarioActual } from '../hooks/useUsuarioActual';
import { haceCuanto } from '../lib/formato';
import { authService, usersService } from '../services/authService';
import { demoService } from '../services/demoService';

export function PerfilPage() {
  const navigate = useNavigate();
  const yo = useUsuarioActual();
  const aportes = useLive(usersService.subscribeMisAportes) ?? [];
  const ahora = useAhora();
  const [editando, setEditando] = useState(false);
  const [confirmar, setConfirmar] = useState<'salir' | 'restablecer' | null>(null);

  if (!yo) return null;
  const nivel = calcularNivel(yo.puntos);

  return (
    <Pantalla titulo="Mi perfil">
      <Card className="flex items-center gap-4">
        <Avatar nombre={yo.nombre} tamano="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-slate-900">{yo.nombre}</h2>
          <p className="text-sm text-slate-700">{yo.carrera}</p>
          <p className="truncate text-sm text-slate-500">{yo.correo}</p>
        </div>
        <button
          type="button"
          onClick={() => setEditando(true)}
          aria-label="Editar mi perfil"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
        >
          <Pencil className="h-5 w-5" aria-hidden />
        </button>
      </Card>

      {/* Puntos y nivel (Heurística 1: el usuario ve el efecto de aportar) */}
      <Card className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
            <Trophy className="h-6 w-6 text-amber-700" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="text-sm text-slate-600">Nivel</p>
            <p className="text-lg font-extrabold text-slate-900">{nivel.actual.nombre}</p>
          </div>
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 text-2xl font-extrabold text-amber-700">
              <Star className="h-5 w-5 fill-amber-400 text-amber-500" aria-hidden />
              {yo.puntos}
            </p>
            <p className="text-sm text-slate-600">puntos</p>
          </div>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label={nivel.siguiente ? `Progreso hacia ${nivel.siguiente.nombre}` : 'Nivel máximo'}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(nivel.progreso * 100)}
        >
          <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${nivel.progreso * 100}%` }} />
        </div>
        <p className="text-sm text-slate-600">
          {nivel.siguiente
            ? `Te faltan ${nivel.faltan} puntos para ser ${nivel.siguiente.nombre}.`
            : '¡Llegaste al nivel más alto! Gracias por ayudar tanto.'}
        </p>
      </Card>

      <section>
        <SectionTitle titulo="Mis aportes" />
        {aportes.length === 0 ? (
          <EmptyState
            icono={Star}
            titulo="Aún no tienes aportes"
            texto="Reporta un espacio, responde una pregunta o únete a un grupo. Cada aporte suma puntos."
            accion={
              <Link to="/espacios" className="font-semibold text-primary-700 underline">
                Reportar un espacio
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-suave">
            {aportes.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-900">{a.descripcion}</p>
                  <p className="text-xs text-slate-500">{haceCuanto(a.fecha, ahora)}</p>
                </div>
                <span className="shrink-0 font-bold text-amber-700">+{a.puntos}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <Link to="/ayuda" className="flex min-h-[48px] items-center gap-3 rounded-xl bg-white px-4 font-semibold text-slate-800 shadow-suave hover:bg-slate-50">
          <CircleHelp className="h-5 w-5 text-primary-600" aria-hidden /> ¿Cómo funciona UniYa?
        </Link>
        <Button variante="secundario" className="w-full justify-start" icono={<RotateCcw className="h-5 w-5" aria-hidden />} onClick={() => setConfirmar('restablecer')}>
          Restablecer datos de ejemplo
        </Button>
        <Button variante="secundario" className="w-full justify-start text-red-700" icono={<LogOut className="h-5 w-5" aria-hidden />} onClick={() => setConfirmar('salir')}>
          Cerrar sesión
        </Button>
      </section>

      <p className="text-center text-xs text-slate-500">Datos de ejemplo · Prototipo UniYa, Fase 1</p>

      <EditarPerfil abierto={editando} onCerrar={() => setEditando(false)} nombreInicial={yo.nombre} carreraInicial={yo.carrera} />

      <ConfirmDialog
        abierto={confirmar === 'salir'}
        titulo="¿Cerrar sesión?"
        mensaje="Tus puntos y aportes se guardan. Puedes volver a entrar con tu correo."
        textoConfirmar="Cerrar sesión"
        onConfirmar={() => {
          authService.logout();
          navigate('/login', { replace: true });
        }}
        onCancelar={() => setConfirmar(null)}
      />
      <ConfirmDialog
        abierto={confirmar === 'restablecer'}
        titulo="¿Restablecer los datos de ejemplo?"
        mensaje="Se borrarán los reportes, preguntas, grupos y puntos que se agregaron, y todo volverá a como estaba al inicio. Úsalo antes de una demo o prueba con usuarios."
        textoConfirmar="Restablecer"
        peligroso
        onConfirmar={async () => {
          await demoService.restablecer();
          setConfirmar(null);
          toast({ tipo: 'info', mensaje: 'Datos de ejemplo restablecidos' });
        }}
        onCancelar={() => setConfirmar(null)}
      />
    </Pantalla>
  );
}

function EditarPerfil({ abierto, onCerrar, nombreInicial, carreraInicial }: { abierto: boolean; onCerrar: () => void; nombreInicial: string; carreraInicial: string }) {
  const [nombre, setNombre] = useState(nombreInicial);
  const [carrera, setCarrera] = useState(carreraInicial);
  const [error, setError] = useState('');

  async function guardar(e: FormEvent) {
    e.preventDefault();
    if (nombre.trim().split(/\s+/).length < 2) {
      setError('Escribe tu nombre y apellido (ej.: Ana Quispe).');
      return;
    }
    await usersService.actualizarPerfil({ nombre: nombre.trim(), carrera });
    toast({ mensaje: 'Perfil actualizado' });
    onCerrar();
  }

  return (
    <Modal abierto={abierto} titulo="Editar perfil" onCerrar={onCerrar}>
      <form onSubmit={guardar} noValidate className="space-y-4">
        <TextField etiqueta="Nombre y apellido" value={nombre} onChange={(e) => setNombre(e.target.value)} error={error} maxLength={60} />
        <SelectField etiqueta="Carrera" value={carrera} onChange={(e) => setCarrera(e.target.value)}>
          {CARRERAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
        <Button type="submit" className="w-full">
          Guardar cambios
        </Button>
      </form>
    </Modal>
  );
}
