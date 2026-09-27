import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChairPage.css";
import PageTransitionOverlay from "../../components/PageTransitionOverlay/PageTransitionOverlay";

import chairBackground from "../../assets/chair-classroom-background.svg";
import backButton from "../../assets/projector-back-button.svg";
import bahad from "../../assets/bahad.png";
import bahad2 from "../../assets/bahad2.svg";
import til from "../../assets/til-black.svg";

import {
  getLearningProgress,
  updateTopicProgress,
  completeTopic,
} from "../../utils/learningProgress";

const CHAIR_CARDS = [
  {
    id: "gradual",
    title: "הדרגתיות",
    text: "להתקדם באופן הגיוני בתגובה ולאפשר מרחב פעולה.",
  },
  {
    id: "decisive",
    title: "החלטיות",
    text: "אין לנהוג באטימות, אך יש לפעול בהחלטיות בתגובותינו.",
  },
  {
    id: "sensitivity",
    title: "רגישות",
    text: "לעולם לא נעליב את חיילנו ונקפיד לנהוג ברגישות גם בתגובה משמעתית.",
  },
  {
    id: "adaptation",
    title: "התאמה",
    text: "אין לפעול על אוטומט. יש להתאים את תגובותינו למקרה, לחייל ולמידת ההשפעה על השיעור.",
  },
  {
    id: "consistency",
    title: "עקביות",
    text: "יש להגיב באותה הצורה כלפי התנגדויות זהות ולא ליצור אי-אחידות.",
  },
  {
    id: "variety",
    title: "גיוון",
    text: "חזרתיות על אותה התגובה היא אינה אפקטיבית ועלינו לגוון.",
  },
];

const LAST_CARD_INDEX = CHAIR_CARDS.length - 1;
const CARD_ANIMATION_DURATION = 460;
const EXIT_DURATION = 620;

