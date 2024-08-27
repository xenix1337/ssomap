import React from "react";
import PropTypes from "prop-types";

const Marker = ({ type, x, y, tooltip }) => {
  return (
    <div
      className={`marker ${type}`}
      style={{ left: `${(x / 409) * 100}%`, top: `${(y / 409) * 100}%` }}
      data-tooltip={tooltip}
    ></div>
  );
};

Marker.propTypes = {
  type: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  tooltip: PropTypes.string.isRequired,
};

export default Marker;
