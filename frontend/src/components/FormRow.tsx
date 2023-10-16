import { PropsWithChildren } from "react";

export const FormRow = (props: PropsWithChildren) => {
    return (
        <div className="mt-2">
            {props.children}
        </div>
    )
}