import React from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../contexts/LanguageContext";

const ResultComment = ({ points, maxPoints }) => {
  const { t } = useLanguage();

  const getComment = () => {
    const pFactor = points / maxPoints;

    let commentKey = "sad";
    if (pFactor >= 1) commentKey = "perfect";
    else if (pFactor >= 0.9) commentKey = "almostPerfect";
    else if (pFactor >= 0.66) commentKey = "great";
    else if (pFactor >= 0.33) commentKey = "good";

    return (
      <div>
        <div>{t(`guessr.result.${commentKey}`)}</div>
      </div>
    );
  };

  return <div className="result-comment">{getComment()}</div>;
};

ResultComment.propTypes = {
  points: PropTypes.number.isRequired,
  maxPoints: PropTypes.number.isRequired,
};

export default ResultComment;
