import { Routes, Route } from "react-router-dom";
import React from "react";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";

function App() {
    return (
        <div>
            <h1 className="flex justify-center items-center font-bold text-3xl text-gray-800 my-5">
                <img src="vt-logo.png" alt="VT" className="w-14" /> Connect
            </h1>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </div>
    );
}

export default App;
