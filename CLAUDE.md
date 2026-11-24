# UniYa — contexto del proyecto para Claude Code

> Lee este archivo completo antes de escribir código. Todo el texto visible de la app va en **español (Perú)**.

## 0. Decisiones ya tomadas

- Universidad: **Universidad Nacional de San Agustín de Arequipa (UNSA)**, campus **Área de Ingenierías** (Av. Independencia con calle Paucarpata).
- Dominio del correo institucional: **@unsa.edu.pe**.
- Color principal: **índigo** (`primary` = paleta `indigo` de Tailwind, `#4f46e5`).
- Coordenadas de los pabellones: aproximadas, marcadas con `TODO` en `src/data/campus.ts`.
- Versiones fijadas: React 18.3, react-leaflet 4.2 (la 5 exige React 19), Tailwind 3.4, Vite 5.
- El estado mostrado de un espacio es el del último reporte; entre 20 y 60 min se avisa que "podría haber cambiado"; más de 60 min se muestra gris.
- La lista de Espacios tiene orden fijo (no se reordena al reportar, para que la tarjeta no salte).
- Los datos de ejemplo se regeneran solos si tienen más de 12 h (para que las fechas se vean actuales); el usuario con sesión se conserva.

## 1. Contexto académico

- Proyecto del curso **Interacción Humano-Computador (IHC)**. Se presentará en la **feria de proyectos** de la escuela.
- Equipo de máximo 5 integrantes.
- Requisitos de la profesora:
  - Debe ser un **sistema con interacción real** (no una página informativa): el usuario agrega datos, ve una interfaz funcional y hay una experiencia de usuario cuidada.
  - El prototipo debe estar **programado**. No vale un prototipo de Figma.
  - El informe escrito será una **monografía** (la profesora enviará el esquema después).
- En la feria, el jurado valora: metodología, artefactos de análisis y diseño, **prototipo funcional**, y en IHC sobre todo la **usabilidad demostrada** (pruebas con usuarios, heurísticas de Nielsen, cuestionario SUS).

## 2. Qué es UniYa

**UniYa — todo tu campus en una app.** Es una web app *mobile-first* (instalable como PWA) para estudiantes universitarios.

**Problema:** los estudiantes, sobre todo los ingresantes, no encuentran aulas, laboratorios ni oficinas. No saben si hay sitio en la biblioteca, en las salas de estudio o en el estacionamiento hasta que llegan. Los eventos y talleres se pierden entre grupos de WhatsApp. Pedir ayuda (dudas de un curso, buscar grupo de estudio, un problema con el auto) depende de a quién conozcas.

**Usuarios:**
- Estudiante ingresante: quiere ubicarse.
- Estudiante regular: busca espacios, grupos de estudio y eventos.
- Estudiante con auto: busca estacionamiento y a veces necesita ayuda.
- Administrador u organizador: publica eventos y gestiona espacios.

## 3. Módulos y funcionalidades

Prioridad: **P1** = debe funcionar en la feria, **P2** = si alcanza el tiempo, **P3** = idea futura (solo se menciona).

### Módulo 1 · Mapa interactivo del campus
- P1: mapa del campus con marcadores por categoría: facultades, aulas, laboratorios, bibliotecas, oficinas y estacionamientos.
- P1: buscador ("aula 301", "biblioteca central") con resultados instantáneos y búsquedas recientes.
- P1: filtros por categoría (chips).
- P1: ficha de lugar: nombre, categoría, edificio y piso, horario y botón "Cómo llegar". En la Fase 1, ese botón centra el mapa y muestra la distancia aproximada a pie.
- P2: ruta a pie dibujada en el mapa y "mi ubicación".
- P3: mapa por pisos dentro de los edificios.

### Módulo 2 · Comunidad de ayuda
- P1: **preguntas y respuestas** entre estudiantes (publicar, responder, marcar la respuesta útil, filtrar por curso o facultad).
- P1: **grupos de estudio**: listar, crear y unirse (curso, horario, lugar, cupos).
- P2: **proyectos interdisciplinarios**: tablón tipo "busco integrante de diseño o de sistemas".
- P2: **asistencia vehicular**: publicar un pedido de ayuda ("batería baja en estacionamiento B") que otros pueden aceptar, con estados *abierto → en camino → resuelto*.
- P2: puntos o reputación por ayudar, con niveles.

