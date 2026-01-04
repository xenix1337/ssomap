import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import "./LanguageSelector.css";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${language === "en" ? "active" : ""}`}
        onClick={() => setLanguage("en")}
        title="English"
      >
        🇺🇸
      </button>
      <button
        className={`lang-btn ${language === "pl" ? "active" : ""}`}
        onClick={() => setLanguage("pl")}
        title="Polski"
      >
        🇵🇱
      </button>
      <button
        className={`lang-btn ${language === "de" ? "active" : ""}`}
        onClick={() => setLanguage("de")}
        title="Deutsch"
      >
        🇩🇪
      </button>
    </div>
  );
};

export default LanguageSelector;
