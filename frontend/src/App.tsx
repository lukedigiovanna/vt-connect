import { Routes, Route } from "react-router-dom";
import React from 'react';
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div>
      <h1 className="text-blue-500">
        VT Connect
      </h1>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
