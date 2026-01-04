import React, { createContext, useContext, useState, useEffect } from "react";
import { pl } from "../locales/pl";
import { en } from "../locales/en";
import { de } from "../locales/de";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app-language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  const dictionary = language === "pl" ? pl : language === "de" ? de : en;

  const t = (path, replacements = {}) => {
    const keys = path.split(".");
    let value = dictionary;
    for (const key of keys) {
      if (value[key] === undefined) {
        console.warn(`Translation missing for key: ${path}`);
        return path;
      }
      value = value[key];
    }

    if (Array.isArray(value)) {
      value = value[Math.floor(Math.random() * value.length)];
    }

    if (typeof value === "string") {
      let text = value;
      for (const [key, val] of Object.entries(replacements)) {
        text = text.replace(`{${key}}`, val);
      }
      return text;
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
