import { useUserAccount } from "./providers/UserAccountProvider";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { user, logout } = useUserAccount();
    console.log(user);

    const navigate = useNavigate();

    return (
        <div className="flex items-center px-16 w-full h-20 bg-gray-100/50 fixed top-0">
            <div className="relative w-full flex items-center">
                {/* Title */}
                <h1
                    className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center font-bold text-3xl text-gray-800 cursor-pointer"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <img src="vt-logo.png" alt="VT" className="w-14" /> Connect
                </h1>

                {/* Spacer */}
                <div className="flex-grow"></div>

                {/* User Info/Login */}
                {user ? (
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
                ) : (
                    <p
                        className="cursor-pointer font-bold hover:text-red-900 hover:drop-shadow active:text-red-500 transition"
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        login
                    </p>
                )}
            </div>
        </div>
    );
};
