import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ProjectorPage.css";

/* ============================================================
   Background
============================================================ */

import projectorBackground from "../../assets/projector-classroom-background.svg";

/* ============================================================
   Characters
============================================================ */

import girlStanding from "../../assets/girl-standing.svg";
import boyStanding from "../../assets/boy-standing.svg";

import girlPopup from "../../assets/girl-projector-popup.svg";
import boyPopup from "../../assets/boy-projector-popup.svg";

/* ============================================================
   Icons
============================================================ */

import windowIcon from "../../assets/projector-window-icon.svg";
import fireIcon from "../../assets/projector-fire-icon.svg";

import soldierReasonsIcon from "../../assets/projector-soldier-reasons-icon.svg";
import lessonReasonsIcon from "../../assets/projector-lesson-reasons-icon.svg";

import backButton from "../../assets/projector-back-button.svg";

/* ============================================================
   Logos
============================================================ */

import bahad from "../../assets/bahad.png";
import bahad2 from "../../assets/bahad2.svg";
import til from "../../assets/til.svg";

/* ============================================================
   Progress
============================================================ */

import {
  getLearningProgress,
  updateTopicProgress,
  completeTopic,
} from "../../utils/learningProgress";

const LAST_SLIDE_INDEX = 3;

/* ============================================================
   Projector Page
============================================================ */