### Módulo 3 · Disponibilidad de espacios
- P1: lista y mapa de **espacios de estudio y estacionamientos** con estado tipo semáforo: 🟢 libre, 🟡 medio lleno, 🔴 lleno. Cada estado muestra "actualizado hace X min".
- P1: **reporte colaborativo**: cualquier estudiante toca "Libre", "Medio" o "Lleno" en 1 toque. El estado mostrado es el del reporte más reciente, y la confianza baja si el reporte es antiguo (más de 60 min se muestra en gris como "sin datos recientes").
- P2: check-in y check-out con QR (simulado) para contar el aforo.
- P2: reserva de salas de estudio por bloque horario.
- P3: sensores o integración con cámaras.

### Módulo 4 · Información universitaria
- P1: agenda de **eventos, talleres, conferencias y actividades**, con filtros por tipo, facultad y fecha (hoy, esta semana).
- P1: detalle del evento, botón **"Me interesa"** y contador de interesados. El lugar del evento enlaza al mapa.
- P2: recordatorio y notificación antes del evento.
- P2: el administrador crea, edita y elimina eventos.

### Transversal
- P1: inicio de sesión **simulado** con correo institucional: validar el formato `@<dominio-universidad>` y mostrar un error claro si no coincide.
- P1: perfil con nombre, carrera, puntos e historial de aportes.
- P1: pantalla de inicio (dashboard) con resumen: espacios libres ahora, próximos eventos, preguntas recientes y acceso rápido al mapa.
- P2: rol de administrador (cambio de rol simulado en el perfil para la demo).
- P2: modo accesible: tamaño de letra grande y alto contraste.

## 4. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | **React 18 + Vite + TypeScript** |
| Estilos | **Tailwind CSS** |
| Rutas | React Router |
| Estado | Zustand, persistido en `localStorage` en la Fase 1 |
| Mapa | **Leaflet + react-leaflet** con teselas de OpenStreetMap (gratis, sin API key) |
| Íconos | lucide-react |
| Backend (Fase 2) | **Firebase**: Authentication (Google, restringido al dominio institucional), **Firestore** con `onSnapshot` para el tiempo real y Hosting |
| PWA (Fase 3) | vite-plugin-pwa |

**Regla de arquitectura:** los componentes **nunca** leen los datos directamente. Todo pasa por `src/services/*` (por ejemplo `spacesService.getAll()` o `spacesService.report(id, estado)`). En la Fase 1 esos servicios usan datos mock y el store; en la Fase 2 se cambia la implementación a Firebase sin tocar las pantallas. Para simular el tiempo real, los servicios exponen `subscribe(callback)`.

Implementación actual: `subscribe(callback)` llama al callback de inmediato y en cada cambio (como `onSnapshot`); las pantallas usan `useLive(servicio.subscribe)`, que devuelve `undefined` mientras carga. Los `subscribeOne` devuelven `null` si el elemento no existe. Un listener del evento `storage` sincroniza pestañas abiertas (tiempo real simulado).

### Estructura

```
src/
  app/            # router, layout con barra de navegación inferior
  pages/          # Inicio, Mapa, Comunidad, Espacios, Eventos, Perfil, Login, Ayuda
  components/     # UI reutilizable: Card, Chip, StatusBadge, Toast, EmptyState, BottomNav, SearchBar, Modal, ui.tsx
  features/       # lógica por módulo: map/, community/, spaces/, events/, profile/
  services/       # capa de datos (mock ahora, Firebase después)
  data/           # datos de ejemplo + campus.ts (coordenadas del campus y de cada lugar)
  store/          # Zustand
  hooks/          # useLive, useAhora, useUsuarioActual
  lib/            # formato de fechas y distancias
  types/          # tipos TypeScript
```

### Modelo de datos (tipos)

Ver `src/types/index.ts`. Además de los tipos originales se agregó `Lugar.alias` (palabras extra para el buscador) y `Aporte` (historial de puntos, con `refId` para poder deshacer).

### Datos de ejemplo
- 26 lugares, 8 espacios con reportes, 8 preguntas con respuestas, 5 grupos de estudio y 10 eventos en las próximas 2 semanas. Las fechas son relativas a `Date.now()`. (Los 3 pedidos vehiculares quedan para la Fase 2, junto con ese módulo.)
- No inventar nombres de autoridades reales. Usar nombres de estudiantes ficticios. Mostrar una línea discreta: "Datos de ejemplo".

