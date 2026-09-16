// import { HashRouter, Routes, Route } from "react-router-dom";
// import React from "react";
// import { useState } from "react";
// import OpeningPage from "./pages/OpeningPage/OpeningPage";
// import "./css/App.css";

// function App() {
//   return (
//     <>
//       <div className="app">
//         <Routes>
//           <Route path="/" element={<OpeningPage />} />
//         </Routes>
//       </div>
//     </>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import OpeningPage from "./pages/OpeningPage/OpeningPage";
import LearningPage from "./pages/LearningPage/LearningPage";
// import EndPage from "./pages/EndPage/EndPage";

import "./css/App.css";

import { preloadAssets } from "./utils/preloadAssets";

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    preloadAssets().then(() => {
      setAssetsLoaded(true);
    });
  }, []);

  if (!assetsLoaded) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />

        <p>טוענים את הלומדה...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<OpeningPage />}
        />

        <Route
          path="/learning"
          element={<LearningPage />}
        />

        {/* <Route
          path="/end"
          element={<EndPage />}
        /> */}
      </Routes>
    </div>
  );
}

export default App;