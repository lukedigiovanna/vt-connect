
import { majors } from "../constants/data";
import { FormRow } from "./FormRow";

export const SignUpForm = () => {
    return (
        <form className="form">
            <h1 className="font-bold text-lg text-center">
                Sign Up
            </h1>
            <FormRow title="VT PID">
                <input type='text' placeholder="pid" className="form-input" />
            </FormRow>
            <FormRow title="Password">
                <input type="password" placeholder="password" className="form-input" />
            </FormRow>
            <FormRow title="Name">
                <input type='text' placeholder="first name" className="w-1/2 form-input" />
                <input type='text' placeholder="last name" className="w-1/2 form-input" />
            </FormRow>
            <FormRow title="Major">
                <select name='majors' className="w-full form-input">
                    <option disabled selected> -- select an option -- </option>
                    {
                        majors.map((major: string) => {
                            const id = major.toLowerCase().replace(" ", "_");
                            return (
                                <option value={id} key={id}> {major} </option>
                            )
                        })
                    }
                </select>
            </FormRow>
            <FormRow title="Bio">
                <textarea className="w-full form-input resize-none" placeholder="share your interests!" />
            </FormRow>

            <p className="text-sm italic text-center text-gray-800">
                Already have an account? <span className="font-bold cursor-pointer hover:text-red-800 transition">Log in</span>
            </p>

            <button className="block mx-auto text-gray-100 w-64 bg-zinc-900 hover:bg-zinc-700 active:bg-red-800 py-2 mt-10 transition ">
                Submit
            </button>
        </form> 
    )
}