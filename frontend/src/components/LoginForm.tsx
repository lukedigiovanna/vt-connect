import { FormRow } from "./FormRow";

export const LoginForm = () => {
    return (
        <form className="form">
            <FormRow>
                <input type="text" placeholder="pid" className="form-input" />
            </FormRow>
        </form>
    );
};
