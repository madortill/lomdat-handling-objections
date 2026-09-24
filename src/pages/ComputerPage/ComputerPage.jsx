import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ComputerPage.css";

import computerBackground from "../../assets/computer-classroom-background.svg";
import learningBackground from "../../assets/classroom-background.svg";

import girlLook from "../../assets/girl-computer-response-look.svg";
import boyLook from "../../assets/boy-computer-response-look.svg";

import girlProximity from "../../assets/girl-computer-response-proximity.svg";
import boyProximity from "../../assets/boy-computer-response-proximity.svg";

import girlSilence from "../../assets/girl-computer-response-silence.svg";
import boySilence from "../../assets/boy-computer-response-silence.svg";

import girlReflection from "../../assets/girl-computer-response-reflection.svg";
import boyReflection from "../../assets/boy-computer-response-reflection.svg";

import girlDistractions from "../../assets/girl-computer-response-distractions.svg";
import boyDistractions from "../../assets/boy-computer-response-distractions.svg";

import girlHumor from "../../assets/girl-computer-response-humor.svg";
import boyHumor from "../../assets/boy-computer-response-humor.svg";

import girlContract from "../../assets/girl-computer-response-contract.svg";
import boyContract from "../../assets/boy-computer-response-contract.svg";

import girlPositive from "../../assets/girl-computer-response-positive.svg";
import boyPositive from "../../assets/boy-computer-response-positive.svg";

import girlRemoveSoldier from "../../assets/girl-computer-response-remove-soldier.svg";
import boyRemoveSoldier from "../../assets/boy-computer-response-remove-soldier.svg";

import backButton from "../../assets/projector-back-button.svg";

import bahad from "../../assets/bahad.png";
import bahad2 from "../../assets/bahad2.svg";
import til from "../../assets/til.svg";

import {
  getLearningProgress,
  updateTopicProgress,
  completeTopic,
} from "../../utils/learningProgress";

const COMPUTER_CARDS = [
  {
    id: "look",
    title: "מבט",
    accent: "#1598C7",
    glow: "rgba(21, 152, 199, 0.75)",
    text: "מבט רציני וממוקד לעיני החניך. המבט משמש כאזהרה שקטה ולא שופטת, מעלה את המודעות של החניך לכך שהמדריך רואה אותו, ושהדבר מפריע לו.",
    girlImage: girlLook,
    boyImage: boyLook,
  },
  {
    id: "proximity",
    title: "קרבה פיזית",
    accent: "#17B5DF",
    glow: "rgba(23, 181, 223, 0.75)",
    text: "קרבה ותנועה של המדריך שוברת מעין מחיצות ומאפשרת מיקוד מחדש.",
    girlImage: girlProximity,
    boyImage: boyProximity,
  },
  {
    id: "silence",
    title: "שתיקה",
    accent: "#4595D0",
    glow: "rgba(69, 149, 208, 0.75)",
    text: "שתיקה יוצאת אפקט רצני. כאשר מעביר השיעור משתתק נוצרת התחושה שמשהו מתרחש שלא כשורה.",
    girlImage: girlSilence,
    boyImage: boySilence,
  },
  {
    id: "reflection",
    title: "שיקוף מילולי",
    accent: "#74BFF2",
    glow: "rgba(116, 191, 242, 0.8)",
    text: "תיאור ההתנהגות האובייקטיבי של החניך: “אתה מדבר”, יעיל יותר מאשר ציווי: “די לדבר”, כיוון שביטוי זה אינו שופט אלא יוצר מודעות.",
    girlImage: girlReflection,
    boyImage: boyReflection,
  },
  {
    id: "distractions",
    title: "סילוק גורמים מסיחים",
    accent: "#1CA7C8",
    glow: "rgba(28, 167, 200, 0.75)",
    text: "לבקש להכניס את הגורם המסיח את תשומת ליבם של החניכים, למשל: החפץ בו החניך מתעסק, מכשיר שמסיח את תשומת הלב או העברת החניך למקום אחר.",
    girlImage: girlDistractions,
    boyImage: boyDistractions,
  },
  {
    id: "humor",
    title: "הומור",
    accent: "#38ACCE",
    glow: "rgba(56, 172, 206, 0.75)",
    text: "הומור יוצר אווירה לימודית, נעימה ומשוחררת ומאפשר גם לנו להתמודד עם מצבים מביכים או מורכבים.",
    girlImage: girlHumor,
    boyImage: boyHumor,
  },
  {
    id: "contract",
    title: "הגדרת חוזה התנהגותי",
    accent: "#008EFF",
    glow: "rgba(0, 142, 255, 0.85)",
    text: "לעיתים דפוס מסוים משתרש בכיתה כקבוצה והערות נקודתיות מאבדות מכוחן. במקרה זה נעצור את מהלך השיעור ונבהיר את כללי ההתנהגות המקובלים בכיתה, שאולי נשכחו או לא היו ברורים מלכתחילה.",
    girlImage: girlContract,
    boyImage: boyContract,
  },
  {
    id: "positive",
    title: "“חיוב”",
    accent: "#438CC5",
    glow: "rgba(67, 140, 197, 0.8)",
    text: "כאשר אנו מתייחסים אל התנגדות, חומר או מרכיב בשיעור באופן ידידותי, ענייני וחיובי אנו הופכים את התגובה השלילית לחיובית.",
    girlImage: girlPositive,
    boyImage: boyPositive,
  },
  {
    id: "remove-soldier",
    title: "סילוק חייל",
    accent: "#0875B8",
    glow: "rgba(8, 117, 184, 0.85)",
    text: "אנו הולכים לפי הכלל: “100% חומר ל-100% חניכים. אם הסילוק פוגע בחייל זהו דבר בעייתי. לכן יש להשתמש בתגובה זו במקרים חריגים.",
    girlImage: girlRemoveSoldier,
    boyImage: boyRemoveSoldier,
  },
];

