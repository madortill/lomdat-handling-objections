import React, { useEffect, useRef, useState } from "react";
import "./About.css";

import aboutCharacter from "../../assets/keshet.svg";
import aboutLanyard from "../../assets/mapalRope.svg";

function About() {
  const [isOpen, setIsOpen] = useState(false);

  const aboutRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={aboutRef}
      className={`about-wrapper ${isOpen ? "open" : ""}`}
      dir="rtl"
    >
      <button
        type="button"
        className="about-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "סגירת אודות" : "פתיחת אודות"}
      >
        <span className="about-toggle-icon" aria-hidden="true">
          {isOpen ? "×" : "i"}
        </span>

        <span className="about-toggle-text">{isOpen ? "סגירה" : "אודות"}</span>
      </button>

      <div className="about-panel">
        <img
          src={aboutLanyard}
          alt=""
          className="about-lanyard"
          draggable="false"
        />

        <h2 className="about-main-title">מפתחת ראשית:</h2>

        <img
          src={aboutCharacter}
          alt=""
          className="about-character"
          draggable="false"
        />

        <p className="about-name">רב״ט קשת פרי</p>

        <h3 className="about-title">גרפיקה:</h3>

        <p className="about-name">רב״ט קשת פרי</p>

        <h3 className="about-title">מומחי תוכן:</h3>

        <p className="about-name">סמ״ר שם שם</p>

        <p className="about-name">רב״ט שם שם</p>

        <h3 className="about-title">רמ״ד טי״ל:</h3>

        <p className="about-name">סמ״ר קטיה מדבדב</p>

        <h3 className="about-title">גרסה:</h3>

        <p className="about-version">ספטמבר 2026</p>
      </div>
    </div>
  );
}

export default About;
