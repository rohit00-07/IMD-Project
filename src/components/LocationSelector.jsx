import { useCallback, useMemo, useState } from "react";
import SuggestionItems from "./SuggestionItems";
import PropTypes from "prop-types";
import { AWSLocations } from "../data/location";
import "../styles/LocationSelector.css";

const empArr = [];

const LocationSelector = (props) => {
    const {map, sidebarOpen} = props;

	const [suggestions, setSuggestions] = useState(empArr);
	const [input, setInput] = useState("");

	const handleInputChange = useCallback((e) => {
        const value = e.target.value;
		setInput(value);
		if (value) {
			setSuggestions(
				Object.keys(AWSLocations).filter((item) =>
					item.toLowerCase().startsWith(value.toLowerCase())
				)
			);
		} else {
			setSuggestions(empArr);
		}
	}, []);

	const selectSuggestion = useCallback((e) => {
        const value = e.__item;
		setInput(value);
		setSuggestions(empArr);

		const location =AWSLocations[value];
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
	}, [map]);


    const _suggestions = useMemo(() => {
		if (suggestions && suggestions.length > 0) {
			return (
				<ul className="suggestions">
					{suggestions.map((item, index) => (
						<SuggestionItems
							key={"suggestion-" + index}
							onClick={selectSuggestion}
							item={item}
						/>
					))}
				</ul>
			);
		}
	}, [selectSuggestion, suggestions]);

	return (
		<div
			className={`location-selector ${sidebarOpen ? "sidebar-open" : ""}`}
			style={{ marginRight: sidebarOpen ? "300px" : "0" }}
		>
			<img
				className="icon"
				src="src/assets/location.svg"
				alt="Location Icon"
			/>
			<input
				type="text"
				placeholder="Search location..."
				value={input}
				onChange={handleInputChange}
			/>
			{_suggestions}
		</div>
	);
};

// Prop validation for LocationSelector
LocationSelector.propTypes = {
	map: PropTypes.object.isRequired, // Google Maps instance
	sidebarOpen: PropTypes.bool.isRequired, // Sidebar state to adjust position
};

export default LocationSelector;