## 5. Reglas de diseño (es un curso de IHC: esto se evalúa)

Aplica las **10 heurísticas de Nielsen** y deja comentarios `// Heurística N: ...` en los puntos clave, para poder citarlos en la monografía:
1. **Visibilidad del estado:** toasts de confirmación, estados de carga, "actualizado hace X min".
2. **Coincidencia con el mundo real:** lenguaje del estudiante ("cachimbo", "pabellón", "aula"), íconos claros.
3. **Control y libertad:** botón **Deshacer** en el toast después de reportar, votar o unirse. Siempre hay forma de volver.
4. **Consistencia:** los mismos componentes y colores en todos los módulos. Semáforo: verde `#16a34a`, ámbar `#d97706`, rojo `#dc2626`, gris si no hay datos.
5. **Prevención de errores:** validar formularios antes de enviar y confirmar las acciones destructivas.
6. **Reconocer antes que recordar:** chips de filtros, búsquedas recientes, sugerencias.
7. **Flexibilidad:** accesos rápidos en el inicio y búsqueda global.
8. **Diseño minimalista:** una acción principal por pantalla.
9. **Mensajes de error útiles:** dicen qué pasó y cómo arreglarlo.
10. **Ayuda:** una pantalla corta "¿Cómo funciona?" y estados vacíos que explican qué hacer.

Además:
- **Mobile-first**: se diseña para 375 px de ancho y se adapta a escritorio (en escritorio, la app va centrada con un ancho máximo de unos 480 px y fondo de color).
- Barra de navegación inferior con 5 pestañas: **Inicio, Mapa, Comunidad, Espacios, Eventos**. El perfil se abre desde el avatar arriba.
- Accesibilidad: contraste WCAG AA, objetivos táctiles de 44 px o más, `aria-label` en los botones con ícono, foco visible y textos de 16 px o más en los inputs.
- Identidad visual: índigo universitario, tipografía Inter o la del sistema, esquinas redondeadas y sombras suaves.

## 6. Fases

### Fase 1 — AVANCE ✅ completada
- [x] Proyecto Vite + React + TS + Tailwind creado y corriendo con `npm run dev`.
- [x] Login simulado → Inicio (dashboard).
- [x] Navegación inferior con las 5 secciones.
- [x] **Mapa**: marcadores, filtros por categoría, buscador y ficha de lugar.
- [x] **Espacios**: lista con semáforo y reporte en 1 toque con Deshacer. Se refleja también en el mapa y en el Inicio.
- [x] **Comunidad**: preguntas (crear y responder) y grupos de estudio (listar, crear y unirse).
- [x] **Eventos**: lista con filtros, detalle y "Me interesa".
- [x] Perfil con puntos que suben al aportar.
- [x] `docs/AVANCE.md`.
- [x] `npm run build` sin errores y sin errores en la consola (verificado a 375 px con Chrome headless).

### Fase 2 — Funcionalidad real
- Firebase Auth + Firestore, con reportes de espacios y preguntas en **tiempo real** entre varios celulares.
- Asistencia vehicular, proyectos interdisciplinarios y rol de administrador para eventos.
- Recordatorios de eventos.

### Fase 3 — Feria
- PWA instalable y deploy en Firebase Hosting (link y QR para el stand).
- Modo accesible.
- Pulido visual, pantalla "¿Cómo funciona?" y datos de ejemplo realistas.
- **Demo estrella:** el jurado reporta desde su celular "Biblioteca: Lleno" y la pantalla del stand cambia a rojo al instante.

## 7. Contenido de `docs/AVANCE.md`

Resumen de una o dos páginas para la reunión de avance: nombre y frase, problema y usuarios, objetivo general y específicos, alcance P1/P2/P3, mapa de navegación (Mermaid), tecnologías y por qué, checklist de la Fase 1, roles para 5 integrantes, cronograma de 4 semanas y preguntas para la profesora.

## 8. Cómo trabajar

- Trabaja en pasos pequeños, verifica que compile y que se vea bien en 375 px antes de seguir.
- Código claro y comentado en español: el equipo debe entenderlo y explicarlo ante la profesora.
- Al terminar cada fase, actualiza el checklist de este archivo y el `README.md`.
