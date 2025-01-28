import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LocationSelector from "./components/LocationSelector";
import MapContainer from "./components/MapContainer";
import "./App.css";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    radius: "4 Km",
    elevation: "300-400",
    topology: "Linear",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      <Header toggleSidebar={toggleSidebar} />
      {/*<LocationSelector />*/}
      <div className="main-content">
        <MapContainer sidebarOpen={sidebarOpen} />
        <Sidebar
          sidebarOpen={sidebarOpen}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
      </div>
    </div>
  );
};

export default App;
