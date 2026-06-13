"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type L_type from "leaflet";

interface Props {
  initialLat?: number;
  initialLng?: number;
  onSelect: (lat: number, lng: number) => void;
}

export default function MapPickerInner({ initialLat, initialLng, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L_type.Map | null>(null);
  const markerRef = useRef<L_type.Marker | null>(null);
  const locationLayerRef = useRef<L_type.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof L_type;

    // Fix broken default marker icons in webpack
    // @ts-expect-error internal leaflet property
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const hasPin = initialLat != null && initialLng != null;
    const center: [number, number] = hasPin ? [initialLat!, initialLng!] : [13.7563, 100.5018];

    const map = L.map(containerRef.current).setView(center, hasPin ? 15 : 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    locationLayerRef.current = L.layerGroup().addTo(map);

    // Show user's real-time location as a blue dot
    map.locate({ watch: true, maxZoom: 15, enableHighAccuracy: true });

    map.on("locationfound", (e: L_type.LocationEvent) => {
      locationLayerRef.current!.clearLayers();

      // Accuracy ring
      L.circle(e.latlng, {
        radius: e.accuracy,
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.08,
        weight: 1,
      }).addTo(locationLayerRef.current!);

      // Blue dot
      L.circleMarker(e.latlng, {
        radius: 8,
        color: "#fff",
        fillColor: "#3b82f6",
        fillOpacity: 1,
        weight: 2,
      }).addTo(locationLayerRef.current!);

      // Fly to user location on first fix only if no pin set
      if (!hasPin && locationLayerRef.current!.getLayers().length <= 2) {
        map.flyTo(e.latlng, 15, { duration: 1.5 });
      }
    });

    // Place / drag equipment marker — stops geolocation watch on first interaction
    function addMarker(latlng: L_type.LatLng) {
      map.stopLocate();
      if (markerRef.current) {
        markerRef.current.setLatLng(latlng);
      } else {
        markerRef.current = L.marker(latlng, { draggable: true }).addTo(map);
        markerRef.current.on("dragend", () => {
          map.stopLocate();
          const pos = markerRef.current!.getLatLng();
          onSelect(pos.lat, pos.lng);
        });
      }
      onSelect(latlng.lat, latlng.lng);
    }

    if (hasPin) addMarker(L.latLng(initialLat!, initialLng!));

    map.on("click", (e: L_type.LeafletMouseEvent) => addMarker(e.latlng));

    mapRef.current = map;

    return () => {
      map.stopLocate();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      locationLayerRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-56 w-full rounded-xl border border-slate-200 dark:border-slate-600" />;
}