const LAST_CARD_INDEX = COMPUTER_CARDS.length - 1;
const CARD_WIDTH_RATIO = 312 / 479;
const CARD_GAP_RATIO = 20 / 479;
const EXIT_DURATION = 560;

function ComputerPage() {
  const navigate = useNavigate();

  const stageRef = useRef(null);
  const pointerStartXRef = useRef(null);
  const pointerStartTimeRef = useRef(null);
  const dragXRef = useRef(0);
  const dragFrameRef = useRef(null);
  const pendingDragRef = useRef(0);
  const exitTimeoutRef = useRef(null);

  const [initialLearningProgress] = useState(() => getLearningProgress());

  const initialComputerProgress =
    initialLearningProgress.topicProgress?.computer ?? {};

  const character = initialLearningProgress.character;

  const computerAlreadyCompleted =
    initialLearningProgress.completedTopics.includes("computer");

  const [phase, setPhase] = useState(() =>
    initialComputerProgress.phase === "cards" ? "cards" : "intro"
  );

  const [currentCard, setCurrentCard] = useState(() => {
    const savedCard = Number(initialComputerProgress.currentCard);

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
    const savedVisited = Array.isArray(initialComputerProgress.visitedCards)
      ? initialComputerProgress.visitedCards.filter(
          (index) =>
            Number.isInteger(index) && index >= 0 && index <= LAST_CARD_INDEX
        )
      : [];

    return Array.from(new Set([...savedVisited, currentCard])).sort(
      (a, b) => a - b
    );
  });

  const [stageWidth, setStageWidth] = useState(479);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!character) {
      navigate("/", { replace: true });
    }
  }, [character, navigate]);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const updateStageWidth = () => {
      setStageWidth(stage.getBoundingClientRect().width);
    };

    updateStageWidth();

    const observer = new ResizeObserver(updateStageWidth);
    observer.observe(stage);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!character) {
      return;
    }

    updateTopicProgress("computer", {
      phase,
      currentCard,
      visitedCards,
    });
  }, [character, phase, currentCard, visitedCards]);

  useEffect(() => {
    return () => {
      if (dragFrameRef.current) {
        cancelAnimationFrame(dragFrameRef.current);
      }

      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  const cardWidth = stageWidth * CARD_WIDTH_RATIO;
  const cardGap = stageWidth * CARD_GAP_RATIO;
  const cardStep = cardWidth + cardGap;

  const liveCardPosition =
    cardStep > 0 ? currentCard + dragX / cardStep : currentCard;

  const updateDragX = (nextValue) => {
    dragXRef.current = nextValue;
    pendingDragRef.current = nextValue;

    if (dragFrameRef.current) {
      return;
    }

    dragFrameRef.current = requestAnimationFrame(() => {
      setDragX(pendingDragRef.current);
      dragFrameRef.current = null;
    });
  };

  const resetDragImmediately = () => {
    if (dragFrameRef.current) {
      cancelAnimationFrame(dragFrameRef.current);
      dragFrameRef.current = null;
    }

    dragXRef.current = 0;
    pendingDragRef.current = 0;
    setDragX(0);
  };

  const markCardVisited = (index) => {
    setVisitedCards((currentVisited) => {
      if (currentVisited.includes(index)) {
        return currentVisited;
      }

      return [...currentVisited, index].sort((a, b) => a - b);
    });
  };

  const settleToCard = (nextCard) => {
    setIsDragging(false);
    setCurrentCard(nextCard);
    markCardVisited(nextCard);
    resetDragImmediately();
  };

  const handlePointerDown = (event) => {
    if (phase !== "cards" || isExiting) {
      return;
    }

    pointerStartXRef.current = event.clientX;
    pointerStartTimeRef.current = performance.now();

    setIsDragging(true);

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event) => {
    if (!isDragging || pointerStartXRef.current === null || isExiting) {
      return;
    }

    const rawDistance = event.clientX - pointerStartXRef.current;

    let nextDrag = rawDistance;

    if (currentCard === 0 && rawDistance < 0) {
      nextDrag = rawDistance * 0.28;
    }

    if (currentCard === LAST_CARD_INDEX && rawDistance > 0) {
      nextDrag = rawDistance * 0.28;
    }

    const maxDrag = cardStep * 0.95;

    nextDrag = Math.max(-maxDrag, Math.min(maxDrag, nextDrag));

    updateDragX(nextDrag);
  };

  const handlePointerUp = (event) => {
    if (
      pointerStartXRef.current === null ||
      pointerStartTimeRef.current === null
    ) {
      setIsDragging(false);
      return;
    }

    const rawDistance = event.clientX - pointerStartXRef.current;

    const duration = Math.max(
      1,
      performance.now() - pointerStartTimeRef.current
    );

    const velocity = rawDistance / duration;

    const finalDrag = dragXRef.current;

    pointerStartXRef.current = null;
    pointerStartTimeRef.current = null;

    const distanceThreshold = cardWidth * 0.18;

    const fastSwipe = Math.abs(velocity) > 0.45;

    const longEnough = Math.abs(finalDrag) > distanceThreshold;

    if (
      finalDrag > 0 &&
      currentCard < LAST_CARD_INDEX &&
      (longEnough || fastSwipe)
    ) {
      settleToCard(currentCard + 1);
      return;
    }

    if (finalDrag < 0 && currentCard > 0 && (longEnough || fastSwipe)) {
      settleToCard(currentCard - 1);
      return;
    }

    setIsDragging(false);
    resetDragImmediately();
  };

  const handlePointerCancel = () => {
    pointerStartXRef.current = null;
    pointerStartTimeRef.current = null;

    setIsDragging(false);
    resetDragImmediately();
  };

  const handleOpenCards = () => {
    setPhase("cards");

    updateTopicProgress("computer", {
      phase: "cards",
      currentCard,
      visitedCards,
    });
  };

  const handleCardsBack = () => {
    setPhase("intro");

    updateTopicProgress("computer", {
      phase: "intro",
      currentCard,
      visitedCards,
    });
  };

  const handleBackToLearning = () => {
    navigate("/learning");
  };

  const allCardsVisited =
    computerAlreadyCompleted || visitedCards.length === COMPUTER_CARDS.length;

  const canFinish = allCardsVisited;

  const handleFinish = () => {
    if (!canFinish || isExiting) {
      return;
    }

    completeTopic("computer");
    setIsExiting(true);

    exitTimeoutRef.current = setTimeout(() => {
      navigate("/learning");
    }, EXIT_DURATION);
  };

  if (!character) {
    return null;
  }

  return (
    <main className="computer-page" dir="rtl">
      <div className="computer-return-underlay" aria-hidden="true">
        <div className="computer-return-stage">
          <img src={learningBackground} alt="" draggable="false" />
        </div>
      </div>

      <div
        ref={stageRef}
        className={["computer-stage", isExiting ? "is-exiting" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <img
          src={computerBackground}
          alt=""
          className="computer-background"
          draggable="false"
        />

        <div className="computer-safe-area">
          <div className="computer-logos" aria-hidden="true">
            <img src={bahad} alt="" className="computer-bahad-logo" />

            <img src={bahad2} alt="" className="computer-bahad2-logo" />
          </div>

          <img
            src={til}
            alt=""
            className="computer-til-logo"
            aria-hidden="true"
          />
        </div>

        {phase === "intro" && (
          <section className="computer-screen">
            <button
              type="button"
              className="computer-screen-back"
              onClick={handleBackToLearning}
              aria-label="חזרה למסך הלמידה"
            >
              <img src={backButton} alt="" draggable="false" />
            </button>

            <div className="computer-screen-content">
              <p className="computer-screen-text">
                כדי להתמודד עם ההתנגדות בזמן אמת, נלמד את
              </p>

              <h1 className="computer-screen-title">9 התגובות האפשריות</h1>
            </div>

            <button
              type="button"
              className="computer-screen-next"
              onClick={handleOpenCards}
            >
              הבא
            </button>
          </section>
        )}

        {phase === "cards" && (
          <section className="computer-cards-layer">
            <button
              type="button"
              className="computer-cards-back"
              onClick={handleCardsBack}
              aria-label="חזרה למסך הקודם"
            >
              <img src={backButton} alt="" draggable="false" />
            </button>

            <h1 className="computer-cards-heading">9 התגובות האפשריות</h1>

            <div
              className={[
                "computer-cards-viewport",
                isDragging ? "is-dragging" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
            >
              {COMPUTER_CARDS.map((card, index) => {
                const cardOffset = (currentCard - index) * cardStep + dragX;

                const distance = Math.abs(index - liveCardPosition);

                const cardScale = Math.max(0.92, 1 - distance * 0.055);

                const cardOpacity = Math.max(0.58, 1 - distance * 0.2);

                const image =
                  character === "boy" ? card.boyImage : card.girlImage;

                return (
                  <article
                    key={card.id}
                    className="computer-response-card"
                    style={{
                      "--card-x": `${cardOffset}px`,
                      "--card-scale": cardScale,
                      "--card-opacity": cardOpacity,
                      "--card-accent": card.accent,
                      "--card-glow": card.glow,
                      zIndex: 30 - Math.round(distance * 4),
                    }}
                  >
                    <h2 className="computer-response-title">{card.title}</h2>

                    <p className="computer-response-text">{card.text}</p>

                    <div className="computer-response-image-wrap">
                      <img
                        src={image}
                        alt=""
                        className="computer-response-image"
                        draggable="false"
                      />
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="computer-indicators" aria-hidden="true">
              {COMPUTER_CARDS.map((card, index) => {
                const relativePosition = liveCardPosition - index;

                const distance = Math.abs(relativePosition);

                const scale = Math.max(0.38, 1 - distance * 0.32);

                const verticalOffset = Math.min(distance, 3) * 6.5;

                const opacity = Math.max(0.6, 1 - distance * 0.12);

                const glowSize = Math.max(0.5, 2.4 - distance * 0.7);

                return (
                  <div
                    key={card.id}
                    className="computer-indicator"
                    style={{
                      "--indicator-x": `${relativePosition * 20}cqw`,
                      "--indicator-y": `${verticalOffset}cqw`,
                      "--indicator-scale": scale,
                      "--indicator-opacity": opacity,
                      "--indicator-color": card.accent,
                      "--indicator-glow": card.glow,
                      "--indicator-glow-size": `${glowSize}cqw`,
                    }}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>

            {canFinish && (
              <button
                type="button"
                className="computer-finish-button"
                onClick={handleFinish}
                aria-label="המשך למסך הלמידה"
              >
                <span>הבא</span>
                <span className="computer-finish-arrow" aria-hidden="true" />
              </button>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default ComputerPage;
