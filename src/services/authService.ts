import { UNIVERSIDAD } from '../data/campus';
import { useAppStore } from '../store/useAppStore';
import type { Aporte, Usuario } from '../types';
import { crearSuscripcion, esperar, generarId } from './base';

// Servicio de sesión y usuarios.
// Fase 1: inicio de sesión SIMULADO (solo se valida el correo, no hay contraseña real).
// Fase 2: Firebase Authentication con Google, restringido al dominio institucional.

export type ResultadoLogin = { tipo: 'ok'; usuario: Usuario } | { tipo: 'nuevo'; correo: string };

/**
 * Heurística 9 (mensajes de error útiles): dice QUÉ pasó y CÓMO arreglarlo.
 * Devuelve null si el correo es válido.
 */
export function validarCorreo(correoCrudo: string): string | null {
  const correo = correoCrudo.trim().toLowerCase();
  const dominio = `@${UNIVERSIDAD.dominioCorreo}`;
  const ejemplo = `Ejemplo: jperez${dominio}`;
  if (!correo) return `Escribe tu correo institucional. ${ejemplo}`;
  if (/\s/.test(correo)) return `El correo no puede tener espacios. ${ejemplo}`;
  const partes = correo.split('@');
  if (partes.length !== 2 || !partes[0] || !partes[1]) return `Falta la parte "${dominio}" o el usuario antes de la @. ${ejemplo}`;
  if (`@${partes[1]}` !== dominio) {
    return `Usaste @${partes[1]}. Solo se puede entrar con tu correo de la ${UNIVERSIDAD.sigla} (termina en ${dominio}).`;
  }
  if (!/^[a-z0-9._%+-]+$/.test(partes[0])) return `El usuario solo puede tener letras, números, puntos o guiones. ${ejemplo}`;
  return null;
}

export const authService = {
  subscribeUsuarioActual(callback: (usuario: Usuario | null) => void) {
    return crearSuscripcion(
      (s) => [s.sesionId, s.usuarios],
      (s) => s.usuarios.find((u) => u.id === s.sesionId) ?? null,
      callback,
    );
  },

  estaLogueado() {
    return useAppStore.getState().sesionId !== null;
  },

  /** Si el correo ya existe, inicia sesión. Si no, pide completar el perfil. */
  async login(correoCrudo: string): Promise<ResultadoLogin> {
    const error = validarCorreo(correoCrudo);
    if (error) throw new Error(error);
    await esperar(600); // simula la red para mostrar el estado "Ingresando…"
    const correo = correoCrudo.trim().toLowerCase();
    const usuario = useAppStore.getState().usuarios.find((u) => u.correo === correo);
    if (!usuario) return { tipo: 'nuevo', correo };
    useAppStore.setState({ sesionId: usuario.id });
    return { tipo: 'ok', usuario };
  },

  async registrar(datos: { correo: string; nombre: string; carrera: string }): Promise<Usuario> {
    await esperar(400);
    const usuario: Usuario = { id: generarId('u'), ...datos, rol: 'estudiante', puntos: 0 };
    useAppStore.setState((s) => ({ usuarios: [...s.usuarios, usuario], sesionId: usuario.id }));
    return usuario;
  },

  logout() {
    useAppStore.setState({ sesionId: null });
  },
};

export const usersService = {
  /** Todos los usuarios por id (para mostrar el nombre de quien publicó algo). */
  subscribeAll(callback: (usuarios: Record<string, Usuario>) => void) {
    return crearSuscripcion(
      (s) => [s.usuarios],
      (s) => Object.fromEntries(s.usuarios.map((u) => [u.id, u])),
      callback,
    );
  },

  /** Historial de aportes del usuario con sesión (más reciente primero). */
  subscribeMisAportes(callback: (aportes: Aporte[]) => void) {
    return crearSuscripcion(
      (s) => [s.aportes, s.sesionId],
      (s) => s.aportes.filter((a) => a.usuarioId === s.sesionId),
      callback,
    );
  },

  async actualizarPerfil(datos: { nombre: string; carrera: string }) {
    const id = useAppStore.getState().sesionId;
    useAppStore.setState((s) => ({ usuarios: s.usuarios.map((u) => (u.id === id ? { ...u, ...datos } : u)) }));
  },
};
