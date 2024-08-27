import { useState, useEffect, useRef } from "react";

import fastTravelIcon from "./img/fasttravel.png";
import csIcon from "./img/cs.png";
import mapImg from "./img/map.png";

import "./style.css";
import "./tooltip.css";

import Marker from "./components/Marker";

import { fastTravelMarkers } from "./data/fastTravel";
import { getNextCsInfo, csMarkers } from "./data/cs";

function App() {
  const filters = [
    { id: "FAST_TRAVEL", icon: fastTravelIcon, text: "Szybka podróż" },
    { id: "NEXT_CS", icon: csIcon, text: "Następne zawody" },
  ];

  const [activeFilters, setActiveFilters] = useState(() => {
    const savedFilters = localStorage.getItem("filters");
    return savedFilters ? JSON.parse(savedFilters) : ["FAST_TRAVEL"];
  });
  const [nextCsInfo, setNextCsInfo] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    setNextCsInfo(getNextCsInfo());

    const timer = setInterval(() => {
      setNextCsInfo(getNextCsInfo());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(activeFilters));
  }, [activeFilters]);

  function toggleFilter(filterName) {
    setActiveFilters((prevFilters) => {
      const index = prevFilters.indexOf(filterName);
      if (index > -1) {
        return prevFilters.filter((item) => item !== filterName);
      } else {
        return [...prevFilters, filterName];
      }
    });
  }
  return (
    <>
      <div id="sidebar">
        <h2>Filtry</h2>
        <h3>Ogólne</h3>
        {filters.map((filter) => (
          <div className="filter-item" key={filter.id}>
            <label>
              <input
                type="checkbox"
                checked={activeFilters.includes(filter.id)}
                onChange={() => {
                  toggleFilter(filter.id);
                }}
              />
              {filter.text} <img src={filter.icon} alt={filter.text} />
            </label>
          </div>
        ))}
        <div id="sidebar-bottom">
          <span>
            {mousePos != null ? `X: ${mousePos.x}, Y: ${mousePos.y}` : ""}
          </span>
        </div>
      </div>

      <div id="main-pane">
        <div
          id="map"
          ref={mapRef}
          onMouseMove={(e) => {
            const rect = mapRef.current.getBoundingClientRect();
            const x = Math.round(((e.clientX - rect.left) / rect.width) * 409);
            const y = Math.round(((e.clientY - rect.top) / rect.height) * 409);
            setMousePos({ x: x, y: y });
          }}
          onMouseLeave={() => {
            setMousePos(null);
          }}
        >
          <img
            src={mapImg}
            alt="Map"
            style={{ width: "100%", height: "100%" }}
          />

          {activeFilters.includes("FAST_TRAVEL") &&
            fastTravelMarkers.map((marker) => (
              <Marker
                key={marker.name}
                type="fasttravel"
                x={marker.x}
                y={marker.y}
                tooltip={marker.name}
              ></Marker>
            ))}

          {activeFilters.includes("NEXT_CS") && nextCsInfo != null && (
            <Marker
              type="cs"
              x={csMarkers[nextCsInfo.location].x}
              y={csMarkers[nextCsInfo.location].y}
              tooltip={
                csMarkers[nextCsInfo.location].name +
                ", " +
                nextCsInfo.timeLeftString
              }
            ></Marker>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
