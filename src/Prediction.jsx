import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import PredictionMap from "./components/PredictionMap";
import "./Prediction.css";

const Prediction = () => {
  const location = useLocation();
  const { stations, targetStation } = location.state || {};
  const [selectedModel, setSelectedModel] = useState("");

  console.log("Received Stations:", stations); // Debugging
  console.log("Received Selected Station:", targetStation);
  
  return (
    <div className="prediction-container">
      <Header showSidebarToggle={false} />

      {/* Selection Container */}
      <div className="selection-container">
        <div className="selection-heading">SELECTED STATIONS</div>
        <div className="stations-grid">
          {stations?.map((station, index) => (
            <div key={index} className="station-item">
              {station}
            </div>
          ))}
        </div>

        <div className="target-heading">TARGET STATION</div>
        <div className="stations-grid">
          <div className="station-item">{targetStation}</div>
        </div>

        {/* Model Selection and Predict Button */}
        <div className="model-selection">
          <select
            className="model-dropdown"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">SELECT MODEL</option>
            <option value="model1">LSDM</option>
            <option value="model2">Bi-LSDM</option>
            <option value="model2">Stacked LSDM</option>
            <option value="model2">GRU</option>
          </select>

          <button className="predict-button" disabled={!selectedModel}>
            Predict Weather
          </button>
        </div>
      </div>

      {/* Prediction Map */}
      <div className="content">
        <PredictionMap selectedStations={stations} targetStation={targetStation}/>
      </div>
    </div>
  );
};

export default Prediction;
