import React, { useState } from "react";
import { useUserAccount } from "../components/providers/UserAccountProvider";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { Navbar } from "../components/Navbar";
import "../styles/ProfilePage.css";
import { apiPost } from "../constants/api";
import Swal from "sweetalert2";
import { passwordRegex } from "../constants/password";
import { updateState } from "../constants/utils";
import { majors } from "../constants/data";



export const ProfilePage = () => {
    const { user, logout, login } = useUserAccount();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [pid, setPID] = useState(user?.pid || "");
    const [major, setMajor] = useState(user?.major || "");
    const [bio, setBio] = useState(user?.bio || "")

    const handleDeleteAccount = async (e: any) => {
        e.preventDefault();
        try {
            await apiPost("/deleteUser", {
                pid
            })
            logout()
            navigate("/");
        } catch (err: any) {
            console.log(err);
        }
    }

    const handleEdit = () => {
        setEditMode(true);
    };
 
    function getEventsHtml(eventsList: Array<[string, string]>) {
        let html = '<div>';

        if (eventsList.length === 0) {

            html += `<p>You have not signed up for any events yet! </p>`
        }

        else {

        eventsList.forEach(event => {
            const [eventTitle, eventHost] = event;
            html += `<div class="event-card">
            <div class="event-info">
                <strong>Title: ${eventTitle}</strong><br>Host: ${eventHost}
            </div>
            <div class="event-separator"></div>
        </div>`;
            });
        }

        html += '</div>';

        return html;
    }


    const handleViewEvents = async () => {
        try {
            // Fetch the list of events from the endpoint
            const pid = user?.pid 
            const response = await apiPost('/display_event_from_id', {pid});
            const events = await response.data

                    
            Swal.fire({
                title: 'Events Signed Up',
                html: getEventsHtml(events),
                confirmButtonText: 'Close',
                showCloseButton: true,
            });
            
    
        } catch (error) {
            console.error('Error fetching or displaying events:', error);
            // Handle errors or display an error message
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch events. Please try again.',
            });
        }
    };
    const handleChangePassword = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Change Password',
            html:
                '<input id="swal-pid" class="swal2-input" placeholder="PID">' +
                '<input id="swal-new-password" type="password" class="swal2-input" placeholder="New Password">' +
                '<input id="swal-confirm-password" type="password" class="swal2-input" placeholder="Confirm New Password">',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Change Password',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return {
                    pid: (document.getElementById('swal-pid') as HTMLInputElement).value,
                    newPassword: (document.getElementById('swal-new-password') as HTMLInputElement).value,
                    confirmPassword: (document.getElementById('swal-confirm-password') as HTMLInputElement).value,
                };
            },
        });

        if (formValues) {
            console.log('PID:', formValues.pid);
            console.log('New Password:', formValues.newPassword);
            console.log('Confirm Password:', formValues.confirmPassword);

            // Check password complexity
            if (!isPasswordComplex(formValues.newPassword)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'Password must contain an uppercase letter, a lowercase letter, a special character, and be at least 8 characters long',
                });
            }

            else if (formValues.newPassword !== formValues.confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'Your passwords do not match',
                });
            }

            else {



            const pid = formValues.pid 
            const new_password = formValues.newPassword         

            try {
                const changed_pwd_response = (
                    await apiPost("/change-password", {
                    pid, new_password
                    })
                );


                if (changed_pwd_response.status === 200) {

                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Your password has been successfully changed",
                        showConfirmButton: true,
                    });
                }
            
            } catch (error) {
                console.log("error " + error)
            }
        }
        }
    };

    // Function to check password complexity
    const isPasswordComplex = (password: string): boolean => {
        return passwordRegex.test(password);
    };

    const handleSave = async () => {
        try {
            await apiPost("/update-user", { pid, major, bio});

            if (user) {
                const updatedUser = {
                    ...user,  
                    pid,      
                    major,
                    bio,
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
        setBio(user?.bio || "")
        setEditMode(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        if (name === "pid") {
            setPID(value);
        } else if (name === "major") {
            setMajor(value);
        }
        else if (name === "bio") {
            setBio(value)
        }
        else if (name === "major") {
            setMajor(value)
        }
    };

   
    return (
        <>
            <Navbar />
            <Background />
            <div className="profile-container">
                <h1>Your Profile</h1>
                {user && (
                    <div className="profile-details">
                        {editMode ? (
                            <>
                                <div className="input-container">
                                    <label>
                                        <strong>PID:</strong>
                                        <input
                                            type="text"
                                            value={pid}
                                            name="pid"
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                                <div className="input-container">
                                    <label>
                                        <strong>Major:</strong>
                                        <select
                                            name="majors"
                                            className="form-input"
                                            defaultValue={"default"}
                                            onChange={updateState(setMajor)}
                                        >
                                            <option disabled value="default">
                                                {user.major}
                                            </option>
                                            {majors.map((majorOption) => (
                                                <option value={majorOption} key={majorOption}>
                                                    {majorOption}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                <div className="input-container">
                                    <label>
                                        <strong>BIO:</strong>
                                        <input
                                            type="text"
                                            value={bio}
                                            name="bio"
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                                <div className="empty-line" style={{ marginBottom: '20px' }}></div>

                                <button
                                    className="button red-button"
                                    onClick={handleChangePassword}
                                >
                                    Change Password
                                </button>
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
                                <p>
                                    <strong>PID:</strong> {user.pid}
                                </p>
                                <p>
                                    <strong>Major:</strong> {user.major}
                                </p>
                                <p>
                                    <strong>BIO:</strong> {user.bio}
                                </p>

                                <br/>
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
                                <button
                                    className="delete-button"
                                    onClick={handleViewEvents}
                                    style={{ marginTop: '20px', backgroundColor: "blue" }}
                                >
                                    View Signed Up Events
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProfilePage;