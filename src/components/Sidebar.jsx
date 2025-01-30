import PropTypes from "prop-types"
import "./Sidebar.css"

const Sidebar = ({ sidebarOpen, selectedOptions, setSelectedOptions, onApply }) => (
  <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
    <div className="sidebar-content">
      <h3>Radius (Km)</h3>
      <select
        value={selectedOptions.radius}
        onChange={(e) => setSelectedOptions({ ...selectedOptions, radius: e.target.value })}
      >
        <option>5</option>
        <option>10</option>
        <option>15</option>
        <option>20</option>
        <option>50</option>
        <option>100</option>
      </select>

      <h3>Elevation</h3>
      <select
        value={selectedOptions.elevation}
        onChange={(e) => setSelectedOptions({ ...selectedOptions, elevation: e.target.value })}
      >
        <option>500-600</option>
        <option>600-700</option>
        <option>700-800</option>
        <option>0-800</option>
      </select>

      <h3>Topologies</h3>
      <select
        value={selectedOptions.topology}
        onChange={(e) => setSelectedOptions({ ...selectedOptions, topology: e.target.value })}
      >
        <option>Linear</option>
        <option>Triangular</option>
        <option>Ring</option>
        <option>Star</option>
        <option>Mesh</option>
        <option>Tree</option>
        <option>Hybrid</option>
      </select>

      <button className="apply-button" onClick={onApply}>
        Apply
      </button>

      <div className="selected-options">
        <p>
          <strong>Selected Options:</strong>
        </p>
        <p>Radius: {selectedOptions.radius} Km</p>
        <p>Elevation: {selectedOptions.elevation}</p>
        <p>Topology: {selectedOptions.topology}</p>
      </div>
    </div>
  </div>
)

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
}

export default Sidebar

