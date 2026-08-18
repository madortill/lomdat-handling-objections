import { HashRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { useState } from "react";
import OpeningPage from "./pages/OpeningPage/OpeningPage";
import "./css/App.css";

function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route path="/" element={<OpeningPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
