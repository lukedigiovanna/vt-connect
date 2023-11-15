import React, { useState } from "react";
import { useUserAccount } from "../components/providers/UserAccountProvider";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { Navbar } from "../components/Navbar";
import "../styles/ProfilePage.css";
import { post } from "../constants/api";
import Swal from "sweetalert2";
import { passwordRegex } from "../constants/password";


export const ProfilePage = () => {
    const { user, logout, login } = useUserAccount();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [pid, setPID] = useState(user?.pid || "");
    const [major, setMajor] = useState(user?.major || "");

    const handleDeleteAccount = async (e: any) => {
        e.preventDefault();
        try {
            await post("/deleteUser", {
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
                    await post("/change-password", {
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