import PropTypes from "prop-types";
import "./Sidebar.css";

const Sidebar = ({ sidebarOpen, selectedOptions, setSelectedOptions }) => (
  <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
    <div className="sidebar-content">
      <h3>Radius</h3>
      <select
        value={selectedOptions.radius}
        onChange={(e) =>
          setSelectedOptions({ ...selectedOptions, radius: e.target.value })
        }
      >
        <option>4 Km</option>
        <option>10 Km</option>
        <option>15 Km</option>
        <option>20 Km</option>
      </select>

      <h3>Elevation</h3>
      <select
        value={selectedOptions.elevation}
        onChange={(e) =>
          setSelectedOptions({ ...selectedOptions, elevation: e.target.value })
        }
      >
        <option>300-400</option>
        <option>400-500</option>
        <option>500-600</option>
        <option>700-800</option>
      </select>

      <h3>Topologies</h3>
      <select
        value={selectedOptions.topology}
        onChange={(e) =>
          setSelectedOptions({ ...selectedOptions, topology: e.target.value })
        }
      >
        <option>Linear</option>
        <option>Bus</option>
        <option>Ring</option>
        <option>Star</option>
        <option>Mesh</option>
        <option>Tree</option>
        <option>Hybrid</option>
      </select>

      <div className="selected-options">
        <p>
          <strong>Selected Options:</strong>
        </p>
        <p>Radius: {selectedOptions.radius}</p>
        <p>Elevation: {selectedOptions.elevation}</p>
        <p>Topology: {selectedOptions.topology}</p>
      </div>
    </div>
  </div>
);

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
};

export default Sidebar;
