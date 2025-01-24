import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./MapContainer.css";
import LocationSelector from "./LocationSelector";

const MapContainer = ({ sidebarOpen }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      // Initialize the Google Map
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 18.5204, lng: 73.8567 }, // Default center (Pune)
        zoom: 10,
      });
      setMap(googleMap);
    }
  }, [map]);

  return (
    <>
      <div
        className="map-container"
        style={{ marginRight: sidebarOpen ? "300px" : "0" }}
      >
        <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      </div>
      {/* Pass the map instance to the LocationSelector */}
      {map && <LocationSelector map={map} sidebarOpen={sidebarOpen} />}
    </>
  );
};

// Prop validation
MapContainer.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired, // Sidebar state
};

export default MapContainer;
