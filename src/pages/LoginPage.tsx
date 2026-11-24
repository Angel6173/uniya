import { ArrowLeft, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, SelectField, TextField } from '../components/ui';
import { CARRERAS, UNIVERSIDAD } from '../data/campus';
import { useUsuarioActual } from '../hooks/useUsuarioActual';
import { authService, validarCorreo } from '../services/authService';

// Inicio de sesión SIMULADO con correo institucional (Fase 1).
// Paso 1: correo. Paso 2 (solo la primera vez): nombre y carrera.

export function LoginPage() {
  const navigate = useNavigate();
  const ubicacion = useLocation();
  const yo = useUsuarioActual();
  const destino = (ubicacion.state as { desde?: string } | null)?.desde ?? '/';

  const [paso, setPaso] = useState<'correo' | 'perfil'>('correo');
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [error, setError] = useState('');
  const [errorPerfil, setErrorPerfil] = useState<{ nombre?: string; carrera?: string }>({});
  const [cargando, setCargando] = useState(false);

  if (yo) return <Navigate to={destino} replace />;

  async function entrar(e: FormEvent) {
    e.preventDefault();
    // Heurística 5 y 9: se valida antes de enviar y el error explica cómo arreglarlo.
    const problema = validarCorreo(correo);
    setError(problema ?? '');
    if (problema) return;
    setCargando(true);
    try {
      const resultado = await authService.login(correo);
      if (resultado.tipo === 'nuevo') setPaso('perfil');
      else navigate(destino, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }

  async function registrar(e: FormEvent) {
    e.preventDefault();
    const errores: typeof errorPerfil = {};
    if (nombre.trim().split(/\s+/).length < 2) errores.nombre = 'Escribe tu nombre y apellido (ej.: Ana Quispe).';
    if (!carrera) errores.carrera = 'Elige tu carrera de la lista.';
    setErrorPerfil(errores);
    if (Object.keys(errores).length > 0) return;
    setCargando(true);
    await authService.registrar({ correo: correo.trim().toLowerCase(), nombre: nombre.trim(), carrera });
    navigate(destino, { replace: true });
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <main className="w-full max-w-[420px] rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <img src="/favicon.svg" alt="" className="mx-auto mb-3 h-16 w-16" />
          <h1 className="text-3xl font-extrabold text-primary-700">UniYa</h1>
          <p className="text-slate-600">Todo tu campus en una app</p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {UNIVERSIDAD.sigla} · {UNIVERSIDAD.campus}
          </p>
        </div>

        {paso === 'correo' ? (
          <form onSubmit={entrar} noValidate className="space-y-4">
            <TextField
              etiqueta="Correo institucional"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              placeholder={`tuusuario@${UNIVERSIDAD.dominioCorreo}`}
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                if (error) setError('');
              }}
              error={error}
              ayuda={`Solo estudiantes con correo @${UNIVERSIDAD.dominioCorreo}`}
              autoFocus
            />
            <Button type="submit" className="w-full" cargando={cargando} icono={<Mail className="h-5 w-5" aria-hidden />}>
              {cargando ? 'Ingresando…' : 'Ingresar'}
            </Button>
            <p className="text-center text-sm text-slate-600">
              ¿Primera vez? Ingresa tu correo y te pediremos dos datos más.
            </p>
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              <strong>Prototipo:</strong> no se pide contraseña. Para la demo puedes usar <code className="font-semibold">lquispe@{UNIVERSIDAD.dominioCorreo}</code>{' '}
              <button
                type="button"
                className="font-semibold text-primary-700 underline"
                onClick={() => {
                  setCorreo(`lquispe@${UNIVERSIDAD.dominioCorreo}`);
                  setError('');
                }}
              >
                (usar este)
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={registrar} noValidate className="space-y-4">
            <button
              type="button"
              onClick={() => setPaso('correo')}
              className="-ml-2 flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Cambiar correo
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900">¡Bienvenido/a a UniYa!</h2>
              <p className="text-sm text-slate-600">
                Es tu primera vez con <strong>{correo.trim().toLowerCase()}</strong>. Cuéntanos quién eres.
              </p>
            </div>
            <TextField
              etiqueta="Nombre y apellido"
              autoComplete="name"
              placeholder="Ej.: Ana Quispe"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={errorPerfil.nombre}
              maxLength={60}
              autoFocus
            />
            <SelectField etiqueta="Carrera" value={carrera} onChange={(e) => setCarrera(e.target.value)} error={errorPerfil.carrera}>
              <option value="">Elige tu carrera…</option>
              {CARRERAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectField>
            <Button type="submit" className="w-full" cargando={cargando}>
              Empezar
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-xs text-slate-500">Datos de ejemplo · Prototipo académico (IHC)</p>
      </main>
    </div>
  );
}
