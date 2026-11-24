import { useEffect, useLayoutEffect, useState } from 'react';

type Suscribir<T> = (callback: (datos: T) => void) => () => void;

/**
 * Conecta una pantalla a un servicio con `subscribe`.
 * Devuelve `undefined` mientras carga (en la Fase 2, mientras llega Firestore).
 *
 * Uso: const espacios = useLive(spacesService.subscribe);
 * Si la suscripción depende de un parámetro, pásalo en `deps`:
 *      const pregunta = useLive((cb) => communityService.subscribePregunta(id, cb), [id]);
 */
export function useLive<T>(suscribir: Suscribir<T>, deps: unknown[] = []): T | undefined {
  const [datos, setDatos] = useState<{ valor: T }>();
  // useLayoutEffect: con datos locales evita un "parpadeo" del estado de carga.
  // `suscribir` no va en las dependencias a propósito: suele ser una función nueva en cada render.
  useLayoutEffect(() => suscribir((valor) => setDatos({ valor })), deps);
  return datos?.valor;
}

/**
 * Hora actual que se actualiza sola (por defecto cada 30 s).
 * Sirve para que "actualizado hace X min" y el semáforo gris cambien sin recargar.
 */
export function useAhora(cadaMs = 30_000) {
  const [ahora, setAhora] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), cadaMs);
    return () => clearInterval(id);
  }, [cadaMs]);
  return ahora;
}
