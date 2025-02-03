import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import "../styles/MapContainer.css";
import { AWSLocations } from "../data/location";
import selectedIconImage from "../assets/selected.png";
import defaultIconImage from "../assets/Default.png";

const MapContainer = (props) => {
    const { sidebarOpen, selectedOptions, isFiltered } = props;
	const mapRef = useRef(null);
	const [map, setMap] = useState(null);
	const [markers, setMarkers] = useState([]);
	const [selectedMarker, setSelectedMarker] = useState([]);
	const [puneCoordinates, setPuneCoordinates] = useState([18.5204, 73.8567]); // constant, not expected to change

	useEffect(() => {
		if (!mapRef.current) return;

		const leafletMap = L.map(mapRef.current).setView(puneCoordinates, 10);
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
  
    let locationsToShow = Object.entries(AWSLocations);
  
    if (isFiltered) {
      locationsToShow = locationsToShow.filter(([locationName, data]) => {
        const distance = calculateDistance(data.lat, data.lng, puneCoordinates[0], puneCoordinates[1]);
        const radius = Number.parseInt(selectedOptions.radius);
        const [minElevation, maxElevation] = selectedOptions.elevation.split("-").map(Number);
  
        return distance <= radius && data.elevation >= minElevation && data.elevation <= maxElevation;
      });
    }
  
    const defaultIcon = new L.DivIcon({
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41" fill="blue">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 4.87 7 13 7 13s7-8.13 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
        </svg>
      `,
      className: "custom-icon",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    
    const selectedIcon = new L.DivIcon({
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41" fill="red">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 4.87 7 13 7 13s7-8.13 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
        </svg>
      `,
      className: "custom-icon",
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
    let locationsToShow = Object.entries(AWSLocations);
    locationsToShow = locationsToShow.filter(([locationName, data]) => {
      const distance = calculateDistance(data.lat, data.lng, puneCoordinates[0], puneCoordinates[1]);
      const radius = Number.parseInt(selectedOptions.radius);
      const [minElevation, maxElevation] = selectedOptions.elevation.split("-").map(Number);

			return (
				distance <= radius &&
				data.elevation >= minElevation &&
				data.elevation <= maxElevation
			);
		});
	}, [puneCoordinates]);
	return (
		<div
			className="map-container"
			style={{ marginRight: sidebarOpen ? "300px" : "0" }}
		>
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
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
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
