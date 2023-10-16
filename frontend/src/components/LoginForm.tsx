import { useNavigate } from "react-router-dom";
import { FormRow } from "./FormRow";

export const LoginForm = () => {
    const onSubmit = () => {

    }

    const navigate = useNavigate();

    return (
        <form className="form">
             <h1 className="font-bold text-2xl text-center">Login</h1>
            <FormRow title="VT PID">
                <input type="text" placeholder="pid" className="form-input w-full" />
            </FormRow>
            <FormRow title="Password">
                <input type="text" placeholder="password" className="form-input w-full" />
            </FormRow>
            <p className="text-sm text-center text-gray-800">
                Not a member?{" "}
                <span className="font-bold cursor-pointer hover:text-red-800 transition" onClick={() => {
                    navigate("/register")
                }}>
                    Sign up
                </span>
            </p>
            <button
                className="form-submit-button"
                onClick={onSubmit}
            >
                Login
            </button>
        </form>
    );
};