function ChairPage() {
  const navigate = useNavigate();
  const pointerStartXRef = useRef(null);
  const exitTimeoutRef = useRef(null);

  const [initialLearningProgress] = useState(() => getLearningProgress());
  const initialChairProgress =
    initialLearningProgress.topicProgress?.chair ?? {};

  const character = initialLearningProgress.character;

  const chairAlreadyCompleted =
    initialLearningProgress.completedTopics.includes("chair");

  const [currentCard, setCurrentCard] = useState(() => {
    const savedCard = Number(initialChairProgress.currentCard);

    if (
      Number.isInteger(savedCard) &&
      savedCard >= 0 &&
      savedCard <= LAST_CARD_INDEX
    ) {
      return savedCard;
    }

    return 0;
  });

  const [visitedCards, setVisitedCards] = useState(() => {
    const savedVisited = Array.isArray(initialChairProgress.visitedCards)
      ? initialChairProgress.visitedCards.filter(
          (index) =>
            Number.isInteger(index) && index >= 0 && index <= LAST_CARD_INDEX
        )
      : [];

    return Array.from(new Set([...savedVisited, currentCard])).sort(
      (a, b) => a - b
    );
  });

  const [transitionData, setTransitionData] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  const [showNextReadyCue, setShowNextReadyCue] = useState(false);

  const isAnimating = transitionData !== null;

  useEffect(() => {
    if (!character) {
      navigate("/", { replace: true });
    }
  }, [character, navigate]);

  useEffect(() => {
    if (!character) return;

    updateTopicProgress("chair", {
      currentCard,
      visitedCards,
    });
  }, [character, currentCard, visitedCards]);

  useEffect(() => {
    if (!transitionData) return;

    const timeoutId = setTimeout(() => {
      setTransitionData(null);
    }, CARD_ANIMATION_DURATION);

    return () => clearTimeout(timeoutId);
  }, [transitionData]);

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  const goToCard = (nextIndex, direction) => {
    if (
      nextIndex < 0 ||
      nextIndex > LAST_CARD_INDEX ||
      nextIndex === currentCard ||
      isAnimating ||
      isExiting
    ) {
      return;
    }

    setTransitionData({
      fromIndex: currentCard,
      toIndex: nextIndex,
      direction,
    });

    setCurrentCard(nextIndex);

    setVisitedCards((currentVisited) => {
      if (currentVisited.includes(nextIndex)) {
        return currentVisited;
      }

      return [...currentVisited, nextIndex].sort((a, b) => a - b);
    });
  };

  const handleNext = () => {
    const nextIndex = currentCard === LAST_CARD_INDEX ? 0 : currentCard + 1;

    goToCard(nextIndex, "left");
  };

  const handlePrevious = () => {
    const previousIndex = currentCard === 0 ? LAST_CARD_INDEX : currentCard - 1;

    goToCard(previousIndex, "right");
  };

  const handleDotClick = (index) => {
    if (index === currentCard || isAnimating || isExiting) {
      return;
    }

    const direction = index > currentCard ? "left" : "right";
    goToCard(index, direction);
  };

  const handlePointerDown = (event) => {
    if (isAnimating || isExiting) {
      return;
    }

    pointerStartXRef.current = event.clientX;

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event) => {
    if (pointerStartXRef.current === null || isAnimating || isExiting) {
      pointerStartXRef.current = null;
      return;
    }

    const distance = event.clientX - pointerStartXRef.current;
    pointerStartXRef.current = null;

    if (Math.abs(distance) < 40) {
      return;
    }

    // Swipe ימינה -> הכרטיס הבא
    if (distance > 0) {
      handleNext();
      return;
    }

    // Swipe שמאלה -> הכרטיס הקודם
    handlePrevious();
  };

  const handlePointerCancel = () => {
    pointerStartXRef.current = null;
  };

  const handleBackToLearning = () => {
    if (isExiting) return;
    navigate("/learning");
  };

  const allCardsVisited =
    chairAlreadyCompleted || visitedCards.length === CHAIR_CARDS.length;

  const wasAllCardsVisitedRef = useRef(allCardsVisited);

  useEffect(() => {
    if (!wasAllCardsVisitedRef.current && allCardsVisited) {
      setShowNextReadyCue(true);
    }

    wasAllCardsVisitedRef.current = allCardsVisited;
  }, [allCardsVisited]);

  useEffect(() => {
    if (!showNextReadyCue) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setShowNextReadyCue(false);
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [showNextReadyCue]);

  const handleFinish = () => {
    if (!allCardsVisited || isExiting) {
      return;
    }

    completeTopic("chair");
    setIsExiting(true);

    exitTimeoutRef.current = setTimeout(() => {
      navigate("/learning", {
        state: {
          transition: "glow-wash",
          completedTopic: "chair",
        },
      });
    }, EXIT_DURATION);
  };

  const renderCard = (cardIndex, animationClass = "", keySuffix = "") => {
    const card = CHAIR_CARDS[cardIndex];

    if (!card) {
      return null;
    }

    return (
      <article
        key={`${card.id}-${keySuffix}`}
        className={["chair-principle-card", animationClass]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="chair-principle-number">{cardIndex + 1}</div>

        <h2 className="chair-principle-title">{card.title}</h2>

        <p className="chair-principle-text">{card.text}</p>
      </article>
    );
  };

  const renderCards = () => {
    if (!transitionData) {
      return renderCard(currentCard, "", "current");
    }

    const leavingClass =
      transitionData.direction === "left"
        ? "is-leaving-left"
        : "is-leaving-right";

    const enteringClass =
      transitionData.direction === "left"
        ? "is-entering-from-right"
        : "is-entering-from-left";

    return (
      <>
        {renderCard(transitionData.fromIndex, leavingClass, "leaving")}

        {renderCard(transitionData.toIndex, enteringClass, "entering")}
      </>
    );
  };

  if (!character) {
    return null;
  }

  return (
    <main className="chair-page" dir="rtl">
      {isExiting && <PageTransitionOverlay mode="cover" />}

      <div
        className={["chair-stage", isExiting ? "topic-stage-exit" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <img
          src={chairBackground}
          alt=""
          className="chair-background"
          draggable="false"
        />

        <div className="chair-safe-area">
          <div className="chair-logos" aria-hidden="true">
            <img src={bahad} alt="" className="chair-bahad-logo" />

            <img src={bahad2} alt="" className="chair-bahad2-logo" />
          </div>

          <button
            type="button"
            className="chair-back-button"
            onClick={handleBackToLearning}
            aria-label="חזרה למסך הלמידה"
          >
            <img src={backButton} alt="" draggable="false" />
          </button>

          <img src={til} alt="" className="chair-til-logo" aria-hidden="true" />
        </div>

        <div className="chair-heading">
          <p className="chair-heading-pretitle">במצבים של התנגדות נפעל לפי</p>

          <h1 className="chair-heading-title">העקרונות המנחים:</h1>

          <p className="chair-heading-note">- לחצו על החיצים כדי ללמוד -</p>
        </div>

        <div
          className="chair-card-viewport"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {renderCards()}
        </div>

        <button
          type="button"
          className="chair-arrow chair-arrow--left"
          onClick={handleNext}
          disabled={isAnimating || isExiting}
          aria-label="לעיקרון הבא"
        >
          ◀
        </button>

        <button
          type="button"
          className="chair-arrow chair-arrow--right"
          onClick={handlePrevious}
          disabled={isAnimating || isExiting}
          aria-label="לעיקרון הקודם"
        >
          ▶
        </button>

        <div className="chair-dots" aria-label="בחירת עיקרון">
          {CHAIR_CARDS.map((card, index) => {
            const isCurrent = index === currentCard;
            const isVisited = visitedCards.includes(index);

            return (
              <button
                key={card.id}
                type="button"
                className={[
                  "chair-dot",
                  isVisited ? "is-visited" : "",
                  isCurrent ? "is-current" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleDotClick(index)}
                disabled={isAnimating || isExiting}
                aria-label={`מעבר לעיקרון ${index + 1}`}
                aria-current={isCurrent ? "true" : undefined}
              />
            );
          })}
        </div>

        <button
          type="button"
          className={[
            "chair-finish-button",
            !allCardsVisited ? "is-disabled" : "",
            showNextReadyCue ? "is-ready" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={!allCardsVisited || isExiting}
          onClick={handleFinish}
        >
          הבא
        </button>
      </div>
    </main>
  );
}

export default ChairPage;
