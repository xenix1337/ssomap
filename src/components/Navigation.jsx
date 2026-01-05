import React from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../contexts/LanguageContext";

const Navigation = ({ onNavigate }) => {
  const { t } = useLanguage();

  const handleNavClick = (e) => {
    if (onNavigate && !onNavigate()) {
      e.preventDefault();
    }
  };

  return (
    <nav className="navigation">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
        end
        onClick={handleNavClick}
      >
        <FontAwesomeIcon icon={faGamepad} style={{ marginRight: "8px" }} />
        {t("navigation.guessr")}
      </NavLink>
      <NavLink
        to="/map"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
        onClick={handleNavClick}
      >
        <FontAwesomeIcon icon={faMap} style={{ marginRight: "8px" }} />
        {t("navigation.map")}
      </NavLink>
    </nav>
  );
};

export default Navigation;
