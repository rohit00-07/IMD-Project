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

  useEffect(() => {
    if (!mapRef.current) return

    const leafletMap = L.map(mapRef.current).setView([18.5204, 73.8567], 10)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

    // Remove all existing markers
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
      const targetData = AWSLocations[targetStation];
      const targetMarker = L.marker([targetData.lat, targetData.lng], {
        icon: createIcon("red"),
      }).addTo(map);

      targetMarker.bindTooltip(`Target: ${targetStation}`, {
        permanent: false,
        direction: "top",
        opacity: 0.9,
        offset: [0, -40],
      });

      targetMarker.bindPopup(targetStation);

      newMarkers[targetStation] = targetMarker;
    }

    setMarkers(newMarkers)
  }, [map, selectedStations, targetStation]);

  return <div className="map-cont" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
}

PredictionMapContainer.propTypes = {
  selectedStations: PropTypes.arrayOf(PropTypes.string).isRequired,
  targetStation: PropTypes.string.isRequired
}


export default PredictionMapContainer
