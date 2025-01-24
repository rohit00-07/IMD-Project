import { useState } from "react";
import PropTypes from "prop-types";
import "./LocationSelector.css";

const metadata = {
"NIMGIRI JUNNAR": { lat: 19.20920, lng: 73.875 },
"BALLALWADI JUNNAR": { lat: 19.23960, lng: 73.91550},
"BLINDSCHOOL KP PUNE": { lat: 18.54000, lng:73.88860},
"CAGMO SHIVAJINAGAR": { lat: 18.53860, lng: 73.84200},
"CHINCHWAD PUNE": { lat: 18.65950, lng: 73.79870},
"CHRIST UNIVERSITY LAVASA": { lat: 18.41440, lng: 73.50690},
"CME DAPODI": { lat: 18.60320, lng: 73.85410},
"DPS HADAPSAR_PUNE": { lat: 18.46590, lng: 73.92440},
"GIRIVAN": { lat: 18.56070, lng: 73.52110},
"GUDHE BHOR": { lat: 18.07280, lng: 73.67060},
"INS SHIVAJI LONAVALA": { lat: 18.72400, lng: 73.36970},
"KHADAKWADI AMBEGAON": { lat: 18.90520, lng: 74.09380},
"KHUTBAV DAUND": { lat: 18.50560, lng: 74.33040},
"LAVALE": { lat: 18.53630, lng: 73.73250},
"LONIKALBHOR HAVELI": { lat: 18.46970, lng: 74.00130},
"MAGARPATTA PUNE": { lat: 18.51150, lng: 73.92850},
"MALIN AMBEGAON": { lat: 19.15740, lng: 73.68110},
"NARAYANGOAN KRISHI KENDRA": { lat: 19.10030, lng: 73.96550},
"NDA PUNE": { lat: 18.47000, lng: 73.78000},
"NES LAKADI INDAPUR": { lat: 18.17480, lng: 74.68900},
"NIASM BARAMATI": { lat: 18.15300, lng: 74.50030},
"PABAL SHIRUR": { lat: 18.83440, lng: 74.05360},
"PASHAN AWS LAB": { lat: 18.51670, lng: 73.85000},
"RAJGURUNAGAR": { lat: 18.84100, lng: 73.88400},
"SHIVAJINAGAR PUNE": { lat: 18.52860, lng: 73.84930},
"TALEGAON": { lat: 18.72200, lng: 73.66320},
"TALEGAON DHAMDHERE": { lat:18.67100 ,lng: 74.14800},
"VETALE KHED": { lat: 18.93900, lng: 73.77440},
"WADGAONSHERI PUNE": { lat: 18.54820, lng: 73.92780},
"WALHE PURANDAR": { lat: 18.17480, lng: 74.14980},

  // Add the rest of your metadata with lat, lng values
};

const LocationSelector = ({ map, sidebarOpen }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState("");

  const handleInputChange = (value) => {
    setInput(value);
    if (value) {
      setSuggestions(
        Object.keys(metadata).filter((item) =>
          item.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (value) => {
    setInput(value);
    setSuggestions([]);

    const location = metadata[value];
    if (location && map) {
      // Create a marker for the selected location
      new window.google.maps.Marker({
        position: location,
        map: map,
        title: value,
      });

      // Center the map on the selected location
      map.setCenter(location);
    }
  };

  return (
    <div
      className={`location-selector ${sidebarOpen ? "sidebar-open" : ""}`}
      style={{ marginRight: sidebarOpen ? "300px" : "0" }}
    >
      <img className="icon" src="src/assets/location.svg" alt="Location Icon" />
      <input
        type="text"
        placeholder="Search location..."
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => selectSuggestion(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Prop validation for LocationSelector
LocationSelector.propTypes = {
  map: PropTypes.object.isRequired, // Google Maps instance
  sidebarOpen: PropTypes.bool.isRequired, // Sidebar state to adjust position
};

export default LocationSelector;
