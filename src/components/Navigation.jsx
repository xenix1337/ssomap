import React from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../contexts/LanguageContext";

const Navigation = () => {
  const { t } = useLanguage();
  return (
    <nav className="navigation">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
        end
      >
        <FontAwesomeIcon icon={faMap} style={{ marginRight: "8px" }} />
        {t("navigation.map")}
      </NavLink>
      <NavLink
        to="/guessr"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        <FontAwesomeIcon icon={faGamepad} style={{ marginRight: "8px" }} />
        {t("navigation.guessr")}
      </NavLink>
    </nav>
  );
};

export default Navigation;
