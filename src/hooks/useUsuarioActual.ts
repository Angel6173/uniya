import { authService, usersService } from '../services/authService';
import { useLive } from './useLive';

/** Usuario con sesión iniciada (null = sin sesión, undefined = cargando). */
export function useUsuarioActual() {
  return useLive(authService.subscribeUsuarioActual);
}

/** Diccionario id → usuario, para mostrar nombres de autores. */
export function useUsuarios() {
  return useLive(usersService.subscribeAll) ?? {};
}

/** Nombre a mostrar de un autor ("Tú" si es el usuario actual). */
export function nombreAutor(usuarios: ReturnType<typeof useUsuarios>, id: string, yoId?: string) {
  if (id === yoId) return 'Tú';
  return usuarios[id]?.nombre ?? 'Estudiante';
}
