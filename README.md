# UniYa — todo tu campus en una app

Prototipo del curso **Interacción Humano-Computador (IHC)**. Web app *mobile-first* para estudiantes de la UNSA (Área de Ingenierías): mapa del campus, disponibilidad de espacios, comunidad de ayuda y eventos.

> **Fase 1 (actual):** funciona con datos de ejemplo guardados en el navegador. No necesita internet salvo para las teselas del mapa.

## Cómo correrlo

Requisitos: [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
```

- **Probar en el celular:** con la PC y el celular en la misma red Wi-Fi, abre la dirección `Network:` que muestra `npm run dev` (por ejemplo `http://192.168.1.20:5173`).
- **Probar a 375 px en la PC:** F12 → ícono de celular (modo dispositivo) → iPhone SE o 375 de ancho.
- **Versión final:** `npm run build` genera la carpeta `dist/`; `npm run preview` la sirve.

## Para la demo

- Entra con cualquier correo `@unsa.edu.pe`. La primera vez te pide nombre y carrera. También puedes usar `lquispe@unsa.edu.pe` (usuaria de ejemplo).
- **Tiempo real simulado:** abre la app en **dos pestañas o ventanas**, reporta "Lleno" en una y la otra cambia al instante. En la Fase 2 esto funcionará entre celulares con Firebase.
- **Volver a empezar:** Perfil → "Restablecer datos de ejemplo". Los datos también se regeneran solos si tienen más de 12 horas, para que las fechas se vean actuales.

## Estructura

```
src/
  app/          Rutas y layout (cabecera + barra inferior)
  pages/        Una pantalla por archivo: Inicio, Mapa, Espacios, Eventos, Comunidad, Perfil, Login…
  components/   Piezas reutilizables: Card, Chip, StatusBadge, Toast, Modal, SearchBar, BottomNav…
  features/     Lógica y componentes de cada módulo (map/, spaces/, community/, events/, profile/)
  services/     Capa de datos. Las pantallas SOLO hablan con los servicios.
  store/        Estado de la Fase 1 (Zustand + localStorage). Solo lo usan los servicios.
  data/         campus.ts (lugares y coordenadas) y mock.ts (datos de ejemplo)
  hooks/        useLive (suscribirse a un servicio), useAhora, useUsuarioActual
  lib/          Formato de fechas, distancias y textos
  types/        Tipos de TypeScript del modelo de datos
docs/AVANCE.md  Resumen para la reunión de avance
```

**Regla de arquitectura:** los componentes nunca leen el store. Usan `useLive(servicio.subscribe)` y llaman a métodos como `spacesService.report(id, 'lleno')`. En la Fase 2 solo se cambia el interior de `src/services/` por Firebase.

**Heurísticas de Nielsen:** busca `Heurística` en el código para encontrar dónde se aplica cada una (útil para la monografía).

## Ajustar el campus

Las coordenadas de los pabellones en `src/data/campus.ts` son **aproximadas** (marcadas con `TODO`). Para corregirlas: en [openstreetmap.org](https://www.openstreetmap.org), clic derecho sobre el edificio → "Mostrar dirección", copia la latitud y la longitud y pégalas en el lugar correspondiente.
