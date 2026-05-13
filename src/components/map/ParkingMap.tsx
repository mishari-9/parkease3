"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import { ParkingLot, MapRegion } from "@/types";
import { config } from "@/constants/config";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Leaflet components (SSR incompatible)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});
import { useMap } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface ParkingMapProps {
  onLotSelect?: (lot: ParkingLot) => void;
  selectedLotId?: string | null;
  height?: string;
}

// Custom marker icon based on availability
const createMarkerIcon = (
  availableSlots: number,
  totalSlots: number,
  isSelected: boolean,
) => {
  const ratio = availableSlots / totalSlots;
  let color: string;
  if (ratio > 0.3) color = "#2ECC71";
  else if (ratio > 0) color = "#F39C12";
  else color = "#EF4444";

  const size = isSelected ? 48 : 36;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${isSelected ? 14 : 11}px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: ${isSelected ? "3px solid white" : "2px solid white"};
        transition: all 0.3s ease;
      ">${availableSlots > 0 ? availableSlots : "F"}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const MapUpdater: React.FC<{ region: MapRegion }> = ({ region }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.setView(
        [region.latitude, region.longitude],
        Math.round(region.latitudeDelta * 100),
      );
    }
  }, [region, map]);
  return null;
};

export const ParkingMap: React.FC<ParkingMapProps> = ({
  onLotSelect,
  selectedLotId,
  height = "100%",
}) => {
  const { lots, region, userLocation, isLoading, selectLot, updateRegion } =
    useMapStore();
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleRegionChange = useCallback(
    (map: any) => {
      const center = map.getCenter();
      const bounds = map.getBounds();
      updateRegion({
        latitude: center.lat,
        longitude: center.lng,
        latitudeDelta: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
        longitudeDelta: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
      });
    },
    [updateRegion],
  );

  const handleLotClick = useCallback(
    (lot: ParkingLot) => {
      selectLot(lot);
      onLotSelect?.(lot);
    },
    [selectLot, onLotSelect],
  );

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newRegion: MapRegion = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          };
          updateRegion(newRegion);
        },
        (err) => console.warn("Geolocation error:", err),
        { enableHighAccuracy: true, timeout: 5000 },
      );
    }
  }, [updateRegion]);

  if (!mapReady) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        style={{ height }}
      >
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <MapContainer
        center={[region.latitude, region.longitude]}
        zoom={16}
        style={{ height: "100%", width: "100%", borderRadius: "0" }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={config.map.tileUrl}
        />
        <MapUpdater region={region} />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: "user-marker",
              html: '<div style="width:20px;height:20px;background:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          />
        )}

        {/* Parking Lot Markers */}
        {lots.map((lot) => (
          <Marker
            key={lot.id}
            position={[lot.location.lat, lot.location.lng]}
            icon={createMarkerIcon(
              lot.availableSlots,
              lot.totalSlots,
              lot.id === selectedLotId,
            )}
            eventHandlers={{
              click: () => handleLotClick(lot),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-sm">{lot.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {lot.availableSlots}/{lot.totalSlots} available
                </p>
                <p className="text-xs font-medium text-blue-600 mt-1">
                  {formatPrice(lot.pricePerHour)}/hr
                </p>
                <button
                  onClick={() => handleLotClick(lot)}
                  className="mt-2 w-full text-xs bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Locate Me Button */}
      <button
        onClick={handleLocateMe}
        className="absolute bottom-6 right-4 z-[1000] bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Navigation size={20} className="text-blue-600" />
      </button>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full" />
            Loading parking lots...
          </div>
        </div>
      )}
    </div>
  );
};

function formatPrice(price: number) {
  return `SAR ${price.toFixed(2)}`;
}
