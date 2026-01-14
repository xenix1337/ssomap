import React from "react";
import "../Guessr.css";

const GuessButton = ({ gameState, disabled, onClick, t, className = "" }) => {
  const getButtonText = () => {
    switch (gameState) {
      case "loading":
        return t("guessr.loading");
      case "guessing":
        return t("guessr.buttons.guess");
      case "reviewing":
        return t("guessr.buttons.next");
      case "finished":
        return t("guessr.buttons.again");
      default:
        return "";
    }
  };

  return (
    <button
      className={`guess-button ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {getButtonText()}
    </button>
  );
};

export default GuessButton;
