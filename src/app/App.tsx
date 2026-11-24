import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useUsuarioActual } from '../hooks/useUsuarioActual';
import { AppLayout } from './AppLayout';
import { InicioPage } from '../pages/InicioPage';
import { MapaPage } from '../pages/MapaPage';
import { EspaciosPage } from '../pages/EspaciosPage';
import { EventosPage } from '../pages/EventosPage';
import { EventoDetallePage } from '../pages/EventoDetallePage';
import { ComunidadPage } from '../pages/ComunidadPage';
import { PreguntaDetallePage } from '../pages/PreguntaDetallePage';
import { NuevaPreguntaPage } from '../pages/NuevaPreguntaPage';
import { PerfilPage } from '../pages/PerfilPage';
import { AyudaPage } from '../pages/AyudaPage';
import { LoginPage } from '../pages/LoginPage';
import { NoEncontradoPage } from '../pages/NoEncontradoPage';

/** Si no hay sesión, manda al login y recuerda a dónde quería ir. */
function RequiereSesion({ children }: { children: ReactNode }) {
  const usuario = useUsuarioActual();
  const ubicacion = useLocation();
  if (usuario === undefined) return null;
  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />;
  return <>{children}</>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <RequiereSesion>
              <AppLayout />
            </RequiereSesion>
          }
        >
          <Route index element={<InicioPage />} />
          <Route path="mapa" element={<MapaPage />} />
          <Route path="espacios" element={<EspaciosPage />} />
          <Route path="eventos" element={<EventosPage />} />
          <Route path="eventos/:id" element={<EventoDetallePage />} />
          <Route path="comunidad" element={<ComunidadPage />} />
          <Route path="comunidad/preguntas/nueva" element={<NuevaPreguntaPage />} />
          <Route path="comunidad/preguntas/:id" element={<PreguntaDetallePage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="ayuda" element={<AyudaPage />} />
          <Route path="*" element={<NoEncontradoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
