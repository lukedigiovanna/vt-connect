import { PropsWithChildren } from "react";

export const FormRow = (props: PropsWithChildren) => {
    return (
        <div className="font-sans">
            {props.children}
        </div>
    )
}