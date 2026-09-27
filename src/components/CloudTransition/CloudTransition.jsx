import React from "react";
import "./CloudTransition.css";

function CloudTransition({ mode = "cover", onDone }) {
  const handleAnimationEnd = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (onDone) {
      onDone();
    }
  };

  return (
    <div
      className={`cloud-transition cloud-transition--${mode}`}
      aria-hidden="true"
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="cloud-transition__cloud cloud-transition__cloud--1" />
      <div className="cloud-transition__cloud cloud-transition__cloud--2" />
      <div className="cloud-transition__cloud cloud-transition__cloud--3" />
      <div className="cloud-transition__cloud cloud-transition__cloud--4" />
      <div className="cloud-transition__cloud cloud-transition__cloud--5" />
    </div>
  );
}

export default CloudTransition;
