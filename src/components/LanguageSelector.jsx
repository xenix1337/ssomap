import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import "./LanguageSelector.css";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <select
        className="lang-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">🇺🇸 English</option>
        <option value="pl">🇵🇱 Polski</option>
        <option value="de">🇩🇪 Deutsch</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
