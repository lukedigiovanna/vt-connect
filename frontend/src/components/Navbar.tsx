import { useUserAccount } from "./providers/UserAccountProvider"
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { user } = useUserAccount();
    console.log(user);

    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center px-16 w-full bg-gray-100">
            <div /> 

            <h1 className="flex justify-center items-center font-bold text-3xl text-gray-800 my-5 cursor-pointer" onClick={() => {
                navigate("/");
            }}>
                <img src="vt-logo.png" alt="VT" className="w-14" /> Connect
            </h1>
            
            {
                user ?
                <p>

                </p>
                :
                <p className="cursor-pointer font-bold hover:text-red-900 hover:drop-shadow active:text-red-500 transition" onClick={() => {
                    navigate("/login");
                }}>
                    login
                </p>
            }
        </div>
    )
}