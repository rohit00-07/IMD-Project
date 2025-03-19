"use client"

import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import L from "leaflet"
import "../styles/PredictionMap.css"
import { AWSLocations } from "../data/location"

const PredictionMapContainer = ({ selectedStations, targetStation }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState({})
  const [predictions, setPredictions] = useState(null)

  useEffect(() => {
    if (!mapRef.current) return

    const leafletMap = L.map(mapRef.current).setView([18.5204, 73.8567], 10)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap)

    setMap(leafletMap)

    return () => leafletMap.remove()
  }, [])

  const createIcon = (color) =>
    new L.DivIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41" fill="${color}">
               <path d="M12 2C8.13 2 5 5.13 5 9c0 4.87 7 13 7 13s7-8.13 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
             </svg>`,
      className: "custom-icon",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    })

  useEffect(() => {
    if (!map) return

    Object.values(markers).forEach((marker) => map.removeLayer(marker))

    const newMarkers = {}

    selectedStations.forEach((stationName) => {
      const stationData = AWSLocations[stationName]
      if (!stationData) return

      const marker = L.marker([stationData.lat, stationData.lng], {
        icon: createIcon("green"),
      }).addTo(map)

      marker.bindTooltip(stationName, {
        permanent: false,
        direction: "top",
        opacity: 0.9,
        offset: [0, -40],
      })
      
      marker.bindPopup(stationName)
      newMarkers[stationName] = marker
    })

    if (targetStation && AWSLocations[targetStation]) {
      const targetData = AWSLocations[targetStation]
      const targetMarker = L.marker([targetData.lat, targetData.lng], {
        icon: createIcon("red"),
      }).addTo(map)

      targetMarker.bindTooltip(`Target: ${targetStation}`, {
        permanent: false,
        direction: "top",
        opacity: 0.9,
        offset: [0, -40],
      })

      targetMarker.bindPopup(targetStation)
      newMarkers[targetStation] = targetMarker
    }

    setMarkers(newMarkers)
  }, [map, selectedStations, targetStation])

  const handlePredict = async () => {
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedStations,
          targetStation,
        }),
      })

      const data = await response.json()
      if (data.status === "success") {
        setPredictions(data.predictions)
      } else {
        console.error("Prediction error:", data.message)
      }
    } catch (error) {
      console.error("Error fetching predictions:", error)
    }
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="map-cont" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      <button
        onClick={handlePredict}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Predict
      </button>
      {predictions && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 1000,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          <h3>24-Hour Weather Prediction</h3>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Hour</th>
                <th>Rainfall (mm)</th>
                <th>Temp (°C)</th>
                <th>Humidity (%)</th>
              </tr>
            </thead>
            <tbody>
              {predictions.hours.map((hour, index) => (
                <tr key={hour}>
                  <td>{hour}</td>
                  <td>{predictions.rainfall[index].toFixed(2)}</td>
                  <td>{predictions.temperature[index].toFixed(2)}</td>
                  <td>{predictions.humidity[index].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

PredictionMapContainer.propTypes = {
  selectedStations: PropTypes.arrayOf(PropTypes.string).isRequired,
  targetStation: PropTypes.string.isRequired,
}

export default PredictionMapContainer