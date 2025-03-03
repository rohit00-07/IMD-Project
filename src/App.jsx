import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Prediction from "./Prediction";
import WeatherPrediction from "./WeatherPrediction";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Prediction" element={<Prediction />} />
      <Route path="/weather-prediction" element={<WeatherPrediction />} />
    </Routes>
  );
};

export default App;

