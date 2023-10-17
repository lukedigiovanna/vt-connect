import React, { Dispatch, useState, useMemo } from "react";
import { majors } from "../constants/data";
import { FormRow } from "./FormRow";
import { post } from "../constants/api";
import { useNavigate } from "react-router-dom";
import { debounce } from "../constants/utils";

export const SignUpForm = () => {
    const [pid, setPID] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [major, setMajor] = useState("");
    const [bio, setBio] = useState("");

    const [validPassword, setValidPassword] = useState<boolean>(true);
    const [mismatchedPasswords, setMismatchedPasswords] =
        useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const updateState = (
        setState: Dispatch<React.SetStateAction<string>>,
        callback: (content: string) => void = () => {}
    ) => {
        return (e: React.ChangeEvent<any>) => {
            setState(e.target.value as string);
            callback(e.target.value);
        };
    };

    const valid = useMemo(() => {
        const vals = [pid, password, firstName, lastName];
        for (const val of vals) {
            if (val.length === 0) {
                return false;
            }
        }

        if (!validPassword || mismatchedPasswords) {
            return false;
        }

        return true;
    }, [pid, firstName, lastName, password, validPassword, mismatchedPasswords]);

    const validatePasswordDebounce = debounce((content: string) => {
        const regex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        setValidPassword(content.length === 0 || regex.test(content));
    }, 1000);

    const comparePasswordDebounce = debounce((content: string) => {
        setMismatchedPasswords(content.length > 0 && content !== password);
    }, 500);

    const onSubmit = (e: any) => {
        e.preventDefault();
        post("/signup", {
            pid,
            password,
            firstName,
            lastName,
            major,
            bio
        });
    };

    const navigate = useNavigate();

    return (
        <form className="form">
            <h1 className="font-bold text-2xl text-center">Sign Up</h1>
            <FormRow title="VT PID" required>
                <input
                    type="text"
                    placeholder="pid"
                    className="form-input w-full"
                    onChange={updateState(setPID)}
                />
            </FormRow>
            <FormRow title="Password" required>
                <input
                    type="password"
                    placeholder="password"
                    className="form-input w-full"
                    onChange={updateState(setPassword, (content: string) => {
                        validatePasswordDebounce(content);
                    })}
                />
            </FormRow>
            {!validPassword && password.length > 0 && (
                <span className="text-red-500 font-semibold text-sm">
                    Password must contain:
                    <ul>
                        <li>Uppercase letter</li>
                        <li>Lowercase letter</li>
                        <li>Special character</li>
                        <li>Is at least 8 characters long</li>
                    </ul>
                </span>
            )}
            <FormRow title="Confirm Password" required>
                <input
                    type="password"
                    placeholder="confirm password"
                    className="form-input w-full"
                    onChange={(e) => {
                        const content = e.target.value
                        if (content === password) {
                            setMismatchedPasswords(false);
                        }
                        comparePasswordDebounce(content);
                    }}
                />
            </FormRow>
            {mismatchedPasswords && (
                <p className="text-red-500 font-semibold text-sm">
                    Passwords do not match
                </p>
            )}
            <FormRow title="Name" required>
                <input
                    type="text"
                    placeholder="first name"
                    className="w-1/2 form-input"
                    onChange={updateState(setFirstName)}
                />
                <input
                    type="text"
                    placeholder="last name"
                    className="w-1/2 form-input"
                    onChange={updateState(setLastName)}
                />
            </FormRow>
            <FormRow title="Major">
                <select
                    name="majors"
                    className="w-full form-input"
                    defaultValue={"default"}
                    onChange={updateState(setMajor)}
                >
                    <option disabled value="default">
                        {" "}
                        -- select a major --{" "}
                    </option>
                    {majors.map((major: string) => {
                        const id = major.toLowerCase().replace(" ", "_");
                        return (
                            <option value={major} key={id}>
                                {" "}
                                {major}{" "}
                            </option>
                        );
                    })}
                </select>
            </FormRow>
            <FormRow title="Bio">
                <textarea
                    className="w-full form-input resize-none"
                    placeholder="share your interests!"
                    onChange={updateState(setBio)}
                />
            </FormRow>

            <p className="text-sm text-center text-gray-800">
                Already have an account?{" "}
                <span
                    className="font-bold cursor-pointer hover:text-red-800 transition"
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    Log in
                </span>
            </p>

            {errorMessage && (
                <p className="text-center text-red-500 text-sm font-semibold mt-6">
                    * {errorMessage} *
                </p>
            )}

            <button
                className="form-submit-button"
                onClick={onSubmit}
                disabled={!valid}
            >
                Submit
            </button>
        </form>
    );
};
