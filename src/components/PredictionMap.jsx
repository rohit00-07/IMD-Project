import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import "../styles/MapContainer.css";
import { AWSLocations } from "../data/location";

const PredictionMap = ({ selectedStations = [] }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Leaflet Map only once
    const leafletMap = L.map(mapRef.current).setView([18.5204, 73.8567], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(leafletMap);

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, []);

  // Function to create a standard marker icon
  const createIcon = (color) => {
    return L.divIcon({
      className: 'custom-icon',
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41" fill="${color}">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 4.87 7 13 7 13s7-8.13 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
        </svg>
      `,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  useEffect(() => {
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    // Add markers for all stations, blue by default, red if selected
    Object.entries(AWSLocations).forEach(([station, data]) => {
      if (!data.lat || !data.lng) return; // Prevent errors if lat/lng is missing

      const isSelected = selectedStations.includes(station);
      const color = isSelected ? "red" : "blue"; // Red for selected, Blue for default

      const marker = L.marker([data.lat, data.lng], {
        icon: createIcon(color), // Set the color for the marker
      }).addTo(map);

      marker.bindPopup(`<b>${station}</b>`);
      markersRef.current.push(marker);
    });
  }, [map, selectedStations]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>;
};

PredictionMap.propTypes = {
  selectedStations: PropTypes.arrayOf(PropTypes.string),
};

export default PredictionMap;
