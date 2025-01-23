import  { useState } from "react";
import PropTypes from "prop-types";
import "./LocationSelector.css";

const metadata = ["Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad"]; // Replace with your actual metadata

const LocationSelector = ({ sidebarOpen }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState("");

  const handleInputChange = (value) => {
    setInput(value);
    if (value) {
      setSuggestions(
        metadata.filter((item) =>
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
  };

  return (
    <div
      className={`location-selector ${sidebarOpen ? "sidebar-open" : ""}`}
      style={{ marginLeft: sidebarOpen ? "300px" : "0" }}
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
  sidebarOpen: PropTypes.bool.isRequired, // Sidebar state to adjust position
};

export default LocationSelector;
