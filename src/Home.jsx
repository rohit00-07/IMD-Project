"use client"

import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import Sidebar from "./components/SideBar/Sidebar"
import Header from "./components/Header"
import MapContainer from "./components/MapContainer"
import "./Home.css"
import "react-toastify/dist/ReactToastify.css"

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState({
    radius: "20",
    elevation: "300-800",
    topology: "All",
    dropdownStation: "PASHAN AWS LAB",
  })

  const [selectedStations, setSelectedStations] = useState([]) // Stores manually selected stations
  const [appliedOptions, setAppliedOptions] = useState({ ...selectedOptions, selectedStations: [] })
  const [isFiltered, setIsFiltered] = useState(false)
  const navigate = useNavigate()

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const handleApply = useCallback(() => {
    setAppliedOptions({ ...selectedOptions, selectedStations }) // Apply the selected filters
    setIsFiltered(true)
  }, [selectedOptions, selectedStations])

  const handleNext = useCallback(() => {
    if (selectedStations.length === 0) {
      toast.warning("Select a station first!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }
    navigate("/Prediction", { state: { stations: selectedStations } })
  }, [navigate, selectedStations])

  const handleStationSelect = useCallback((station) => {
    setSelectedOptions((prev) => ({ ...prev, dropdownStation: station }))
  }, [])

  return (
    <div className="home-container">
      <Header toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <MapContainer
          sidebarOpen={sidebarOpen}
          selectedOptions={appliedOptions}
          setSelectedOptions={setSelectedOptions}
          isFiltered={isFiltered}
          selectedStations={selectedStations}
          setSelectedStations={setSelectedStations}
          onStationSelect={handleStationSelect}
        />
        <Sidebar
          sidebarOpen={sidebarOpen}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          onApply={handleApply}
          onNext={handleNext}
          setFilterMarker={handleStationSelect}
          selectedStations={selectedStations}
        />
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  )
}

export default Home
