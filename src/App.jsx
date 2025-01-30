import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import MapContainer from "./components/MapContainer"
import "./App.css"

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState({
    radius: "20",
    elevation: "300-800",
    topology: "All",
  })
  const [appliedOptions, setAppliedOptions] = useState(selectedOptions)
  const [isFiltered, setIsFiltered] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleApply = () => {
    setAppliedOptions(selectedOptions)
    setIsFiltered(true)
  }

  return (
    <div className="app-container">
      <Header toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <MapContainer sidebarOpen={sidebarOpen} selectedOptions={appliedOptions} isFiltered={isFiltered} />
        <Sidebar
          sidebarOpen={sidebarOpen}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          onApply={handleApply}
        />
      </div>
    </div>
  )
}

export default App

