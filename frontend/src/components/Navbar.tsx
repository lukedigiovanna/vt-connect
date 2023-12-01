import { useRef, useMemo, useState} from "react";
import { useUserAccount } from "./providers/UserAccountProvider";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";






export const Navbar = () => {
    const { user, logout } = useUserAccount();
    const cookies = useMemo(() => new Cookies(), []);

    const navigate = useNavigate();

    const barRef = useRef<HTMLDivElement>(null);

    const isAdmin = cookies.get("admin_status")

    

    // useEffect(() => {
    //     // Check if a specific item exists in local storage
    //     const yourCookieName = localStorage.getItem('pid');
    //     if (yourCookieName) {
    //         console.log('The cookie exists.');
    //         // You can do something here if the cookie exists
    //     } else {
    //         console.log('The cookie does not exist.');
    //         // You can do something else here if the cookie does not exist
    //     }
    // }, []); // Empty dependency array to run the effect only once on component mount


    const handleAdminPageClick = () => {
        navigate("/admin") 
    }


    return (
        <>
            <div
                className="flex items-center px-16 w-full h-20 bg-gray-100/95 fixed top-0"
                ref={barRef}
            >
              
                <div className="relative w-full flex items-center">
                {isAdmin && (
                        <button
                            className="rounded text-sm px-4 py-1 mr-4 primary-button-colors"
                            onClick={handleAdminPageClick}
                        >
                            Admin Dashboard
                        </button>
                    )}

                    {/* Title */}
                    <h1
                        className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center font-bold text-3xl text-gray-800 cursor-pointer"
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        
                        <img src="/vt-logo.png" alt="VT" className="w-14" />
                        Connect
                    </h1>

                    {/* Spacer */}
                    <div className="flex-grow"></div>

                    {/* User Info/Login */}
                    {user ? (
                        <div className="flex items-center">
                            
                            <button
                                className="rounded text-sm px-4 py-1 mr-4 primary-button-colors"
                                onClick={() => {
                                    navigate("/new-event");
                                }}
                            >
                                + Event
                            </button>
                            <button
                                className="rounded text-sm px-4 py-1 mr-4 primary-button-colors"
                                onClick={() => navigate("/profile")}
                            >
                                My Profile
                            </button>

                            <p className="font-bold">
                                {user.pid}{" "}
                                <span
                                    className="cursor-pointer hover:text-red-900 hover:drop-shadow active:text-red-500 transition"
                                    onClick={() => {
                                        logout();
                                    }}
                                >
                                    (sign out)
                                </span>
                            </p>
                        </div>
                    ) : (
                        <p>
                            <span
                                className="cursor-pointer font-bold hover:text-red-900 hover:drop-shadow active:text-red-500 transition"
                                onClick={() => {
                                    navigate("/login");
                                }}
                            >
                                login
                            </span>
                            {" / "}
                            <span
                                className="cursor-pointer font-bold hover:text-red-900 hover:drop-shadow active:text-red-500 transition"
                                onClick={() => {
                                    navigate("/register");
                                }}
                            >
                                sign up
                            </span>
                        </p>
                    )}

                </div>
            </div>
            <div
                className="w-full"
                style={{
                    height: barRef.current ? barRef.current.offsetHeight : 80
                }}
            />
        </>
    );
};
