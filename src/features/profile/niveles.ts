// Niveles por puntos. Heurística 2: nombres del mundo del estudiante ("cachimbo" = ingresante).

export const NIVELES = [
  { nombre: 'Cachimbo', desde: 0 },
  { nombre: 'Colaborador', desde: 20 },
  { nombre: 'Mentor', desde: 60 },
  { nombre: 'Leyenda del campus', desde: 150 },
];

/** Nivel actual, el siguiente y el progreso (0 a 1) hacia el siguiente. */
export function calcularNivel(puntos: number) {
  let indice = 0;
  NIVELES.forEach((n, i) => {
    if (puntos >= n.desde) indice = i;
  });
  const actual = NIVELES[indice]!;
  const siguiente = NIVELES[indice + 1];
  const progreso = siguiente ? (puntos - actual.desde) / (siguiente.desde - actual.desde) : 1;
  return { actual, siguiente, progreso, faltan: siguiente ? siguiente.desde - puntos : 0 };
}
