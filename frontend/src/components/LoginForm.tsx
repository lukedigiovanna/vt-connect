import { useNavigate } from "react-router-dom";
import { FormRow } from "./FormRow";
import { updateState } from "../constants/utils";
import { useMemo, useState } from "react";
import { apiPost } from "../constants/api";
import { useUserAccount } from "./providers/UserAccountProvider";
import { UserAccount } from "../constants/models";
import Cookies from "universal-cookie";


export const LoginForm = () => {
    const [pid, setPID] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState(false)


    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { login } = useUserAccount();

    const cookies = useMemo(() => new Cookies(), []);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const user = (
                await apiPost("/login", {
                    pid,
                    password,
                    isAdmin
                })
            ).data as UserAccount;

            cookies.set("admin_status", user.isAdmin, {path:'/'})

            setIsAdmin(user.isAdmin)
            login(user, { pid, password, isAdmin});
            console.log("Admin " + isAdmin)
            
            navigate("/");
        } catch (err: any) {
            let message = "Something went wrong";
            if (err.response) {
                message = err.response.data as string;
            }
            setErrorMessage(message);
        }
    };

    const navigate = useNavigate();

    const valid = useMemo(() => {
        return pid.length > 0 && password.length > 0;
    }, [pid, password]);

    return (
        <form className="form">
            <h1 className="font-bold text-2xl text-center">Login</h1>
            <FormRow title="VT PID">
                <input
                    type="text"
                    placeholder="pid"
                    className="form-input w-full"
                    onChange={updateState(setPID)}
                />
            </FormRow>
            <FormRow title="Password">
                <input
                    type="password"
                    placeholder="password"
                    className="form-input w-full"
                    onChange={updateState(setPassword)}
                />
            </FormRow>
            <p className="text-sm text-center text-gray-800">
                Not a member?{" "}
                <span
                    className="font-bold cursor-pointer hover:text-red-800 transition"
                    onClick={() => {
                        navigate("/register");
                    }}
                >
                    Sign up
                </span>
            </p>

            {errorMessage && (
                <p className="text-center text-red-500 text-sm font-semibold mt-6">
                    {errorMessage}
                </p>
            )}

            <button
                className="form-submit-button"
                onClick={onSubmit}
                disabled={!valid}
            >
                Login
            </button>
        </form>
    );
};
