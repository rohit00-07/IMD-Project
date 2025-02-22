"use client"

import PropTypes from "prop-types"
import RadiusFilter from "./utils/RadiusFilter"
import ElevationFilter from "./utils/ElevationFilter"
import TopologyFilter from "./utils/TopologyFilter"
import "../../styles/Sidebar.css"
import { useCallback, useEffect, useMemo } from "react";
import { AWSLocations } from "../../data/location";

const empObj = {},
    empStr = "";

const Sidebar = (props) => {
    const { sidebarOpen, selectedOptions = empObj, setSelectedOptions, onApply, onNext, setFilterMarker, selectedStations } = props;

    const { radius = empStr, elevation = empStr, topology = empStr, dropdownStation = "PASHAN AWS LAB" } = selectedOptions;

    useEffect(() => {
        if (!selectedOptions.dropdownStation) {
            setSelectedOptions((prev) => ({
                ...prev,
                dropdownStation: "PASHAN AWS LAB",
            }));
        }
    }, [selectedOptions.dropdownStation, setSelectedOptions]);

    useEffect(() => {
        if (dropdownStation) {
            setFilterMarker(dropdownStation);
        }
    }, [dropdownStation, setFilterMarker]);

    const onChangeHandle = useCallback(
        (e) => {
            const { name, value } = e.target;
            setSelectedOptions((prevSelectedOptions) => ({
                ...prevSelectedOptions,
                [name]: value,
            }));
        },
        [setSelectedOptions]
    );

    const handleStationChange = useCallback((e) => {
            const selectedStation = e.target.value;
            console.log("Selected Station from Dropdown:", selectedStation);
            setSelectedOptions((prevSelectedOptions) => ({
                ...prevSelectedOptions,
                dropdownStation: selectedStation,
            }));
    },[setSelectedOptions]);

    const _stationOptions = useMemo(() => {
        return Object.keys(AWSLocations).map((station) => (
            <option key={station} value={station}>
                {station}
            </option>
        ));
    }, []);

    const _selectedStation = useMemo(() => {
        if(selectedStations.length === 0){
            return (
                <p>No stations selected</p>
            )
        }
        return (
            <ul>
                {selectedStations.map((station, index) => (
                    <li key={index}>{station}</li>
                ))}
            </ul>
        )
    }, [selectedStations]);

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
                    {_stationOptions}
                </select>

                <button className="apply-button" onClick={onApply}>
                    Apply
                </button>

                <div className="selected-options">
                    <h3>Selected Stations:</h3>
                    {_selectedStation}
                </div>

                <button className="next-button" onClick={() => onNext(dropdownStation)}>
                    Next
                </button>
            </div>
        </div>
    );
};

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

