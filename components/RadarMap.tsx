
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { NearbyDevice, AppStatus, TacticalZone } from '../types';

interface TacticalMapProps {
  status: AppStatus;
  devices: NearbyDevice[];
  userLocation: { lat: number, lng: number } | null;
  zones?: TacticalZone[];
}

const TacticalMap: React.FC<TacticalMapProps> = ({ status, devices, userLocation, zones = [] }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const zonesRef = useRef<{ [key: string]: L.Circle }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  const isSOS = status === AppStatus.SOS_ACTIVE;
  const isScanning = status === AppStatus.SCANNING || isSOS;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialLat = userLocation?.lat || 0;
    const initialLng = userLocation?.lng || 0;

    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([initialLat, initialLng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    const pos: L.LatLngExpression = [userLocation.lat, userLocation.lng];
    if (!userMarkerRef.current) {
      const userIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-4 h-4 rounded-full border-2 border-white ${isSOS ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-blue-500'} transition-colors duration-300"></div>`,
        iconSize: [16, 16]
      });
      userMarkerRef.current = L.marker(pos, { icon: userIcon }).addTo(mapRef.current);
    } else {
      userMarkerRef.current.setLatLng(pos);
      const userIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-4 h-4 rounded-full border-2 border-white ${isSOS ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-blue-500'} transition-colors duration-300"></div>`,
        iconSize: [16, 16]
      });
      userMarkerRef.current.setIcon(userIcon);
    }
    if (status !== AppStatus.IDLE) {
      mapRef.current.panTo(pos);
    }
  }, [userLocation, isSOS, status]);

  useEffect(() => {
    if (!mapRef.current) return;
    (Object.values(zonesRef.current) as L.Circle[]).forEach(z => z.remove());
    zonesRef.current = {};
    zones.forEach(zone => {
      const isRed = zone.type === 'RED';
      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radius,
        color: isRed ? '#dc2626' : '#10b981',
        fillColor: isRed ? '#dc2626' : '#10b981',
        fillOpacity: 0.15,
        weight: 1,
        dashArray: isRed ? '5, 5' : undefined
      }).addTo(mapRef.current!);
      if (isScanning) {
        circle.bindTooltip(zone.label, { permanent: true, direction: 'center', className: 'tactical-tooltip' });
      }
      zonesRef.current[zone.id] = circle;
    });
  }, [zones, isScanning]);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    (Object.values(markersRef.current) as L.Marker[]).forEach(m => m.remove());
    markersRef.current = {};

    devices.forEach(device => {
      const lat = device.lat || userLocation.lat + (Math.random() - 0.5) * 0.01;
      const lng = device.lng || userLocation.lng + (Math.random() - 0.5) * 0.01;

      const getIconHtml = () => {
        const baseClass = "p-1 rounded border border-white text-[7px] font-bold shadow-sm whitespace-nowrap uppercase flex items-center gap-1";
        switch(device.type) {
          case 'GUARDIAN': return `<div class="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]"></div>`;
          case 'SUSPECT': return `<div class="w-4 h-4 rounded-full bg-red-600 pulse-danger shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>`;
          case 'POI_POLICE': return `<div class="${baseClass} bg-blue-600">POLICE</div>`;
          case 'POI_FOOD': return `<div class="${baseClass} bg-orange-500">FOOD</div>`;
          case 'POI_LEISURE': return `<div class="${baseClass} bg-purple-500">LEISURE</div>`;
          case 'POI_SPORTS': return `<div class="${baseClass} bg-emerald-600">SPORTS</div>`;
          case 'POI_SALON': return `<div class="${baseClass} bg-pink-500">WELLNESS</div>`;
          case 'POI_MALL': return `<div class="${baseClass} bg-indigo-600">MALL</div>`;
          case 'POI_HOTEL': return `<div class="${baseClass} bg-sky-700"><span class="text-[10px]">🏨</span> LODGING</div>`;
          // Life Updates
          case 'POI_ACCIDENT': return `<div class="${baseClass} bg-red-700 animate-pulse"><span class="text-[10px]">⚠️</span> ACCIDENT</div>`;
          case 'POI_ROAD_CLOSED': return `<div class="${baseClass} bg-amber-600"><span class="text-[10px]">🚧</span> CLOSED</div>`;
          case 'POI_SALE': return `<div class="${baseClass} bg-yellow-500 text-black border-black"><span class="text-[10px]">🏷️</span> SALE</div>`;
          case 'POI_EVENT': return `<div class="${baseClass} bg-sky-500"><span class="text-[10px]">ℹ️</span> EVENT</div>`;
          default: return `<div class="w-2 h-2 rounded-full bg-slate-500"></div>`;
        }
      };

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="flex flex-col items-center">
            ${getIconHtml()}
            ${(isScanning || device.type.startsWith('POI_')) ? `<div class="mt-1 text-[6px] mono bg-slate-900/90 text-white px-1 py-0.5 rounded border border-slate-700 whitespace-nowrap">${device.label}</div>` : ''}
          </div>
        `,
        iconSize: [60, 60]
      });

      markersRef.current[device.id] = L.marker([lat, lng], { icon }).addTo(mapRef.current!);
    });
  }, [devices, userLocation, isScanning]);

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto rounded-xl border border-slate-800 overflow-hidden shadow-2xl shadow-red-900/10 bg-slate-950">
      {/* Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />
      
      {/* Tactical Grid Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Radar Scan Layer */}
      {isScanning && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 radar-beam">
            <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-gradient-to-tr from-red-500/10 to-transparent origin-top-left -rotate-90 rounded-tr-full" />
          </div>
          <div className="scanline" />
        </div>
      )}
      
      {isSOS && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full border-8 border-red-600/30 pulse-danger" />
        </div>
      )}

      {/* Corner UI */}
      <div className="absolute bottom-4 left-4 z-40 whitespace-nowrap text-[8px] mono font-bold text-slate-400 bg-slate-900/90 px-2 py-1 rounded border border-slate-700">
        LIFE_MAP_SQUARE_V5.0 | {userLocation?.lat.toFixed(4)}, {userLocation?.lng.toFixed(4)}
      </div>

      <style>{`
        .tactical-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: white !important;
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          font-weight: bold;
          text-shadow: 1px 1px 2px black;
          pointer-events: none;
        }
        .tactical-tooltip:before { display: none; }
      `}</style>
    </div>
  );
};

export default TacticalMap;
