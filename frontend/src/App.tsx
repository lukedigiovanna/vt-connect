import { Routes, Route } from "react-router-dom";
import { HomePage, RegisterPage, LoginPage, EventPage, ProfilePage, UserPage, NewEventPage, AdminDashboardPage } from "./pages";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/user/:pid" element={<UserPage />} />
            <Route path="/new-event" element={<NewEventPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
    );
}

export default App;
