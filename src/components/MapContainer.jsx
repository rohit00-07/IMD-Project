import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import "../styles/MapContainer.css";
import { AWSLocations } from "../data/location";

const MapContainer = (props) => {
  const { sidebarOpen, selectedOptions, setSelectedOptions, isFiltered, selectedStations } = props;
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});

  useEffect(() => {
    if (!mapRef.current) return;

    const leafletMap = L.map(mapRef.current).setView([18.5204, 73.8567], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap);

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, []);

  const createIcon = (color) =>
    new L.DivIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41" fill="${color}">
               <path d="M12 2C8.13 2 5 5.13 5 9c0 4.87 7 13 7 13s7-8.13 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
             </svg>`,
      className: "custom-icon",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

  useEffect(() => {
    if (!map) return;

    // Remove existing markers
    Object.values(markers).forEach((marker) => map.removeLayer(marker));

    let locationsToShow = [];

    if (selectedStations) {
      // Case: Prediction.jsx - Show only selected stations
      locationsToShow = selectedStations.map((station) => [station, AWSLocations[station]]);
    } else if (isFiltered) {
      // Case: Home.jsx - Apply filters
      locationsToShow = Object.entries(AWSLocations).filter(([locationName, data]) => {
        const distance = calculateDistance(data.lat, data.lng, 18.5204, 73.8567);
        const radius = Number(selectedOptions.radius) || 10;
        const [minElevation, maxElevation] = selectedOptions.elevation?.split("-").map(Number) || [0, 10000];

        return distance <= radius && data.elevation >= minElevation && data.elevation <= maxElevation;
      });
    } else {
      // Case: Home.jsx - Show all locations
      locationsToShow = Object.entries(AWSLocations);
    }

    const newMarkers = {};

    locationsToShow.forEach(([locationName, data]) => {
      const isSelected = selectedOptions?.stations?.includes(locationName) || selectedStations?.includes(locationName);
      const marker = L.marker([data.lat, data.lng], {
        icon: createIcon(isSelected ? "red" : "blue"),
      }).addTo(map);

      marker.bindPopup(locationName);

      if (!selectedStations) {
        // Allow selection only in Home.jsx
        marker.on("click", () => {
          setSelectedOptions((prev) => {
            const alreadySelected = prev.stations.includes(locationName);
            const updatedStations = alreadySelected
              ? prev.stations.filter((s) => s !== locationName)
              : [...prev.stations, locationName];

            // Toggle marker color on selection/deselection
            marker.setIcon(createIcon(alreadySelected ? "blue" : "red"));

            return { ...prev, stations: updatedStations };
          });
        });
      }

      newMarkers[locationName] = marker;
    });

    setMarkers(newMarkers);
  }, [map, selectedOptions, isFiltered, selectedStations]);

  return (
    <div className="map-container" style={{ marginRight: sidebarOpen ? "300px" : "0" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

MapContainer.propTypes = {
  sidebarOpen: PropTypes.bool,
  selectedOptions: PropTypes.shape({
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    elevation: PropTypes.string,
    topology: PropTypes.string,
    stations: PropTypes.arrayOf(PropTypes.string),
  }),
  setSelectedOptions: PropTypes.func,
  isFiltered: PropTypes.bool,
  selectedStations: PropTypes.arrayOf(PropTypes.string),
};

export default MapContainer;
