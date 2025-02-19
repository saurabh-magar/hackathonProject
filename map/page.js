"use client"; // Ensure this is a client component

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapPage = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("--");
  const [distance, setDistance] = useState("--");
  let routeControl = null;

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
        trackLocation(newMap, L);
      });
    });
  }, []);

  const createCustomMarker = (color, L) => {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="width:14px;height:14px;background:${color};border-radius:50%;border:2px solid white;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
  };

  const trackLocation = (mapInstance, L) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLocation([lat, lng]);

        L.marker([lat, lng], { icon: createCustomMarker("green", L) })
          .addTo(mapInstance)
          .bindPopup("You are here")
          .openPopup();
      },
      (error) => {
        console.error("Error getting location:", error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  const getCoordinates = async (address) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    return data.length > 0 ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null;
  };

  const findRoute = async () => {
    if (!startLocation && !currentLocation) {
      alert("Please enter a start location or use current location.");
      return;
    }

    if (!endLocation) {
      alert("Please enter a destination.");
      return;
    }

    const destination = await getCoordinates(endLocation);
    if (!destination) {
      alert("Invalid destination.");
      return;
    }

    const source = startLocation ? await getCoordinates(startLocation) : currentLocation;
    if (!source) {
      alert("Invalid start location.");
      return;
    }

    plotRoute(source, destination);
  };

  const plotRoute = (start, end) => {
    import("leaflet").then((L) => {
      if (routeControl) map.removeControl(routeControl);

      routeControl = L.Routing.control({
        waypoints: [L.latLng(start), L.latLng(end)],
        routeWhileDragging: true,
        createMarker: () => null,
        lineOptions: { styles: [{ color: "#FF5733", weight: 4 }] }, // Orange route line
        show: false,
      }).addTo(map);

      routeControl.on("routesfound", (e) => {
        const distanceKm = e.routes[0].summary.totalDistance / 1000;
        setDistance(`${distanceKm.toFixed(2)} km`);
        setEstimatedTime(calculateTime(distanceKm));
      });

      // Remove alternative routes completely
      setTimeout(() => {
        document.querySelectorAll(".leaflet-routing-alternatives-container").forEach((el) => el.remove());
      }, 100);
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
          🛣️ Find Your Route
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Start Location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="w-full p-3 border rounded-lg text-black placeholder-gray-500 bg-gray-200"
          />
          <button
            onClick={() => setStartLocation(currentLocation ? currentLocation.join(", ") : "")}
            className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            📍 Use Current Location
          </button>
          <input
            type="text"
            placeholder="Enter Destination"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            className="w-full p-3 border rounded-lg text-black placeholder-gray-500 bg-gray-200"
          />
          <button
            onClick={findRoute}
            className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
          >
            🛣️ Find Route
          </button>
          <div className="text-center text-gray-700 font-semibold">Distance: {distance}</div>
          <div className="text-center text-gray-700 font-semibold">Estimated Time: {estimatedTime}</div>
        </div>
      </div>
      <div className="relative w-full max-w-4xl h-[500px] mt-6 rounded-lg shadow-lg overflow-hidden">
        <div id="map" className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MapPage), { ssr: false });
