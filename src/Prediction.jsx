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

  const handlePredict = async () => {
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

    if (!stations || !targetStation) {
      toast.error("Stations or target station data is missing.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    console.log("Predict button clicked!");

    try {
      // Make API call to Flask backend
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedStations: stations,
          targetStation: targetStation,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        // Format the predictions for the next route
        const hourlyData = data.predictions.hours.map((hour, index) => ({
          time: `${String(hour).padStart(2, "0")}:00`, // Format hour as HH:00
          rainfall: data.predictions.rainfall[index],
          temperature: data.predictions.temperature[index],
          humidity: data.predictions.humidity[index], // Add humidity if needed
        }));

        // Determine current weather condition (simplified logic, adjust as needed)
        const avgRainfall = data.predictions.rainfall.reduce((a, b) => a + b, 0) / data.predictions.rainfall.length;
        const currentWeatherCondition = avgRainfall > 0.5 ? "rain" : "clear";

        // Navigate to weather prediction page with the data
        navigate("/weather-prediction", {
          state: {
            hourlyData,
            currentWeather: currentWeatherCondition,
            stations,
            targetStation,
            selectedModel,
          },
        });
      } else {
        toast.error(`Prediction failed: ${data.message}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
      toast.error("An error occurred while fetching predictions.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
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
        <PredictionMap selectedStations={stations || []} targetStation={targetStation || ""} />
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default Prediction;