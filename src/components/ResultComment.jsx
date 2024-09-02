import React from "react";
import PropTypes from "prop-types";

const ResultComment = ({ points, maxPoints }) => {
  const comments = {
    0: [
      "Nie poszło Ci najlepiej. Spróbuj jeszcze raz!",
      "Rozejrzyj się po Jorviku i wróć oświecona...",
      "Nie gubisz się we własnym domu z taką pamięcią?",
      "Ojej, to nie jest najlepszy wynik. Może następnym razem pójdzie lepiej?",
      "Nie zrażaj się! Każda próba przybliża Cię do celu.",
      "Wygląda na to, że potrzebujesz jeszcze trochę treningu.",
      "Nie martw się, nawet najlepsi zaczynali od zera!",
    ],
    0.33: [
      "Nieźle, ale możesz zrobić to lepiej!",
      "Blisko, ale jeszcze trochę pracy przed Tobą.",
      "Kilka kroków do przodu i będziesz mistrzynią!",
      "Zaczynasz się rozkręcać. Kontynuuj w tym kierunku!",
    ],
    0.66: [
      "Świetna robota! Już prawie jesteś ekspertką.",
      "Bardzo blisko! Kilka drobnych poprawek i będziesz w czołówce.",
      "Czujesz się pewnie? Jeszcze chwila i będziesz najlepsza!",
      "Bardzo dobrze! Pozostało tylko kilka szczegółów do dopracowania.",
    ],
    0.9: [
      "Fantastycznie! Jesteś niemal mistrzynią w rozpoznawaniu lokacji.",
      "Praktycznie idealnie! Jeszcze tylko kilka detali do poprawy.",
      "Imponujące! Tylko drobne poprawki dzielą Cię od perfekcji.",
      "Świetnie! Jesteś na bardzo wysokim poziomie.",
      "Niewiele zabrakło do perfekcyjnego wyniku!",
    ],
    1: [
      "Gratulacje! Jesteś prawdziwą mistrzynią lokalizacji!",
      "Perfekcja! Twoja znajomość Jorviku jest imponująca.",
      "Wyjątkowa pamięć! Masz świetne oko do szczegółów.",
      "Brawo! Rozpoznałaś każdą lokację bezbłędnie!",
    ],
  };

  const getComment = () => {
    const pFactor = points / maxPoints;
    let maxCommentScoreFound = 0;
    for (let p in comments) {
      if (p <= pFactor && p > maxCommentScoreFound) maxCommentScoreFound = p;
    }
    const commentsList = comments[maxCommentScoreFound];
    return commentsList[Math.floor(Math.random() * commentsList.length)];
  };

  return <div className="result-comment">{getComment()}</div>;
};

ResultComment.propTypes = {
  points: PropTypes.number.isRequired,
  maxPoints: PropTypes.number.isRequired,
};

export default ResultComment;
