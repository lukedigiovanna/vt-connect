import { FormRow } from "./FormRow";

export const LoginForm = () => {
    return (
        <form className="form">
            <FormRow title="VT PID">
                <input type="text" placeholder="pid" className="form-input" />
            </FormRow>
            <FormRow title="Password">
                <input type="text" placeholder="password" className="form-input" />
            </FormRow>
        </form>
    );
};
