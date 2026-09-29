import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RouteCoordinate, WalkEvent } from '../types';

interface MapViewProps {
  coordinates: RouteCoordinate[];
  events: WalkEvent[];
  isLiveTracking?: boolean;
  onMarkerClick?: (event: WalkEvent) => void;
  className?: string;
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  coordinates,
  events,
  isLiveTracking = false,
  onMarkerClick,
  className = '',
  height = '420px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const walkerMarkerRef = useRef<L.Marker | null>(null);
  const eventMarkersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center SF or first coordinate
    const centerLat = coordinates.length > 0 ? coordinates[coordinates.length - 1].lat : 37.7712;
    const centerLng = coordinates.length > 0 ? coordinates[coordinates.length - 1].lng : -122.4645;

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 16,
      zoomControl: false,
    });

    // Add crisp OpenStreetMap tiles with friendly contrast
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Route Polyline
    const latLngs = coordinates.map((c) => [c.lat, c.lng] as [number, number]);
    const polyline = L.polyline(latLngs, {
      color: '#10b981', // emerald green
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: isLiveTracking ? undefined : undefined,
    }).addTo(map);

    polylineRef.current = polyline;

    // Layer group for events
    const eventGroup = L.layerGroup().addTo(map);
    eventMarkersRef.current = eventGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update polyline and walker marker whenever coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const latLngs = coordinates.map((c) => [c.lat, c.lng] as [number, number]);

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latLngs);
    }

    if (coordinates.length > 0) {
      const lastCoord = coordinates[coordinates.length - 1];

      // Update or create current walker marker
      const walkerIcon = L.divIcon({
        className: 'custom-walker-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-emerald-500 opacity-30 animate-ping"></div>
            <div class="relative w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold">
              🐾
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      if (walkerMarkerRef.current) {
        walkerMarkerRef.current.setLatLng([lastCoord.lat, lastCoord.lng]);
      } else {
        walkerMarkerRef.current = L.marker([lastCoord.lat, lastCoord.lng], {
          icon: walkerIcon,
          zIndexOffset: 1000,
        }).addTo(map);
      }

      // Pan to keep walker centered during live tracking
      if (isLiveTracking) {
        map.panTo([lastCoord.lat, lastCoord.lng], { animate: true });
      }
    }
  }, [coordinates, isLiveTracking]);

  // Update events markers (pee, poop, water, photo, etc.)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const eventGroup = eventMarkersRef.current;
    if (!map || !eventGroup) return;

    eventGroup.clearLayers();

    events.forEach((ev) => {
      let iconEmoji = '📍';
      let bgColor = 'bg-stone-800';

      if (ev.type === 'pee') {
        iconEmoji = '🟡';
        bgColor = 'bg-amber-400';
      } else if (ev.type === 'poop') {
        iconEmoji = '💩';
        bgColor = 'bg-amber-800';
      } else if (ev.type === 'water') {
        iconEmoji = '💧';
        bgColor = 'bg-sky-500';
      } else if (ev.type === 'treat') {
        iconEmoji = '🦴';
        bgColor = 'bg-orange-500';
      } else if (ev.type === 'hazard') {
        iconEmoji = '⚠️';
        bgColor = 'bg-rose-500';
      } else if (ev.type === 'photo') {
        iconEmoji = '📸';
        bgColor = 'bg-emerald-600';
      }

      const eventIcon = L.divIcon({
        className: 'custom-event-icon',
        html: `
          <div class="w-7 h-7 rounded-full ${bgColor} border-2 border-white shadow-md flex items-center justify-center text-xs cursor-pointer transform hover:scale-125 transition-transform duration-150">
            <span>${iconEmoji}</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([ev.lat, ev.lng], { icon: eventIcon });
      
      marker.bindPopup(`
        <div class="p-1 font-sans">
          <div class="font-bold text-sm text-stone-800 flex items-center gap-1.5">
            <span>${iconEmoji}</span>
            <span>${ev.title}</span>
          </div>
          <div class="text-xs text-stone-500 mt-0.5">
            ${new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          ${ev.notes ? `<div class="text-xs text-stone-600 mt-1 italic">${ev.notes}</div>` : ''}
        </div>
      `);

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(ev));
      }

      marker.addTo(eventGroup);
    });
  }, [events, onMarkerClick]);

  const handleCenterOnWalker = () => {
    if (!mapInstanceRef.current || coordinates.length === 0) return;
    const lastCoord = coordinates[coordinates.length - 1];
    mapInstanceRef.current.setView([lastCoord.lat, lastCoord.lng], 17, { animate: true });
  };

  const handleFitRouteBounds = () => {
    if (!mapInstanceRef.current || coordinates.length === 0) return;
    const bounds = L.latLngBounds(coordinates.map((c) => [c.lat, c.lng]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], animate: true });
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-stone-200/80 shadow-sm ${className}`}>
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
        <button
          onClick={handleCenterOnWalker}
          title="Center on Walker"
          className="p-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-stone-200 text-stone-700 hover:text-emerald-700 hover:bg-white active:scale-95 transition flex items-center justify-center"
        >
          <span className="text-base">🎯</span>
        </button>
        <button
          onClick={handleFitRouteBounds}
          title="Fit Whole Route"
          className="p-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-stone-200 text-stone-700 hover:text-emerald-700 hover:bg-white active:scale-95 transition flex items-center justify-center"
        >
          <span className="text-base">🗺️</span>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-200/80 shadow-sm text-[11px] text-stone-600 flex items-center gap-3">
        <span className="flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Walk Route</span>
        <span className="flex items-center gap-1">🟡 Pee</span>
        <span className="flex items-center gap-1">💩 Poop</span>
        <span className="flex items-center gap-1">💧 Water</span>
        <span className="flex items-center gap-1">📸 Photo</span>
      </div>
    </div>
  );
};
