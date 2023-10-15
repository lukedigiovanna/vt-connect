import { Routes, Route } from "react-router-dom";
import React from 'react';
import RegisterPage from "./pages/RegisterPage";
import RootPage from "./pages/RootPage";

function App() {
  return (
    <div>
      <h1 className="text-blue-500">
        VT Connect
      </h1>
      <Routes>
        <Route path="/" element={<RootPage />}/>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
