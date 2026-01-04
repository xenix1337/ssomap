import { useState, useEffect } from "react";

import fastTravelIcon from "./img/fasttravel.png";
import csIcon from "./img/cs.png";
import guessrIcon from "./img/guess.png";

import "./style.css";
import "./tooltip.css";

import Map from "./components/Map";
import Navigation from "./components/Navigation";

import { fastTravelMarkers } from "./data/fastTravel";
import { getNextCsInfo, csMarkers } from "./data/cs";

function Home({ data }) {
  const filters = [
    { id: "FAST_TRAVEL", icon: fastTravelIcon, text: "Szybka podróż" },
    { id: "NEXT_CS", icon: csIcon, text: "Następne zawody" },
    { id: "GUESSR", icon: guessrIcon, text: "Lokacje SSO Guessr" },
  ];

  const [activeFilters, setActiveFilters] = useState(() => {
    const savedFilters = localStorage.getItem("filters");
    return savedFilters ? JSON.parse(savedFilters) : ["FAST_TRAVEL"];
  });
  const [nextCsInfo, setNextCsInfo] = useState(null);
  const [mousePos, setMousePos] = useState(null);

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
        <Navigation />
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
        <Map
          markers={[
            ...(activeFilters.includes("FAST_TRAVEL")
              ? fastTravelMarkers.map((m) => ({
                  ...m,
                  type: "fasttravel",
                  tooltip: m.name,
                }))
              : []),
            ...(activeFilters.includes("NEXT_CS") && nextCsInfo != null
              ? [
                  {
                    ...csMarkers[nextCsInfo.location],
                    type: "cs",
                    tooltip:
                      csMarkers[nextCsInfo.location].name +
                      ", " +
                      nextCsInfo.timeLeftString,
                  },
                ]
              : []),
            ...(activeFilters.includes("GUESSR")
              ? data.map((m) => ({
                  ...m,
                  type: "guessr",
                  tooltip: `X: ${m.x}, Y: ${m.y}`,
                  image: `${process.env.REACT_APP_BASE_STATIC_URL}/${m.url}`,
                }))
              : []),
          ].map((m) => ({
            ...m,
            x: (m.x / 409) * 1024,
            y: (m.y / 409) * 1024,
          }))}
          lines={[]}
          onMouseMove={({ x, y }) => {
            setMousePos({
              x: Math.round((x / 1024) * 409),
              y: Math.round((y / 1024) * 409),
            });
          }}
          onMapClick={() => {}}
        />
      </div>
    </>
  );
}

export default Home;
