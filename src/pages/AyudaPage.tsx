import { ArrowLeft, CalendarDays, Map, MessagesSquare, ParkingSquare, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Pantalla } from '../app/AppLayout';
import { Card } from '../components/Card';
import { SEMAFORO, MINUTOS_SIN_DATOS, type EstadoVisible } from '../features/spaces/estado';
import { NIVELES } from '../features/profile/niveles';
import { PUNTOS } from '../services/base';

// Heurística 10 (ayuda y documentación): una pantalla corta, en lenguaje simple.

const SECCIONES = [
  { icono: Map, titulo: 'Mapa', texto: 'Busca aulas, laboratorios, oficinas o estacionamientos. Toca un punto para ver su horario y "Cómo llegar".' },
  { icono: ParkingSquare, titulo: 'Espacios', texto: 'Mira si hay sitio en bibliotecas, salas de estudio y estacionamientos. Si estás en uno, toca Libre, Medio o Lleno: con un toque ayudas a todos.' },
  { icono: MessagesSquare, titulo: 'Comunidad', texto: 'Pregunta tus dudas de cursos o del campus, responde a otros y únete a grupos de estudio.' },
  { icono: CalendarDays, titulo: 'Eventos', texto: 'Talleres, conferencias y actividades. Toca "Me interesa" para guardarlos.' },
];

const PUNTOS_TEXTO: [string, number][] = [
  ['Reportar un espacio', PUNTOS.reporte],
  ['Hacer una pregunta', PUNTOS.pregunta],
  ['Responder una pregunta', PUNTOS.respuesta],
  ['Tu respuesta marcada como útil', PUNTOS.respuesta_util],
  ['Crear un grupo de estudio', PUNTOS.grupo_creado],
  ['Unirte a un grupo', PUNTOS.grupo_unido],
];

export function AyudaPage() {
  const navigate = useNavigate();
  return (
    <Pantalla>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="-ml-2 flex min-h-[44px] items-center gap-1 rounded-lg px-2 font-semibold text-primary-700 hover:bg-primary-50"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden /> Volver
      </button>
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">¿Cómo funciona UniYa?</h1>
        <p className="text-slate-600">Todo tu campus en una app, hecha entre estudiantes.</p>
      </div>

      <div className="space-y-3">
        {SECCIONES.map(({ icono: Icono, titulo, texto }) => (
          <Card key={titulo} className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <Icono className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">{titulo}</h2>
              <p className="text-sm text-slate-700">{texto}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="mb-2 font-bold text-slate-900">¿Qué significan los colores?</h2>
        <ul className="space-y-2">
          {(Object.keys(SEMAFORO) as EstadoVisible[]).map((e) => (
            <li key={e} className="flex items-center gap-3 text-sm text-slate-800">
              <span className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: SEMAFORO[e].color }} aria-hidden />
              <strong>{SEMAFORO[e].etiqueta}</strong>
              {e === 'sin_datos' && <span className="text-slate-600">— nadie reportó en los últimos {MINUTOS_SIN_DATOS} min</span>}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-slate-600">Se muestra lo que dijo el último estudiante que reportó y hace cuánto lo hizo.</p>
      </Card>

      <Card>
        <h2 className="mb-2 flex items-center gap-2 font-bold text-slate-900">
          <Star className="h-5 w-5 fill-amber-400 text-amber-500" aria-hidden /> Puntos por ayudar
        </h2>
        <ul className="divide-y divide-slate-100 text-sm">
          {PUNTOS_TEXTO.map(([texto, pts]) => (
            <li key={texto} className="flex justify-between py-2">
              <span className="text-slate-800">{texto}</span>
              <strong className="text-amber-700">+{pts}</strong>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-slate-600">
          Niveles: {NIVELES.map((n) => `${n.nombre} (${n.desde}+)`).join(' → ')}.
        </p>
        <p className="mt-1 text-sm text-slate-600">¿Te equivocaste? Toca "Deshacer" en el aviso que aparece abajo.</p>
      </Card>
    </Pantalla>
  );
}
