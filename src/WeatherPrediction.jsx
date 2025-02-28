import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Header from "./components/Header";
import "./WeatherPrediction.css";

// Weather Icons
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake } from "lucide-react";

const WeatherPrediction = (props) => {
  const location = useLocation();
  const {
    hourlyData: initialHourlyData,
    currentWeather: initialCurrentWeather,
    stations,
    targetStation,
    selectedModel,
  } = location.state || props;

  const [hourlyData, setHourlyData] = useState(initialHourlyData || []);
  const [currentWeather, setCurrentWeather] = useState(initialCurrentWeather || "");

  useEffect(() => {
    if (!initialHourlyData) {
      const fetchData = async () => {
        try {
          const response = await fetch("/api/predictions");
          const data = await response.json();
          setHourlyData(data.hourlyData);
          setCurrentWeather(data.currentWeather);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [initialHourlyData]);

  const getWeatherIcon = (temperature, rainfall) => {
    if (rainfall > 10) return <CloudRain size={50} color="#007bff" />;
    if (temperature > 30) return <Sun size={50} color="#f9d71c" />;
    if (temperature < 0) return <Snowflake size={50} color="#00d4ff" />;
    if (rainfall > 0) return <Cloud size={50} color="#a0a0a0" />;
    return <Cloud size={50} color="#a0a0a0" />;
  };

  const getWeatherText = (temperature, rainfall) => {
    if (rainfall > 10) return "Heavy Rain";
    if (temperature > 30) return "Sunny";
    if (temperature < 0) return "Snow";
    if (rainfall > 0) return "Light Rain";
    return "Cloudy";
  };

  const getSeverityLevel = (temperature, rainfall) => {
    if (rainfall > 10 || temperature > 40) return "Poor Climate";
    if (rainfall > 5 || temperature > 30) return "Moderate Climate";
    return "Peaceful Climate";
  };

  const getSeverityPosition = (temperature, rainfall) => {
    if (rainfall > 10 || temperature > 40) return "90%"; // Red Zone
    if (rainfall > 5 || temperature > 30) return "50%"; // Yellow Zone
    return "10%"; // Green Zone
  };

  return (
    <div className="prediction-container">
      <Header showSidebarToggle={false} />

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
          <div className="station-item">{targetStation || "None selected"}</div>
        </div>
      </div>

      <div className="selection-container1">
        <div className="selection-heading">SELECTED MODEL</div>
        <div className="stations-grid">
          <div className="station-item">{selectedModel || "No model selected"}</div>
        </div>
      </div>

      <div className="selection-container1">
        <div className="selection-heading">Hourly Weather Forecast</div>

        <div className="current-weather">
          {hourlyData.length > 0 && getWeatherIcon(hourlyData[0].temperature, hourlyData[0].rainfall)}
          <div className="weather-text">
            {hourlyData.length > 0
              ? getWeatherText(hourlyData[0].temperature, hourlyData[0].rainfall).toUpperCase()
              : currentWeather?.toUpperCase()}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="rainfall" stroke="#007bff" name="Rainfall (mm)" />
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Climate Severity Bar */}
      <div className="selection-container1">
        <div className="selection-heading">Climate Severity</div>
        <div className="severity-bar">
          <div className="severity-line">
            <div
              className="severity-indicator"
              style={{ left: getSeverityPosition(hourlyData[0]?.temperature, hourlyData[0]?.rainfall) }}
            ></div>
          </div>
          <div className="severity-labels">
            <span>Peaceful</span>
            <span>Moderate</span>
            <span>Poor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPrediction;