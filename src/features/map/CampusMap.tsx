import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { CENTRO_CAMPUS, PUERTA_PRINCIPAL, ZOOM_INICIAL } from '../../data/campus';
import type { EspacioConEstado } from '../../services/spacesService';
import type { Lugar } from '../../types';
import { SEMAFORO, estadoVisible } from '../spaces/estado';
import { CATEGORIAS } from './categorias';
import { iconoLugar, iconoPuerta } from './marcadores';

interface CampusMapProps {
  lugares: Lugar[];
  espacios: EspacioConEstado[];
  ahora: number;
  seleccionadoId: string | null;
  mostrarRuta: boolean;
  onSeleccionar: (id: string | null) => void;
}

/** Mueve la cámara cuando cambia el lugar elegido o se pide "Cómo llegar". */
function ControlCamara({ destino, mostrarRuta }: { destino: Lugar | undefined; mostrarRuta: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!destino) return;
    if (mostrarRuta) {
      // Encuadra la puerta y el destino. El padding inferior deja sitio a la ficha.
      map.flyToBounds(L.latLngBounds([PUERTA_PRINCIPAL, destino]), { paddingTopLeft: [40, 140], paddingBottomRight: [40, 300], maxZoom: 18 });
    } else {
      // Centra el lugar un poco más arriba, para que la ficha de abajo no lo tape.
      const zoom = Math.max(map.getZoom(), 18);
      const punto = map.project([destino.lat, destino.lng], zoom).add([0, 110]);
      map.flyTo(map.unproject(punto, zoom), zoom, { duration: 0.6 });
    }
  }, [destino, mostrarRuta, map]);
  return null;
}

/** Tocar una zona vacía del mapa cierra la ficha. */
function CerrarAlTocarMapa({ onCerrar }: { onCerrar: () => void }) {
  useMapEvents({ click: onCerrar });
  return null;
}

export function CampusMap({ lugares, espacios, ahora, seleccionadoId, mostrarRuta, onSeleccionar }: CampusMapProps) {
  const seleccionado = lugares.find((l) => l.id === seleccionadoId);

  /** Color del marcador: semáforo si es un espacio, color de categoría si no. */
  function colorDe(lugar: Lugar) {
    const espacio = espacios.find((e) => e.lugar.id === lugar.id);
    if (!espacio) return CATEGORIAS[lugar.categoria].color;
    return SEMAFORO[estadoVisible(espacio.ultimoReporte, ahora).estado].color;
  }

  return (
    <MapContainer
      center={[CENTRO_CAMPUS.lat, CENTRO_CAMPUS.lng]}
      zoom={ZOOM_INICIAL}
      minZoom={15}
      maxZoom={19}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <ControlCamara destino={seleccionado} mostrarRuta={mostrarRuta} />
      <CerrarAlTocarMapa onCerrar={() => onSeleccionar(null)} />

      {lugares.map((lugar) => (
        <Marker
          key={lugar.id}
          position={[lugar.lat, lugar.lng]}
          icon={iconoLugar(lugar, colorDe(lugar), lugar.id === seleccionadoId)}
          title={lugar.nombre}
          alt={lugar.nombre}
          zIndexOffset={lugar.id === seleccionadoId ? 1000 : 0}
          eventHandlers={{ click: () => onSeleccionar(lugar.id) }}
        />
      ))}

      {/* "Cómo llegar" de la Fase 1: línea recta desde la puerta principal. La ruta real llega en la Fase 2. */}
      {seleccionado && mostrarRuta && (
        <>
          <Marker position={[PUERTA_PRINCIPAL.lat, PUERTA_PRINCIPAL.lng]} icon={iconoPuerta} title={PUERTA_PRINCIPAL.nombre}>
            <Tooltip permanent direction="top" offset={[0, -18]}>
              Partida: puerta principal
            </Tooltip>
          </Marker>
          <Polyline
            positions={[
              [PUERTA_PRINCIPAL.lat, PUERTA_PRINCIPAL.lng],
              [seleccionado.lat, seleccionado.lng],
            ]}
            pathOptions={{ color: '#4f46e5', weight: 5, dashArray: '2 10', lineCap: 'round' }}
          />
        </>
      )}
    </MapContainer>
  );
}
