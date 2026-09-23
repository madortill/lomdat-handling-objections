import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FloorPage.css";

import floorBackground from "../../assets/floor-classroom-background.svg";

import symptomIcon from "../../assets/floor-symptom-icon.svg";
import perspectiveIcon from "../../assets/floor-perspective-icon.svg";
import proportionIcon from "../../assets/floor-proportion-icon.svg";
import stabilityIcon from "../../assets/floor-stability-icon.svg";

import girlFloorCharacter from "../../assets/girl-projector-popup.svg";
import boyFloorCharacter from "../../assets/boy-projector-popup.svg";

import backButton from "../../assets/projector-back-button.svg";

import bahad from "../../assets/bahad.png";
import bahad2 from "../../assets/bahad2.svg";
import til from "../../assets/til.svg";

import {
  getLearningProgress,
  updateTopicProgress,
  completeTopic,
} from "../../utils/learningProgress";

const FLOOR_SLIDES = [
  {
    id: "intro",
    type: "intro",
  },
  {
    id: "symptom",
    type: "content",
    icon: symptomIcon,
    text: "נטפל בסימפטום ולא בגורם:",
    text2: "החייל הוא לא ההפרעה.",
  },
  {
    id: "perspective",
    type: "content",
    icon: perspectiveIcon,
    text: "לא כל התנגדות היא הפרעה:",
    text2: "לעיתים יש פערי תפיסה בינינו לבין החיילים.",
  },
  {
    id: "proportion",
    type: "content",
    icon: proportionIcon,
    text: "יש לשמור על הפרופורציות:",
    text2: "הכיתה אינה שדה הקרב.",
  },
  {
    id: "stability",
    type: "content",
    icon: stabilityIcon,
    text: "לא להתערער:",
    text2: "לא פשוט להתמודד עם התנגדויות, אך חשוב לשמור על יציבות פנימית.",
  },
];

const LAST_SLIDE_INDEX = FLOOR_SLIDES.length - 1;
const ANIMATION_DURATION = 380;

