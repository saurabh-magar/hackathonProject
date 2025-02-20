"use client"; 

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapPage = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState("--");
  const [estimatedTime, setEstimatedTime] = useState("--");
  let routeControl = null;

  const searchParams = useSearchParams();
  const startLat = searchParams.get("startLat");
  const startLng = searchParams.get("startLng");
  const destLat = searchParams.get("destLat");
  const destLng = searchParams.get("destLng");

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("leaflet").then((L) => {
      import("leaflet-routing-machine").then(() => {
        if (mapRef.current) return;

        const newMap = L.map("map").setView([20.5937, 78.9629], 5);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(newMap);

        setMap(newMap);
        mapRef.current = newMap;

        if (startLat && startLng && destLat && destLng) {
          plotRoute([parseFloat(startLat), parseFloat(startLng)], [parseFloat(destLat), parseFloat(destLng)], newMap, L);
        }
      });
    });
  }, [startLat, startLng, destLat, destLng]);

  const plotRoute = (start, end, mapInstance, L) => {
    if (routeControl) mapInstance.removeControl(routeControl);

    routeControl = L.Routing.control({
      waypoints: [L.latLng(start), L.latLng(end)],
      routeWhileDragging: true,
      createMarker: () => null,
      lineOptions: { styles: [{ color: "#FF5733", weight: 4 }] },
      show: false,
    }).addTo(mapInstance);

    routeControl.on("routesfound", (e) => {
      const distanceKm = e.routes[0].summary.totalDistance / 1000;
      setDistance(`${distanceKm.toFixed(2)} km`);
      setEstimatedTime(calculateTime(distanceKm));
    });
  };

  const calculateTime = (distance) => {
    const minTime = distance * 2.5;
    const maxTime = distance * 3.5;
    return `${Math.round(minTime)} - ${Math.round(maxTime)} mins`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-4">
      <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          🛣️ Your Route
        </h2>
        <div className="text-center text-gray-700 font-semibold">Distance: {distance}</div>
        <div className="text-center text-gray-700 font-semibold">Estimated Time: {estimatedTime}</div>
      </div>
      <div className="relative w-full max-w-4xl h-[500px] mt-6 rounded-lg shadow-lg overflow-hidden">
        <div id="map" className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MapPage), { ssr: false });
