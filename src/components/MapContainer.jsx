import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import "./MapContainer.css";
import selectedIconImage from '../assets/selected.png';
import defaultIconImage from '../assets/Default.png';  

const metadata = {
  "NIMGIRI JUNNAR": { lat: 19.20920, lng: 73.875, elevation: 619.00},
"BALLALWADI JUNNAR": { lat: 19.23960, lng: 73.91550, elevation: 719.80},
"BLINDSCHOOL KP PUNE": { lat: 18.54000, lng:73.88860, elevation: 546.20},
"CAGMO SHIVAJINAGAR": { lat: 18.53860, lng: 73.84200, elevation: 559.00},
"CHINCHWAD PUNE": { lat: 18.65950, lng: 73.79870, elevation: 559.00},
"CHRIST UNIVERSITY LAVASA": { lat: 18.41440, lng: 73.50690, elevation: 687.30},
"CME DAPODI": { lat: 18.60320, lng: 73.85410, elevation: 563.17},
"DPS HADAPSAR_PUNE": { lat: 18.46590, lng: 73.92440, elevation: 618.70},
"GIRIVAN": { lat: 18.56070, lng: 73.52110, elevation: 750.00},
"GUDHE BHOR": { lat: 18.07280, lng: 73.67060, elevation: 773.00},
"INS SHIVAJI LONAVALA": { lat: 18.72400, lng: 73.36970, elevation: 620.80},
"KHADAKWADI AMBEGAON": { lat: 18.90520, lng: 74.09380, elevation: 585.00},
"KHUTBAV DAUND": { lat: 18.50560, lng: 74.33040, elevation: 554.00},
"LAVALE": { lat: 18.53630, lng: 73.73250, elevation: 0.00},
"LONIKALBHOR HAVELI": { lat: 18.46970, lng: 74.00130, elevation: 563.00},
"MAGARPATTA PUNE": { lat: 18.51150, lng: 73.92850, elevation: 0.00},
"MALIN AMBEGAON": { lat: 19.15740, lng: 73.68110, elevation: 778.70},
"NARAYANGOAN KRISHI KENDRA": { lat: 19.10030, lng: 73.96550, elevation: 694.50},
"NDA PUNE": { lat: 18.47000, lng: 73.78000, elevation: 0.00},
"NES LAKADI INDAPUR": { lat: 18.17480, lng: 74.68900, elevation: 386.20},
"NIASM BARAMATI": { lat: 18.15300, lng: 74.50030, elevation: 569.70},
"PABAL SHIRUR": { lat: 18.83440, lng: 74.05360, elevation: 667.30},
"PASHAN AWS LAB": { lat: 18.51670, lng: 73.85000, elevation: 577.00},
"RAJGURUNAGAR": { lat: 18.84100, lng: 73.88400, elevation: 598.13},
"SHIVAJINAGAR PUNE": { lat: 18.52860, lng: 73.84930, elevation: 0.00},
"TALEGAON": { lat: 18.72200, lng: 73.66320, elevation: 635.79},
"TALEGAON DHAMDHERE": { lat:18.67100 ,lng: 74.14800, elevation: 562.40},
"VETALE KHED": { lat: 18.93900, lng: 73.77440, elevation: 742.70},
"WADGAONSHERI PUNE": { lat: 18.54820, lng: 73.92780, elevation: 0.00},
"WALHE PURANDAR": { lat: 18.17480, lng: 74.14980, elevation: 585.00},
};


const MapContainer = ({ sidebarOpen, selectedOptions, isFiltered }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker]= useState([]);
  const [puneCoordinates, setPuneCoordinates] = useState([18.5204, 73.8567]); // constant, not expected to change
             
  useEffect(() => {
    if (!mapRef.current) return;

    const leafletMap = L.map(mapRef.current).setView(puneCoordinates, 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap);

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, []); // This will run once on mount, no need to include 'markers' or 'puneCoordinates'

  useEffect(() => {
    if (!map) return;
  
    // Clear existing markers
    markers.forEach((marker) => map.removeLayer(marker));
  
    let locationsToShow = Object.entries(metadata);
  
    if (isFiltered) {
      locationsToShow = locationsToShow.filter(([locationName, data]) => {
        const distance = calculateDistance(data.lat, data.lng, puneCoordinates[0], puneCoordinates[1]);
        const radius = Number.parseInt(selectedOptions.radius);
        const [minElevation, maxElevation] = selectedOptions.elevation.split("-").map(Number);
  
        return distance <= radius && data.elevation >= minElevation && data.elevation <= maxElevation;
      });
    }
  
    const defaultIcon = new L.Icon({
      iconUrl: defaultIconImage,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  
    const selectedIcon = new L.Icon({
      iconUrl: selectedIconImage,  // Use the imported image
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  
    let lastSelectedMarker = null; // Track previously selected marker
  
    const newMarkers = locationsToShow.map(([locationName, data]) => {
      const marker = L.marker([data.lat, data.lng], { icon: defaultIcon }).addTo(map);
      marker.bindPopup(locationName);
  
      marker.on("click", () => {
        setPuneCoordinates([data.lat, data.lng]);
  
        // Reset the previously selected marker before setting the new one
        if (lastSelectedMarker) {
          lastSelectedMarker.setIcon(defaultIcon);
        }
  
        // Set the new selected marker
        marker.setIcon(selectedIcon);
        marker.openPopup();
        lastSelectedMarker = marker; // Update the reference to the newly selected marker
      });
  
      return marker;
    });
  
    setMarkers(newMarkers);
  
    // Adjust map view to fit all markers
    if (newMarkers.length > 0) {
      const group = L.featureGroup(newMarkers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [map, selectedOptions, isFiltered]);
  
  
  useEffect(()=>{
    let locationsToShow = Object.entries(metadata);
    locationsToShow = locationsToShow.filter(([locationName, data]) => {
      const distance = calculateDistance(data.lat, data.lng, puneCoordinates[0], puneCoordinates[1]);
      const radius = Number.parseInt(selectedOptions.radius);
      const [minElevation, maxElevation] = selectedOptions.elevation.split("-").map(Number);

      return distance <= radius && data.elevation >= minElevation && data.elevation <= maxElevation;
    });
  },[puneCoordinates])
  return (
    <div className="map-container" style={{ marginRight: sidebarOpen ? "300px" : "0" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

MapContainer.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  isFiltered: PropTypes.bool.isRequired,
};

export default MapContainer;