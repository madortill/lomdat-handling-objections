import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getLearningProgress } from "../../utils/learningProgress.js";
import "./EndPage.css";
import About from "../../components/About/About";

import background from "../../assets/background-opening.svg";
import bahad from "../../assets/bahad.png";
import bahad2 from "../../assets/bahad2.svg";
import til from "../../assets/til.svg";
import girl from "../../assets/girl-end.svg";
import boy from "../../assets/boy-end.svg";

const CONFETTI_COLORS = [
  "#E75454",
  "#59B4D9",
  "#E5BC3E",
  "#E89A49",
  "#78B96A",
  "#D591B6",
  "#A88AC7",
];

const CONFETTI_COUNT = 46;

function EndPage() {
  const navigate = useNavigate();
  const progress = useMemo(() => getLearningProgress(), []);

  const characterImage = progress.character === "boy" ? boy : girl;

  useEffect(() => {
    if (!progress.character) {
      navigate("/", { replace: true });
    }
  }, [progress.character, navigate]);

  const handleBackToLearning = () => {
    navigate("/learning");
  };

  const handleRestart = () => {
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  if (!progress.character) {
    return null;
  }

  return (
    <main className="end-page" dir="rtl">
      <div className="end-stage">
        <img
          src={background}
          alt=""
          className="end-background"
          draggable="false"
        />

        <About />

        <div className="end-confetti" aria-hidden="true">
          {Array.from({ length: CONFETTI_COUNT }, (_, index) => {
            const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];

            const left = (index * 23 + 7) % 100;
            const delay = ((index * 11) % 15) / 10;
            const duration = 3.2 + ((index * 7) % 18) / 10;
            const drift = -55 + ((index * 29) % 111);
            const rotation = 360 + ((index * 67) % 540);
            const width = 1.4 + ((index * 3) % 8) / 10;
            const height = 3 + ((index * 5) % 13) / 10;

            return (
              <span
                key={index}
                className={[
                  "end-confetti-piece",
                  index % 4 === 0 ? "is-round" : "",
                  index % 5 === 0 ? "is-wide" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  "--confetti-left": `${left}%`,
                  "--confetti-delay": `${delay}s`,
                  "--confetti-duration": `${duration}s`,
                  "--confetti-drift": `${drift}px`,
                  "--confetti-rotation": `${rotation}deg`,
                  "--confetti-width": `${width}cqw`,
                  "--confetti-height": `${height}cqw`,
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>

        <div className="end-logos" aria-hidden="true">
          <img src={bahad} alt="" className="end-bahad-logo" />
          <img src={bahad2} alt="" className="end-bahad2-logo" />
        </div>

        <img src={til} alt="" className="end-til-logo" aria-hidden="true" />

        <section className="end-card">
          <img
            src={characterImage}
            alt=""
            className="end-character"
            draggable="false"
          />

          <h1 className="end-title">כל הכבוד!</h1>

          <p className="end-subtitle">סיימתם את הלומדה :)</p>

          <div className="end-buttons">
            <button
              type="button"
              className="end-button end-button--back"
              onClick={handleBackToLearning}
            >
              &lt;
              <span aria-hidden="true"> חזרה לחומר</span>
            </button>

            <button
              type="button"
              className="end-button end-button--restart"
              onClick={handleRestart}
            >
              להתחלה מחדש
              <span aria-hidden="true"> &gt; </span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default EndPage;
