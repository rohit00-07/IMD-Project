import PropTypes from "prop-types";
import RadiusFilter from "./utils/RadiusFilter";
import ElevationFilter from "./utils/ElevationFilter";
import TopologyFilter from "./utils/TopologyFilter";
import "../../styles/Sidebar.css";
import { useCallback } from "react";

const Sidebar = (props) => {
    const { sidebarOpen, selectedOptions, setSelectedOptions, onApply }  = props;
    
    const onChangeHandle = useCallback((e) => {
        setSelectedOptions((prevSelectedOptions) => {
            return {
                ...prevSelectedOptions,
                ...e._data
            }
        })
    }, [setSelectedOptions])
    
    
    return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
    <div className="sidebar-content">
      <h3>Radius (Km)</h3>
      <RadiusFilter value={selectedOptions.radius} onChange={onChangeHandle} />

      <h3>Elevation</h3>
      <ElevationFilter value={selectedOptions.elevation} onChange={onChangeHandle} />

      <h3>Topologies</h3>
      <TopologyFilter value={selectedOptions.topology} onChange={onChangeHandle} />

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
}

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
}

export default Sidebar

