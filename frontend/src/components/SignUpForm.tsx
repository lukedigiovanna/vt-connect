
import { majors } from "../constants/data";
import { FormRow } from "./FormRow";

export const SignUpForm = () => {
    return (
        <form className="block max-w-sm mx-auto">
            <FormRow>
                <label>
                    VT PID: 
                </label>
                <input type='text' placeholder="pid" />
            </FormRow>
            <FormRow>
                <label>
                    Name:  
                </label>
                <input type='text' placeholder="first name" />
                <input type='text' placeholder="last name" />
            </FormRow>
            <FormRow>
                <label>
                    Major
                </label>
                <select name='majors'>
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
            <br />
        </form> 
    )
}