import { useState } from "react";

import { getRandomPhotos } from "./data/guessr";

import Map from "./components/Map";

import "./style.css";
import "./tooltip.css";
import "./Guessr.css";
import { calculatePoints } from "./utils/guessr";

function Guessr() {
  const roundCount = 3;

  const [markers, setMarkers] = useState([]);

  const [guessMarker, setGuessMarker] = useState(null);
  const [photos, setPhotos] = useState(getRandomPhotos(roundCount));
  const [photoId, setPhotoId] = useState(0);
  const [gameState, setGameState] = useState("guessing");
  const [points, setPoints] = useState(0);

  const handleMapClick = ({ x, y }) => {
    if (gameState !== "guessing") return;
    if (x >= 0 && y >= 0 && x <= 1024 && y <= 1024) setGuessMarker({ x, y });
  };

  const getCurentPhoto = () => {
    console.log(photos[photoId]);
    return photos[photoId];
  };

  const addPoints = () => {
    const acceptableDistance = 10;
    const maxDistance = 150;

    const pointsToAdd = calculatePoints(
      acceptableDistance,
      maxDistance,
      5000,
      {
        x: (getCurentPhoto().x / 409) * 1024,
        y: (getCurentPhoto().y / 409) * 1024,
      },
      guessMarker
    );
    console.log("add " + pointsToAdd + " points");
    setPoints((prevPoints) => prevPoints + pointsToAdd);
  };

  return (
    <>
      <div id="sidebar">
        <h2>SSO Guessr</h2>

        {gameState !== "finished" ? (
          <img
            className="guessr-photo"
            alt="Zdjęcie lokacji, zgadnij gdzie zostało zrobione"
            src={`/guessr-img/${getCurentPhoto().url}`}
          ></img>
        ) : (
          <div>
            Gratulacje! Twój wynik to {points}/{5000 * roundCount}
          </div>
        )}

        <div>
          {points}/{5000 * roundCount}
        </div>

        <button
          class="guess-button"
          disabled={guessMarker === null && gameState !== "finished"}
          onClick={() => {
            if (gameState === "guessing") {
              addPoints();
              setGameState("reviewing");
              setMarkers(
                markers.concat([
                  {
                    x: (getCurentPhoto().x / 409) * 1024,
                    y: (getCurentPhoto().y / 409) * 1024,
                  },
                ])
              );
            } else if (gameState === "reviewing") {
              setGameState("guessing");
              setMarkers([]);
              setGuessMarker(null);
              if (photoId + 1 < roundCount) {
                setPhotoId((prevPhotoId) => prevPhotoId + 1);
              } else {
                setGameState("finished");
              }
            } else if (gameState === "finished") {
              setPhotos(getRandomPhotos(roundCount));
              setGameState("guessing");
              setMarkers([]);
              setGuessMarker(null);
              setPhotoId(0);
              setPoints(0);
            }
          }}
        >
          {
            {
              guessing: "Zgadnij",
              reviewing: "Dalej",
              finished: "Jeszcze raz",
            }[gameState]
          }
        </button>

        <div id="sidebar-bottom">
          <span>Hello!</span>
        </div>
      </div>

      <div id="main-pane">
        <Map
          markers={[guessMarker, ...markers].filter((e) => e !== null)}
          lines={
            gameState === "reviewing"
              ? [
                  {
                    fromX: guessMarker.x,
                    fromY: guessMarker.y,
                    toX: (getCurentPhoto().x / 409) * 1024,
                    toY: (getCurentPhoto().y / 409) * 1024,
                  },
                ]
              : []
          }
          onMapClick={handleMapClick}
        />
      </div>
    </>
  );
}

export default Guessr;
