import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import PredictionMap from "./components/PredictionMap";
import "./Prediction.css";

const Prediction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stations, targetStation } = location.state || {};
  const [selectedModel, setSelectedModel] = useState("");

  console.log("Received Stations:", stations); // Debugging
  console.log("Received Selected Station:", targetStation);

  const handlePredict = () => {
    if (!selectedModel) {
      toast.warning("Please select a model before predicting the weather.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    console.log("Predict button clicked!");
  
    const sampleHourlyData = [
      { time: "00:00", rainfall: 0.1, temperature: 29 },
      { time: "00:10", rainfall: 0.6, temperature: 29.8 },
      { time: "00:20", rainfall: 0.4, temperature: 33.5 },
      { time: "00:30", rainfall: 0.2, temperature: 31.2 },
      { time: "00:40", rainfall: 0.9, temperature: 32.0 },
      { time: "00:50", rainfall: 0.7, temperature: 27.8 },
    ];
  
    const currentWeatherCondition = "rain";
  
    navigate("/weather-prediction", {
      state: {
        hourlyData: sampleHourlyData,
        currentWeather: currentWeatherCondition,
        stations,
        targetStation,
        selectedModel,
      },
    });
  };
  
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
            <option value="LSTM">LSTM</option>
            <option value="Bi LSTM">Bi LSTM</option>
            <option value="Stacked LSTM">Stacked LSTM</option>
            <option value="GRU">GRU</option>
          </select>
          <button className="predict-button" onClick={handlePredict}>
            Predict Weather
          </button>
        </div>
      </div>

      {/* Prediction Map */}
      <div className="content">
        <PredictionMap selectedStations={stations} targetStation={targetStation}/>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default Prediction;
