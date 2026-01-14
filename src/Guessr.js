import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMedal,
  faExpand,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getRandomPhotos } from "./data/guessr";

import Map from "./components/Map";
import ResultComment from "./components/ResultComment";
import Navigation from "./components/Navigation";
import LanguageSelector from "./components/LanguageSelector";
import { useLanguage } from "./contexts/LanguageContext";

import "./style.css";
import "./tooltip.css";
import "./Guessr.css";
import { calculatePoints } from "./utils/guessr";
import { isMobileDevice } from "./utils/device";
import GuessButton from "./components/GuessButton";

function Guessr({ data }) {
  const { t } = useLanguage();
  const roundCount = 5;

  const [markers, setMarkers] = useState([]);

  const [guessMarker, setGuessMarker] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoId, setPhotoId] = useState(0);
  const [gameState, setGameState] = useState("loading");
  const [points, setPoints] = useState(0);
  const [photoFullscreened, setPhotoFullscreened] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setPhotos(getRandomPhotos(data, roundCount));
      setGameState("guessing");
      window.history.pushState({ gameStarted: true }, "");
    }
  }, [data]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (photoFullscreened) {
        setPhotoFullscreened(false);
        return;
      }

      if (
        (gameState === "guessing" || gameState === "reviewing") &&
        (markers.length > 0 || photoId > 0)
      ) {
        const confirmLeave = window.confirm(t("guessr.buttons.leaveConfirm"));
        if (!confirmLeave) {
          window.history.pushState({ gameStarted: true }, "");
          setGameState(gameState);
        } else {
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [photoFullscreened, gameState, t]);

  const confirmNavigation = () => {
    if (markers.length === 0 && photoId === 0) return true;
    if (gameState === "guessing" || gameState === "reviewing") {
      return window.confirm(t("guessr.buttons.leaveConfirm"));
    }
    return true;
  };

  const handleMapClick = ({ x, y }) => {
    if (gameState !== "guessing") return;
    if (x >= 0 && y >= 0 && x <= 1024 && y <= 1024)
      setGuessMarker({ x, y, type: "guessr" });
  };

  const getCurentPhoto = () => {
    if (photos.length === 0) return { url: "", x: 0, y: 0 };
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
      guessMarker,
    );
    setPoints((prevPoints) => prevPoints + pointsToAdd);
    if (pointsToAdd === 0) {
      toast(t("guessr.toasts.zeroPoints"));
    } else if (pointsToAdd < 5000) {
      toast(t("guessr.toasts.goodPoints", { points: pointsToAdd }));
    } else {
      toast(t("guessr.toasts.perfectPoints", { points: pointsToAdd }));
    }
  };

  const onGuessButtonClick = () => {
    if (gameState === "guessing") {
      addPoints();
      setGameState("reviewing");
      setMarkers(
        markers.concat([
          {
            x: (getCurentPhoto().x / 409) * 1024,
            y: (getCurentPhoto().y / 409) * 1024,
            type: "guessr",
          },
        ]),
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
      setPhotos(getRandomPhotos(data, roundCount));
      setGameState("guessing");
      setMarkers([]);
      setGuessMarker(null);
      setPhotoId(0);
      setPoints(0);
    }
  };

  return (
    <>
      <div id="sidebar">
        <Navigation onNavigate={confirmNavigation} />

        {gameState === "loading" && (
          <div className="loading">{t("guessr.loading")}</div>
        )}

        {gameState !== "finished" && gameState !== "loading" ? (
          <>
            <>
              <div className="photo-container">
                <img
                  className="guessr-photo"
                  alt={t("guessr.alt.locationPhoto")}
                  src={`${process.env.REACT_APP_BASE_STATIC_URL}/${getCurentPhoto().url}`}
                  onClick={() => {
                    setPhotoFullscreened(true);
                    window.history.pushState({ fullscreen: true }, "");
                  }}
                ></img>
                <div className="photo-hint">
                  <FontAwesomeIcon icon={faExpand} />{" "}
                  {isMobile
                    ? t("guessr.alt.tapToEnlarge")
                    : t("guessr.alt.clickToEnlarge")}
                </div>
              </div>
            </>
          </>
        ) : gameState === "finished" ? (
          <ResultComment
            points={points}
            maxPoints={5000 * roundCount}
          ></ResultComment>
        ) : null}

        <div className={"game-status " + gameState}>
          {gameState !== "finished" && gameState !== "loading" && (
            <div className="game-status-column">
              <div className="game-status-row">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <div className="game-status-row">{photoId + 1}</div>
            </div>
          )}
          <div className="game-status-column">
            <div className="game-status-row">
              <FontAwesomeIcon icon={faMedal} />
            </div>
            <div className="game-status-row">{points}</div>
          </div>
        </div>

        <GuessButton
          className="desktop-only"
          gameState={gameState}
          disabled={
            (guessMarker === null && gameState !== "finished") ||
            gameState === "loading"
          }
          onClick={onGuessButtonClick}
          t={t}
        />

        <LanguageSelector />

        <div id="sidebar-bottom">
          <span>
            {t("guessr.footer.author")}
            <sup>&copy;</sup> |{" "}
            <a href="https://github.com/xenix1337/ssomap">
              {t("guessr.footer.source")}
            </a>
          </span>
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

      <GuessButton
        className="mobile-only"
        gameState={gameState}
        disabled={
          (guessMarker === null && gameState !== "finished") ||
          gameState === "loading"
        }
        onClick={onGuessButtonClick}
        t={t}
      />

      {photoFullscreened && (
        <div
          id="fullscreen"
          onClick={() => {
            window.history.back();
          }}
        >
          <button
            className="fullscreen-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              window.history.back();
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <img
            src={`${process.env.REACT_APP_BASE_STATIC_URL}/${getCurentPhoto().url}`}
            alt={t("guessr.alt.fullscreenPreview")}
          ></img>
        </div>
      )}
    </>
  );
}

export default Guessr;
