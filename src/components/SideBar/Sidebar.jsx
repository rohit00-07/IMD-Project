"use client"

import PropTypes from "prop-types"
import RadiusFilter from "./utils/RadiusFilter"
import ElevationFilter from "./utils/ElevationFilter"
import TopologyFilter from "./utils/TopologyFilter"
import "../../styles/Sidebar.css"
import { useCallback, useEffect } from "react"
import { AWSLocations } from "../../data/location"

const Sidebar = ({
  sidebarOpen,
  selectedOptions = {},
  setSelectedOptions,
  onApply,
  onNext,
  setFilterMarker,
  selectedStations,
}) => {
  const { radius = "", elevation = "", topology = "", dropdownStation = "PASHAN AWS LAB" } = selectedOptions

  useEffect(() => {
    if (!selectedOptions.dropdownStation) {
      setSelectedOptions((prev) => ({
        ...prev,
        dropdownStation: "PASHAN AWS LAB",
      }))
    }
  }, [selectedOptions.dropdownStation, setSelectedOptions])

  useEffect(() => {
    if (dropdownStation) {
      setFilterMarker(dropdownStation)
    }
  }, [dropdownStation, setFilterMarker])

  const onChangeHandle = useCallback(
    (e) => {
      const { name, value } = e.target
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        [name]: value,
      }))
    },
    [setSelectedOptions],
  )

  const handleStationChange = (e) => {
    const selectedStation = e.target.value
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      dropdownStation: selectedStation,
    }))
  }

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <h3>Radius (Km)</h3>
        <RadiusFilter name="radius" value={radius} onChange={onChangeHandle} />

        <h3>Elevation</h3>
        <ElevationFilter name="elevation" value={elevation} onChange={onChangeHandle} />

        <h3>Topologies</h3>
        <TopologyFilter name="topology" value={topology} onChange={onChangeHandle} />

        <h3>Select a Station</h3>
        <select name="station" value={dropdownStation} onChange={handleStationChange}>
          {Object.keys(AWSLocations).map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>

        <button className="apply-button" onClick={onApply}>
          Apply
        </button>

        <div className="selected-options">
          <h3>Selected Stations:</h3>
          {selectedStations.length === 0 ? (
            <p>No stations selected</p>
          ) : (
            <ul>
              {selectedStations.map((station, index) => (
                <li key={index}>{station}</li>
              ))}
            </ul>
          )}
        </div>

        <button className="next-button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  )
}

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  selectedOptions: PropTypes.shape({
    radius: PropTypes.string,
    elevation: PropTypes.string,
    topology: PropTypes.string,
    dropdownStation: PropTypes.string,
  }).isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  setFilterMarker: PropTypes.func.isRequired,
  selectedStations: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default Sidebar