function FloorPage() {
  const navigate = useNavigate();
  const pointerStartX = useRef(null);

  const [initialLearningProgress] = useState(() => getLearningProgress());

  const initialFloorProgress =
    initialLearningProgress.topicProgress?.floor ?? {};

  const character = initialLearningProgress.character;

  const floorAlreadyCompleted =
    initialLearningProgress.completedTopics.includes("floor");

  const [currentSlide, setCurrentSlide] = useState(() => {
    const savedSlide = Number(initialFloorProgress.currentSlide);

    if (
      Number.isInteger(savedSlide) &&
      savedSlide >= 0 &&
      savedSlide <= LAST_SLIDE_INDEX
    ) {
      return savedSlide;
    }

    return 0;
  });

  const [visitedSlides, setVisitedSlides] = useState(() => {
    const savedVisited = Array.isArray(initialFloorProgress.visitedSlides)
      ? initialFloorProgress.visitedSlides.filter(
          (index) =>
            Number.isInteger(index) && index >= 0 && index <= LAST_SLIDE_INDEX
        )
      : [];

    return Array.from(new Set([...savedVisited, currentSlide])).sort(
      (a, b) => a - b
    );
  });

  /*
    transitionData נשמר רק בזמן שהקרוסלה בתנועה.

    direction:
    "left"  = עוברים קדימה
    "right" = חוזרים אחורה
  */
  const [transitionData, setTransitionData] = useState(null);

  const isAnimating = transitionData !== null;

  useEffect(() => {
    if (!character) {
      navigate("/", { replace: true });
    }
  }, [character, navigate]);

  useEffect(() => {
    if (!character) {
      return;
    }

    updateTopicProgress("floor", {
      currentSlide,
      visitedSlides,
    });
  }, [character, currentSlide, visitedSlides]);

  /*
    גם אם animationend לא יגיע מסיבה כלשהי,
    אחרי 380ms אנחנו תמיד משחררים את הקרוסלה.
    ככה היא לא יכולה להיתקע.
  */
  useEffect(() => {
    if (!transitionData) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTransitionData(null);
    }, ANIMATION_DURATION);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [transitionData]);

  const floorCharacter =
    character === "boy" ? boyFloorCharacter : girlFloorCharacter;

  const goToSlide = (slideIndex, direction) => {
    if (
      slideIndex < 0 ||
      slideIndex > LAST_SLIDE_INDEX ||
      slideIndex === currentSlide ||
      isAnimating
    ) {
      return;
    }

    setTransitionData({
      fromIndex: currentSlide,
      toIndex: slideIndex,
      direction,
    });

    setCurrentSlide(slideIndex);

    setVisitedSlides((currentVisited) => {
      if (currentVisited.includes(slideIndex)) {
        return currentVisited;
      }

      return [...currentVisited, slideIndex].sort((a, b) => a - b);
    });
  };

  /*
    אצלנו סדר ההתקדמות הוא מימין לשמאל:
    ◀ = הבא
    ▶ = הקודם
  */
  const handleCarouselNext = () => {
    const nextIndex = currentSlide === LAST_SLIDE_INDEX ? 0 : currentSlide + 1;

    goToSlide(nextIndex, "left");
  };

  const handleCarouselPrevious = () => {
    const previousIndex =
      currentSlide === 0 ? LAST_SLIDE_INDEX : currentSlide - 1;

    goToSlide(previousIndex, "right");
  };

  /*
    לחיצה על dot:
    אם עוברים למספר גבוה יותר -> שמאלה.
    אם חוזרים למספר נמוך יותר -> ימינה.
  */
  const handleDotClick = (slideIndex) => {
    if (slideIndex === currentSlide) {
      return;
    }

    const direction = slideIndex > currentSlide ? "left" : "right";

    goToSlide(slideIndex, direction);
  };

  const handlePointerDown = (event) => {
    if (isAnimating) {
      return;
    }

    pointerStartX.current = event.clientX;

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event) => {
    if (pointerStartX.current === null || isAnimating) {
      pointerStartX.current = null;
      return;
    }
  
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
  
    if (Math.abs(distance) < 35) {
      return;
    }
  
    /*
      Swipe ימינה
      → האנימציה זזה ימינה
    */
    if (distance > 0) {
      handleCarouselNext();
      return;
    }
  
    /*
      Swipe שמאלה
      → האנימציה זזה שמאלה
    */
    handleCarouselPrevious();
  };

  const handlePointerCancel = () => {
    pointerStartX.current = null;
  };

  const allSlidesVisited =
    floorAlreadyCompleted || visitedSlides.length === FLOOR_SLIDES.length;

  const handleCompleteFloor = () => {
    if (!allSlidesVisited) {
      return;
    }

    completeTopic("floor");
    navigate("/learning");
  };

  const handleBackToLearning = () => {
    navigate("/learning");
  };

  if (!character) {
    return null;
  }

  const activeSlide = FLOOR_SLIDES[currentSlide];

  const renderFloorSlide = (
    slideIndex,
    animationClass = "",
    keySuffix = ""
  ) => {
    const slide = FLOOR_SLIDES[slideIndex];

    if (!slide) {
      return null;
    }

    const className = [
      "floor-slide",
      `floor-slide--${slide.id}`,
      animationClass,
    ]
      .filter(Boolean)
      .join(" ");

    if (slide.type === "intro") {
      return (
        <div key={`${slide.id}-${keySuffix}`} className={className}>
          <h1 className="floor-intro-title">
            נקודות מוצא
            <br />
            לטיפול בהתנגדויות
          </h1>

          <div className="floor-intro-tip">
            <div className="floor-intro-bubble">
              לחצו על החיצים
              <br />
              כדי ללמוד
            </div>

            <img
              src={floorCharacter}
              alt=""
              className="floor-intro-character"
              draggable="false"
            />
          </div>
        </div>
      );
    }

    return (
      <div key={`${slide.id}-${keySuffix}`} className={className}>
        <img
          src={slide.icon}
          alt=""
          className="floor-slide-icon"
          draggable="false"
        />

        <p className="floor-slide-lead">{slide.text}</p>

        <p className="floor-slide-highlight">{slide.text2}</p>
      </div>
    );
  };

  const renderCarouselSlides = () => {
    if (!transitionData) {
      return renderFloorSlide(currentSlide, "", "current");
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
        {renderFloorSlide(transitionData.fromIndex, leavingClass, "leaving")}

        {renderFloorSlide(transitionData.toIndex, enteringClass, "entering")}
      </>
    );
  };

  return (
    <main className="floor-page" dir="rtl">
      <div className="floor-stage">
        <img
          src={floorBackground}
          alt=""
          className="floor-background"
          draggable="false"
        />

        <div className="floor-safe-area">
          <div className="floor-logos" aria-hidden="true">
            <img src={bahad} alt="" className="floor-bahad-logo" />

            <img src={bahad2} alt="" className="floor-bahad2-logo" />
          </div>

          <img src={til} alt="" className="floor-til-logo" aria-hidden="true" />
        </div>

        <section
          className={[
            "floor-content-area",
            `floor-content-area--${activeSlide.id}`,
          ].join(" ")}
        >
          <button
            type="button"
            className="floor-back-button"
            onClick={handleBackToLearning}
            aria-label="חזרה למסך הלמידה"
          >
            <img src={backButton} alt="" draggable="false" />
          </button>

          <div
            className="floor-carousel-swipe-area"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            {renderCarouselSlides()}
          </div>

          <button
            type="button"
            className="floor-carousel-arrow floor-carousel-arrow--left"
            onClick={handleCarouselNext}
            aria-label="לשקופית הבאה"
            aria-disabled={isAnimating}
          >
            ◀
          </button>

          <button
            type="button"
            className="floor-carousel-arrow floor-carousel-arrow--right"
            onClick={handleCarouselPrevious}
            aria-label="לשקופית הקודמת"
            aria-disabled={isAnimating}
          >
            ▶
          </button>

          <div className="floor-carousel-dots" aria-label="בחירת שקופית">
            {FLOOR_SLIDES.map((slide, index) => {
              const isCurrent = index === currentSlide;
              const isVisited = visitedSlides.includes(index);

              return (
                <button
                  key={slide.id}
                  type="button"
                  className={[
                    "floor-carousel-dot",
                    isCurrent ? "is-current" : "",
                    isVisited ? "is-visited" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleDotClick(index)}
                  aria-label={`מעבר לשקופית ${index + 1}`}
                  aria-current={isCurrent ? "true" : undefined}
                  aria-disabled={isAnimating}
                />
              );
            })}
          </div>

          <button
            type="button"
            className={[
              "floor-complete-button",
              !allSlidesVisited ? "is-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={!allSlidesVisited}
            onClick={handleCompleteFloor}
          >
            הבא
          </button>
        </section>
      </div>
    </main>
  );
}

export default FloorPage;
