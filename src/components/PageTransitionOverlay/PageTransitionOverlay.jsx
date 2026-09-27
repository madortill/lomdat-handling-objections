import React from "react";
import "./PageTransitionOverlay.css";

function PageTransitionOverlay({ mode = "cover", onDone }) {
  const handleAnimationEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    onDone?.();
  };

  return (
    <div
      className={`page-transition-overlay page-transition-overlay--${mode}`}
      aria-hidden="true"
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="page-transition-overlay__message">
        <div className="page-transition-overlay__check">✓</div>
        <div className="page-transition-overlay__title">הנושא הושלם!</div>
        <div className="page-transition-overlay__subtitle">חוזרים לכיתה</div>
      </div>
    </div>
  );
}

export default PageTransitionOverlay;