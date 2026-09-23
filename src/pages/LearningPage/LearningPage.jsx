import React, { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./LearningPage.css";

/* ============================================================
     Classroom assets
  ============================================================ */

import classroomBackground from "../../assets/classroom-background.svg";

import chair from "../../assets/chair.svg";
import computer from "../../assets/computer.svg";
import projector from "../../assets/projector.svg";
import floorHighlight from "../../assets/floor-highlight.svg";

/* ============================================================
     Characters
  ============================================================ */

import girlStanding from "../../assets/girl-standing.svg";
import boyStanding from "../../assets/boy-standing.svg";

/* ============================================================
     Logos
  ============================================================ */

import bahad from "../../assets/bahad.png";
import bahad2 from "../../assets/bahad2.svg";
import til from "../../assets/til-black.svg";

/* ============================================================
     Progress
  ============================================================ */

import {
  getLearningProgress,
  getCurrentTopicId,
  updateLearningProgress,
} from "../../utils/learningProgress";

/* ============================================================
     Classroom elements
  
     סדר הלמידה:
  
     1. מקרן
     2. רצפה
     3. מחשב
     4. כיסא
  
     IMPORTANT:
  
     ה-hitboxes עדיין מבוססים על
     ה-SAFE AREA המקורי של 393×852.
  
     לכן אין צורך לחשב אותם מחדש.
  ============================================================ */

const CLASSROOM_ELEMENTS = [
  {
    id: "projector",

    label: "מקרן",

    image: projector,

    route: "/learning/projector",

    hitbox: {
      left: "25%",
      top: "22%",
      width: "73%",
      height: "33%",
    },
  },

  {
    id: "floor",

    label: "רצפה",

    image: floorHighlight,

    route: "/learning/floor",

    hitbox: {
      left: "50%",
      top: "80.8%",
      width: "22%",
      height: "5.5%",
    },
  },

  {
    id: "computer",

    label: "מחשב",

    image: computer,

    route: "/learning/computer",

    hitbox: {
      left: "0%",
      top: "49%",
      width: "31%",
      height: "38%",
    },
  },

  {
    id: "chair",

    label: "כיסא",

    image: chair,

    route: "/learning/chair",

    hitbox: {
      left: "76%",
      top: "60%",
      width: "24%",
      height: "27%",
    },
  },
];

function LearningPage() {
  const navigate = useNavigate();

  /* ============================================================
       Progress
    ============================================================ */

  const [progress, setProgress] = useState(() => getLearningProgress());

  /* ============================================================
       אם אין דמות - חוזרים לפתיחה
    ============================================================ */

  useEffect(() => {
    if (!progress.character) {
      navigate("/", {
        replace: true,
      });
    }
  }, [progress.character, navigate]);

  /* ============================================================
       Current topic
    ============================================================ */

  const currentTopicId = useMemo(() => {
    return getCurrentTopicId(progress);
  }, [progress]);

  /* ============================================================
       Character
    ============================================================ */

  const characterImage =
    progress.character === "boy" ? boyStanding : girlStanding;

  /* ============================================================
       Intro continue
    ============================================================ */

  const handleIntroContinue = () => {
    const updatedProgress = updateLearningProgress((current) => ({
      ...current,

      introSeen: true,
    }));

    setProgress(updatedProgress);
  };

  /* ============================================================
       Element click
    ============================================================ */

  const handleElementClick = (element) => {
    const isCompleted = progress.completedTopics.includes(element.id);

    const isCurrent = element.id === currentTopicId;

    /*
         אפשר להיכנס רק:
         - לנושא הפעיל
         - או לנושא שכבר הושלם
      */

    if (!isCurrent && !isCompleted) {
      return;
    }

    navigate(element.route);
  };

  /* ============================================================
       בזמן redirect לפתיחה
    ============================================================ */

  if (!progress.character) {
    return null;
  }

  return (
    <main className="learning-page" dir="rtl">
      {/* ======================================================
            STAGE
  
            כל ה-stage החדש הוא:
            479 × 852
  
            הוא כולל Bleed בצדדים.
        ====================================================== */}

      <div
        className={[
          "learning-stage",

          !progress.introSeen ? "is-intro-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ====================================================
              CLASSROOM SCENE
  
              כל האסטים האלה יוצאו עכשיו
              בגודל 479 × 852:
  
              - background
              - projector
              - floor highlight
              - computer
              - chair
          ==================================================== */}

        <div className="learning-scene">
          {/* =====================
                Background
            ===================== */}

          <img
            src={classroomBackground}
            alt=""
            className="learning-background"
            draggable="false"
          />

          <div className="learning-home-sentence">- לחצו על האלמנטים המהבהבים -</div>

          {/* =====================
                Classroom objects
            ===================== */}

          {CLASSROOM_ELEMENTS.map((element) => {
            const isCompleted = progress.completedTopics.includes(element.id);

            const isCurrent = element.id === currentTopicId;

            /*
                   אלמנט מהבהב רק אחרי
                   שסגרנו את פתיח הדמות.
                */

            const shouldPulse = isCurrent && progress.introSeen;

            /*
                   הרצפה עצמה כבר קיימת
                   בתוך הרקע.
  
                   לכן highlight שלה
                   מופיע רק כשהיא פעילה
                   או הושלמה.
                */

            const shouldShowImage =
              element.id !== "floor" || isCurrent || isCompleted;

            return (
              <React.Fragment key={element.id}>
                {shouldShowImage && (
                  <img
                    src={element.image}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                    className={[
                      "learning-object",

                      `learning-object--${element.id}`,

                      shouldPulse ? "is-current" : "",

                      isCompleted ? "is-completed" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ====================================================
              SAFE AREA
  
              זה ה-393×852 המקורי.
  
              כל הדברים החשובים נשארים כאן:
  
              - hitboxes
              - logos
              - character
              - speech bubble
          ==================================================== */}

        <div className="learning-safe-area">
          {/* ==================================================
                HITBOXES
            ================================================== */}

          {CLASSROOM_ELEMENTS.map((element) => {
            const isCompleted = progress.completedTopics.includes(element.id);

            const isCurrent = element.id === currentTopicId;

            const isAvailable = isCurrent || isCompleted;

            return (
              <button
                key={element.id}
                type="button"
                aria-label={element.label}
                className={[
                  "learning-hitbox",

                  isCurrent ? "is-current" : "",

                  isCompleted ? "is-completed" : "",

                  !isAvailable ? "is-locked" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={element.hitbox}
                disabled={!isAvailable || !progress.introSeen}
                onClick={() => handleElementClick(element)}
              >
                {/* ===================
                        Completed V
                    =================== */}

                {isCompleted && progress.introSeen && (
                  <span
                    className="learning-completion-check"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}

          {/* ==================================================
                TOP LOGOS
            ================================================== */}

          <div className="learning-logos" aria-hidden="true">
            <img src={bahad} alt="" className="learning-bahad-logo" />

            <img src={bahad2} alt="" className="learning-bahad2-logo" />
          </div>

          {/* ==================================================
                TIL LOGO
            ================================================== */}

          <img
            src={til}
            alt=""
            className="learning-til-logo"
            aria-hidden="true"
          />

          {/* ==================================================
                INTRO
            ================================================== */}

          {!progress.introSeen && (
            <div className="learning-intro">
              {/* =================
                    Speech Bubble
                ================= */}

              <div className="learning-intro-bubble">
                <p className="learning-intro-text">
                  היי! אני אתם מהעתיד ובאתי ללמד אתכם איך להעביר שיעור תוך
                  התמודדות עם אתגרי חניכים.
                  <br />
                  מוכנים להתחיל ללמוד?
                </p>

                <button
                  type="button"
                  className="learning-intro-button"
                  onClick={handleIntroContinue}
                >
                  יאללה
                  <span className="learning-intro-arrow" aria-hidden="true">
                    &gt;
                  </span>
                </button>
              </div>

              {/* =================
                    Character
                ================= */}

              <img
                src={characterImage}
                alt=""
                className="learning-character"
                draggable="false"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default LearningPage;
