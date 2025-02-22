"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import "../styles/MapContainer.css";
import { AWSLocations } from "../data/location";

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

const MapContainer = (props) => {
    const {
        sidebarOpen,
        selectedOptions, // Applied options now include dropdownStation only after clicking Apply
        isFiltered,
        selectedStations,
        setSelectedStations,
    } = props;

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

        return () => leafletMap.remove();
    }, []);

    const createIcon = useCallback((color) => {
        return new L.DivIcon({
            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41" fill="${color}">
                 <path d="M12 2C8.13 2 5 5.13 5 9c0 4.87 7 13 7 13s7-8.13 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
               </svg>`,
            className: "custom-icon",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });
    }, []);

    useEffect(() => {
        if (!map) return;

        // Remove all existing markers
        Object.values(markers).forEach((marker) => map.removeLayer(marker));

        let locationsToShow = Object.entries(AWSLocations);

        // Get coordinates of the selected station from dropdown
        const selectedStationData = AWSLocations[selectedOptions.dropdownStation];
        if (isFiltered && selectedStationData) {
            const { lat: centerLat, lng: centerLng } = selectedStationData; // Use dropdown station as center

            locationsToShow = locationsToShow.filter(([locationName, data]) => {
                if (locationName === selectedOptions.dropdownStation) {
                    return true;
                }
                const distance = calculateDistance(data.lat, data.lng, centerLat, centerLng);
                const radius = Number.parseInt(selectedOptions.radius, 10);
                const [minElevation, maxElevation] = selectedOptions.elevation.split("-").map(Number);

                return distance <= radius && data.elevation >= minElevation && data.elevation <= maxElevation;
            });
        }

        const newMarkers = {};

        locationsToShow.forEach(([locationName, data]) => {
            const isDropdownSelected = isFiltered && selectedOptions.dropdownStation === locationName;
            const isManuallySelected = selectedStations.includes(locationName);

            const marker = L.marker([data.lat, data.lng], {
                icon: createIcon(isDropdownSelected ? "red" : isManuallySelected ? "green" : "blue"),
            }).addTo(map);

            marker.bindTooltip(locationName, {
                permanent: false,
                direction: "top",
                opacity: 0.9,
                offset: [0, -40],
            });

            marker.bindPopup(locationName);

            marker.on("click", () => {
                if (isDropdownSelected) return;

                if (isManuallySelected) {
                    setSelectedStations((prev) => prev.filter((station) => station !== locationName));
                    marker.setIcon(createIcon("blue"));
                } else {
                    setSelectedStations((prev) => [...prev, locationName]);
                    marker.setIcon(createIcon("green"));
                }
            });

            newMarkers[locationName] = marker;
        });

        setMarkers(newMarkers);
    }, [map, isFiltered, selectedOptions, selectedStations, setSelectedStations]);

    return (
        <div className="map-container" style={{ marginRight: sidebarOpen ? "300px" : "0" }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
        </div>
    );
};

MapContainer.propTypes = {
    sidebarOpen: PropTypes.bool,
    selectedOptions: PropTypes.shape({
        radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        elevation: PropTypes.string,
        topology: PropTypes.string,
        dropdownStation: PropTypes.string,
    }),
    isFiltered: PropTypes.bool,
    selectedStations: PropTypes.arrayOf(PropTypes.string),
    setSelectedStations: PropTypes.func,
};

export default MapContainer;
