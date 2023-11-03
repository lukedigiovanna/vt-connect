import { Routes, Route } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { EventPage } from "./pages/EventPage";
import { NewEventPage } from "./pages/NewEventPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/new-event" element={<NewEventPage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    );
}

export default App;