function ProjectorPage() {
  const navigate = useNavigate();

  /* ============================================================
     Initial progress
  ============================================================ */

  const initialLearningProgress = getLearningProgress();

  const initialProjectorProgress =
    initialLearningProgress.topicProgress?.projector ?? {};

  const [character] = useState(initialLearningProgress.character);

  const [currentSlide, setCurrentSlide] = useState(() => {
    const savedSlide = Number(initialProjectorProgress.currentSlide);

    if (
      Number.isInteger(savedSlide) &&
      savedSlide >= 0 &&
      savedSlide <= LAST_SLIDE_INDEX
    ) {
      return savedSlide;
    }

    return 0;
  });

  const [hasOpenedPopup, setHasOpenedPopup] = useState(() =>
    Boolean(initialProjectorProgress.popupOpened)
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  /* ============================================================
     Character safety
  ============================================================ */

  useEffect(() => {
    if (!character) {
      navigate("/", {
        replace: true,
      });
    }
  }, [character, navigate]);

  /* ============================================================
     Character assets
  ============================================================ */

  const standingCharacter = character === "boy" ? boyStanding : girlStanding;

  const popupCharacter = character === "boy" ? boyPopup : girlPopup;

  /* ============================================================
     Save slide
  ============================================================ */

  const goToSlide = (slideIndex) => {
    if (slideIndex < 0 || slideIndex > LAST_SLIDE_INDEX) {
      return;
    }

    setCurrentSlide(slideIndex);

    updateTopicProgress("projector", {
      currentSlide: slideIndex,
    });
  };

  /* ============================================================
     Previous
  ============================================================ */

  const handlePrevious = () => {
    /*
      בשקופית הראשונה:
      העמוד הקודם הוא LearningPage.
    */

    if (currentSlide === 0) {
      navigate("/learning");
      return;
    }

    goToSlide(currentSlide - 1);
  };

  /* ============================================================
     Next
  ============================================================ */

  const handleNext = () => {
    /*
      שקופיות 1-3:
      פשוט ממשיכים קדימה.
    */

    if (currentSlide < LAST_SLIDE_INDEX) {
      goToSlide(currentSlide + 1);

      return;
    }

    /*
      שקופית 4:
      אי אפשר לסיים לפני
      שפתחו לפחות פעם אחת
      את ה-popup.
    */

    if (!hasOpenedPopup) {
      return;
    }

    /*
      מסיימים את נושא המקרן.
    */

    completeTopic("projector");

    navigate("/learning");
  };

  /* ============================================================
     Popup
  ============================================================ */

  const handleOpenPopup = () => {
    setIsPopupOpen(true);

    /*
      מהרגע שה-popup נפתח פעם אחת,
      כפתור "הבא" בשקופית 4
      יהיה פתוח גם אם חוזרים לנושא.
    */

    if (!hasOpenedPopup) {
      setHasOpenedPopup(true);

      updateTopicProgress("projector", {
        currentSlide: LAST_SLIDE_INDEX,

        popupOpened: true,
      });
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  /* ============================================================
     Guard
  ============================================================ */

  if (!character) {
    return null;
  }

  return (
    <main className="projector-page" dir="rtl">
      {/* ======================================================
          STAGE
          479 × 852
      ====================================================== */}

      <div className="projector-stage">
        {/* ====================================================
            Background
        ==================================================== */}

        <img
          src={projectorBackground}
          alt=""
          className="projector-background"
          draggable="false"
        />

        <div className="projector-safe-area">
          {/* =========================
            Top Logos
            ========================= */}

          <div className="projector-logos" aria-hidden="true">
            <img src={bahad} alt="" className="projector-bahad-logo" />

            <img src={bahad2} alt="" className="projector-bahad2-logo" />
          </div>

          {/* =========================
            Bottom Logo
            ========================= */}

          <img
            src={til}
            alt=""
            aria-hidden="true"
            className="projector-til-logo"
          />

          {/* =========================
            Character
            ========================= */}

          <img
            src={standingCharacter}
            alt=""
            className="projector-character"
            draggable="false"
          />

          {/* =========================
            Slide 1 Bubble
            ========================= */}

          {currentSlide === 0 && (
            <div className="projector-character-bubble">
              לדוגמה חניך שמדבר
              <br />
              במהלך כל השיעור
            </div>
          )}
        </div>

        {/* ====================================================
            PROJECTOR SCREEN

            Figma:
            X 73
            Y 246
            W 334
            H 315
        ==================================================== */}

        <section className="projector-screen">
          {/* ==================================================
              Previous
          ================================================== */}

          <button
            type="button"
            className="projector-back-button"
            onClick={handlePrevious}
            aria-label={
              currentSlide === 0 ? "חזרה למסך הלמידה" : "לשקופית הקודמת"
            }
          >
            <img src={backButton} alt="" draggable="false" />
          </button>

          {/* ==================================================
              Slide 1
          ================================================== */}

          {currentSlide === 0 && (
            <div
              className="
                projector-slide
                projector-slide--definition
              "
            >
              <p className="projector-slide-subtitle">קודם כל</p>

              <h1 className="projector-slide-title">מהי התנגדות?</h1>

              <p className="projector-slide-text projector-slide-text--definition">
                התנגדות היא הפרעה, פאסיבית או אקטיבית, הפוגעת בתהליך הלמידה.
              </p>
            </div>
          )}

          {/* ==================================================
              Slide 2
          ================================================== */}

          {currentSlide === 1 && (
            <div className="projector-slide projector-slide--goals">
              <h2 className="projector-slide-title projector-slide-title--goals">
                מטרות עיקריות לטיפול
                <br />
                בהתנגדויות
              </h2>

              <div className="projector-goals-grid">
                <article className="projector-goal-card">
                  <div className="projector-goal-card__icon-wrap">
                    <img
                      src={windowIcon}
                      alt=""
                      className="projector-goal-card__icon"
                      draggable="false"
                    />
                  </div>

                  <div className="projector-goal-card__header">השארת צוהר:</div>

                  <p className="projector-goal-card__text">
                    עלינו לטפל בהפרעה
                    <br />
                    באופן ישיר אך לא
                    <br />
                    באופן שיחסום המשך
                    <br />
                    תהליך ושיח עם החייל.
                  </p>
                </article>

                <article className="projector-goal-card">
                  <div className="projector-goal-card__icon-wrap">
                    <img
                      src={fireIcon}
                      alt=""
                      className="projector-goal-card__icon"
                      draggable="false"
                    />
                  </div>

                  <div className="projector-goal-card__header">
                    כיבוי שריפות:
                  </div>

                  <p className="projector-goal-card__text">
                    יש לנטרל את ההפרעה
                    <br />
                    באופן מיידי על מנת
                    <br />
                    לאפשר המשך תקין
                    <br />
                    של השיעור.
                  </p>
                </article>
              </div>
            </div>
          )}

          {/* ==================================================
              Slide 3
          ================================================== */}

          {currentSlide === 2 && (
            <div className="projector-slide projector-slide--reasons">
              <h2 className="projector-slide-title projector-slide-title--reasons">
                מדוע החייל מתנגד?
              </h2>

              <div className="projector-reasons-grid">
                {/* =========================
          סיבות הקשורות לחייל
      ========================= */}

                <article className="projector-reason-card">
                  <div className="projector-reason-card__icon-wrap">
                    <img
                      src={soldierReasonsIcon}
                      alt=""
                      className="projector-reason-card__icon"
                      draggable="false"
                    />
                  </div>

                  <div className="projector-reason-card__header">
                    סיבות הקשורות לחייל:
                  </div>

                  <ul className="projector-reason-card__list">
                    <li>חוסר ריכוז.</li>

                    <li>עייפות או עצבנות.</li>

                    <li>קושי בחיים האישיים.</li>

                    <li>חוסר עניין ושיעמום.</li>

                    <li>רצון למשוך תשומת לב.</li>

                    <li>מאבק עם הסביבה.</li>
                  </ul>
                </article>

                {/* =========================
          סיבות הקשורות לשיעור
      ========================= */}

                <article className="projector-reason-card">
                  <div className="projector-reason-card__icon-wrap">
                    <img
                      src={lessonReasonsIcon}
                      alt=""
                      className="projector-reason-card__icon"
                      draggable="false"
                    />
                  </div>

                  <div className="projector-reason-card__header">
                    סיבות הקשורות לשיעור:
                  </div>

                  <ul className="projector-reason-card__list">
                    <li>תוכן המעורר התנגדות או חוסר עניין.</li>

                    <li>שיעור ברמה לא מותאמת.</li>

                    <li>שיעור בשעה מעייפת או בסביבה מסיחה.</li>
                  </ul>
                </article>
              </div>
            </div>
          )}

          {/* ==================================================
              Slide 4
          ================================================== */}

          {currentSlide === 3 && (
            <div
              className="
                projector-slide
                projector-slide--prevention
              "
            >
              <p className="projector-slide-subtitle">במצבים כאלה חשוב</p>

              <h1 className="projector-slide-title">להקדים תרופה למכה</h1>

              <p className="projector-slide-text projector-slide-text--prevention">
                אז כיצד ניתן להתאים את עצמנו ואת השיעור להתנגדויות פוטנציאליות?
              </p>

              <button
                type="button"
                className="projector-popup-open-button"
                onClick={handleOpenPopup}
                aria-label="פתיחת מידע נוסף"
              >
                +
              </button>
            </div>
          )}

          {/* ==================================================
              Next
          ================================================== */}

          <button
            type="button"
            className={[
              "projector-next-button",

              currentSlide === LAST_SLIDE_INDEX && !hasOpenedPopup
                ? "is-disabled"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={currentSlide === LAST_SLIDE_INDEX && !hasOpenedPopup}
            onClick={handleNext}
          >
            הבא
          </button>
        </section>

        {/* ====================================================
            POPUP
        ==================================================== */}

        {isPopupOpen && (
          <div className="projector-popup-overlay" role="presentation">
            <div
              className="projector-popup"
              role="dialog"
              aria-modal="true"
              aria-labelledby="projector-popup-title"
            >
              {/* Close */}

              <button
                type="button"
                className="projector-popup-close"
                onClick={handleClosePopup}
                aria-label="סגירת החלון"
              >
                ×
              </button>

              {/* Title */}

              <h2 id="projector-popup-title" className="projector-popup-title">
                להקדים תרופה למכה
              </h2>

              {/* Bullets */}

              <ul className="projector-popup-list">
                <li>
                  <strong>תכנון</strong> הפעלות והסברים לפני העברת השיעור.
                </li>

                <li>
                  <strong>זיהוי מוקדם</strong> של חלקים קשים או מעוררי התנגדות
                  בשיעור.
                </li>

                <li>
                  <strong>הערכה</strong> מקדימה של האוכלוסיה: ידע קודם, עניין,
                  ניסיון בתחום, מצב פיזי ורגשי.
                </li>

                <li>
                  <strong>הגדרות נהלים</strong> מסודרת בתחילת השיעור - מה אפשר
                  ואי אפשר לעשות.
                </li>
              </ul>

              {/* Popup character */}

              <div className="projector-popup-character-area">
                <div className="projector-popup-character-bubble">
                  זכרו, הכנה מראש מונעת בעיות בהמשך
                </div>

                <img
                  src={popupCharacter}
                  alt=""
                  className="projector-popup-character"
                  draggable="false"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProjectorPage;
