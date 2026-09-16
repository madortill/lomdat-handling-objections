import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startOrResumeLearning } from "../../utils/learningProgress.js";
import "./OpeningPage.css";

import bahad from "../../assets/bahad.png";
import bahad2 from "../../assets/bahad2.svg";
import til from "../../assets/til.svg";
import option1 from "../../assets/girl.svg";
import option2 from "../../assets/boy.svg";
import btn from "../../assets/btn-opening.png";

function OpeningPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="opening-page">
      <div className="opening-black-cover"></div>
      <img src={bahad} alt="bahad logo" className="bahad-logo" />
      <img src={bahad2} alt="bahad2 logo" className="bahad2-logo" />
      <img src={til} alt="til logo" className="til-logo" />

      <div className={`opening-card ${isOpen ? "expanded" : ""}`}>
        {/* החלק שתמיד רואים */}
        <div className="opening-card__top">
          <img src={bahad} alt="" className="opening-card__icon" />

          <p className="opening-card-little-title">ברוכים הבאים</p>

          <p className="opening-card-title">ללומדת התמודדות עם התנגדויות</p>

          {!isOpen && (
            <img
              src={btn}
              className="btn-opening-arrow"
              onClick={() => setIsOpen(true)}
              alt="פתיחה"
            />
          )}
        </div>

        <div className={`opening-card__content ${isOpen ? "show" : ""}`}>
          <div className="opening-divider"></div>

          <p className="opening-card__text">
            רגע לפני שנמשיך, בחרו את הדמות איתה תרצו ללמוד...
          </p>

          <div
            className={`image-options ${selectedImage ? "has-selection" : ""}`}
          >
            <button
              type="button"
              className={`image-option ${
                selectedImage === "girl" ? "selected" : ""
              }`}
              onClick={() => setSelectedImage("girl")}
            >
              <img src={option1} alt="חיילת" />
            </button>

            <button
              type="button"
              className={`image-option ${
                selectedImage === "boy" ? "selected" : ""
              }`}
              onClick={() => setSelectedImage("boy")}
            >
              <img src={option2} alt="חייל" />
            </button>
          </div>

          {selectedImage && (
            <button
              type="button"
              className="continue-button"
              onClick={() => {
                startOrResumeLearning(
                  selectedImage
                );
              
                navigate("/learning");
              }}
            >
              להתחלת הלומדה
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OpeningPage;
