import React, { useState } from "react";
import { useUserAccount } from "../components/providers/UserAccountProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Background } from "../components/Background";
import { Navbar } from "../components/Navbar";
import "../styles/ProfilePage.css";
import { post } from "../constants/api";

export const ProfilePage = () => {
    const { user, logout, login } = useUserAccount();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [pid, setPID] = useState(user?.pid || "");
    const [major, setMajor] = useState(user?.major || "");

    const handleDeleteAccount = async (e: any) => {
        e.preventDefault();
        try {
            const user = (
                await post("/deleteUser", {
                    pid
                })
            ).data;
            logout()
            navigate("/");
        } catch (err: any) {
            let message = "Something went wrong";
            if (err.response) {
                message = err.response.data as string;
            }
            // setErrorMessage(message);
        }
    }

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            console.log("clicked save")
            const response = await post("/update-user", { pid, major });

            if (user) {
                const updatedUser = {
                    ...user,  
                    pid,      
                    major    
                };
                login(updatedUser); 
            }
            setEditMode(false);
        } catch (error) {
            console.error("Error updating user details", error);
        }
    };

    const handleCancel = () => {
        setPID(user?.pid || "");
        setMajor(user?.major || "");
        setEditMode(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "pid") {
            setPID(value);
        } else if (name === "major") {
            setMajor(value);
        }
    };

    return (
        <>
            <Navbar />
            <Background />
            <div className="profile-container">
                <h1>Your Profile</h1>
                {user && (
                    <>
                        <div className="profile-details">
                            {editMode ? (
                                <>
                                    <label>
                                        <strong>PID:</strong>
                                        <input
                                            type="text"
                                            value={pid}
                                            name="pid"
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        <strong>Major:</strong>
                                        <input
                                            type="text"
                                            value={major}
                                            name="major"
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <button
                                        className="button save-button"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="button cancel-button"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p><strong>PID:</strong> {user.pid}</p>
                                    <p><strong>Major:</strong> {user.major}</p>
                                    <button
                                        className="button edit-button"
                                        onClick={handleEdit}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={handleDeleteAccount}
                                    >
                                        Delete My Account
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ProfilePage;