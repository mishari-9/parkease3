"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Navigation } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import { ParkingLot, MapRegion } from "@/types";
import { config } from "@/constants/config";

// Lazy-load Leaflet using dynamic import - prevents SSR window is not defined
type LeafletMod = {
  MapContainer: any;
  TileLayer: any;
  Marker: any;
  Popup: any;
  useMap: any;
  L: any;
};

let leafletModule: LeafletMod | null = null;
let leafletLoading: Promise<LeafletMod> | null = null;

async function loadLeaflet(): Promise<LeafletMod> {
  if (leafletModule) return leafletModule;
  if (leafletLoading) return leafletLoading;

  leafletLoading = (async () => {
    const rl = await import("react-leaflet");
    const L = await import("leaflet").then((m) => m.default);

    if (typeof L.Icon.Default !== "undefined") {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    }

    leafletModule = {
      MapContainer: rl.MapContainer,
      TileLayer: rl.TileLayer,
      Marker: rl.Marker,
      Popup: rl.Popup,
      useMap: rl.useMap,
      L,
    };
    return leafletModule;
  })();

  return leafletLoading;
}

interface ParkingMapProps {
  onLotSelect?: (lot: ParkingLot) => void;
  selectedLotId?: string | null;
  height?: string;
}

function makeMarkerIcon(
  available: number,
  total: number,
  selected: boolean,
  L: any,
) {
  const ratio = total > 0 ? available / total : 0;
  const color = ratio > 0.3 ? "#2ECC71" : ratio > 0 ? "#F39C12" : "#EF4444";
  const size = selected ? 48 : 36;
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:${selected ? 14 : 11}px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:${selected ? "3px solid white" : "2px solid white"};">${available > 0 ? available : "F"}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function Updater({ region, lm }: { region: MapRegion; lm: LeafletMod }) {
  const map = lm.useMap();
  useEffect(() => {
    if (map) map.setView([region.latitude, region.longitude], 16);
  }, [region, map]);
  return null;
}

export const ParkingMap: React.FC<ParkingMapProps> = ({
  onLotSelect,
  selectedLotId,
  height = "100%",
}) => {
  const { lots, region, userLocation, isLoading, selectLot, updateRegion } =
    useMapStore();
  const [lm, setLm] = useState<LeafletMod | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadLeaflet()
      .then(setLm)
      .catch(() => setErr("Failed to load map"));
  }, []);

  const handleClick = useCallback(
    (lot: ParkingLot) => {
      selectLot(lot);
      onLotSelect?.(lot);
    },
    [selectLot, onLotSelect],
  );

  const handleLocate = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          updateRegion({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }),
        () => {},
        { enableHighAccuracy: true, timeout: 5000 },
      );
    }
  }, [updateRegion]);

  if (err) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        style={{ height }}
      >
        <p className="text-sm text-gray-500">{err}</p>
      </div>
    );
  }

  if (!lm) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        style={{ height }}
      >
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const MC = lm.MapContainer;
  const TL = lm.TileLayer;
  const M = lm.Marker;
  const P = lm.Popup;

  return (
    <div className="relative w-full" style={{ height }}>
      <MC
        center={[region.latitude, region.longitude]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TL
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={config.map.tileUrl}
        />
        <Updater region={region} lm={lm} />

        {userLocation && (
          <M
            position={[userLocation.lat, userLocation.lng]}
            icon={lm.L.divIcon({
              className: "user-marker",
              html: '<div style="width:20px;height:20px;background:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          />
        )}

        {lots.map((lot) => (
          <M
            key={lot.id}
            position={[lot.location.lat, lot.location.lng]}
            icon={makeMarkerIcon(
              lot.availableSlots,
              lot.totalSlots,
              lot.id === selectedLotId,
              lm.L,
            )}
            eventHandlers={{ click: () => handleClick(lot) }}
          >
            <P>
              <div className="min-w-[180px]">
                <h3 className="font-semibold text-sm">{lot.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {lot.availableSlots}/{lot.totalSlots} available
                </p>
                <p className="text-xs font-medium text-blue-600 mt-1">
                  SAR {lot.pricePerHour.toFixed(2)}/hr
                </p>
                <button
                  onClick={() => handleClick(lot)}
                  className="mt-2 w-full text-xs bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </P>
          </M>
        ))}
      </MC>

      <button
        onClick={handleLocate}
        className="absolute bottom-6 right-4 z-[1000] bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Navigation size={20} className="text-blue-600" />
      </button>

      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full" />
          Loading lots...
        </div>
      )}
    </div>
  );
};
