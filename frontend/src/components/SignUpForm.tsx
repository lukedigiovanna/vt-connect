import React, { Dispatch, useState } from "react";
import { majors } from "../constants/data";
import { FormRow } from "./FormRow";

const updateState = (
  setState: Dispatch<React.SetStateAction<string>>,
  callback: (content: string) => void = () => {}
) => {
  return (e: React.ChangeEvent<any>) => {
    setState(e.target.value as string);
    callback(e.target.value);
  };
};

export const SignUpForm = () => {
  const [pid, setPID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [major, setMajor] = useState("");
  const [bio, setBio] = useState("");

  const validate: () => boolean = () => {
    const vals = [pid, firstName, lastName, major, bio];
    for (const val in vals) {
      if (val.length === 0) {
        return false;
      }
    }
    return true;
  };

  const onSubmit = () => {
    validate();
  };

  return (
    <form className="form">
      <h1 className="font-bold text-2xl text-center">Sign Up</h1>
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
      <FormRow title="Confirm">
        <input
          type="password"
          placeholder="confirm password"
          className="form-input w-full"
          onChange={updateState(setConfirmPassword)}
        />
      </FormRow>
      <FormRow title="Name">
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
        <span className="font-bold cursor-pointer hover:text-red-800 transition">
          Log in
        </span>
      </p>

      <button
        className="block mx-auto text-gray-100 w-64 bg-zinc-900 hover:bg-zinc-700 active:bg-red-800 py-2 mt-10 transition"
        onClick={onSubmit}
      >
        Submit
      </button>
    </form>
  );
};
