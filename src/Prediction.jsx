import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import PredictionMap from "./components/PredictionMap";
import "./Prediction.css";

const Prediction = () => {
  const { state } = useLocation();
  const { stations } = state || {};

  return (
    <div className="prediction-container">
      <Header showSidebarToggle={false} />
      <div className="main-content">
        <PredictionMap selectedStations={stations} />
      </div>
    </div>
  );
};

export default Prediction;
