import PropTypes from "prop-types";
import "./MapContainer.css";

const MapContainer = ({ sidebarOpen }) => (
  <div
    className="map-container"
    style={{ marginRight: sidebarOpen ? "300px" : "0" }}
  >
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242118.43096966046!2d73.55110767162341!3d18.524360772003984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1737632888445!5m2!1sen!2sin"
      title="Map"
      loading="lazy"
    ></iframe>
  </div>
);

// Add PropTypes for validation
MapContainer.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
};

export default MapContainer;
