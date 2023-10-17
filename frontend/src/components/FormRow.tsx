import { PropsWithChildren } from "react";

export const FormRow = (
    props: PropsWithChildren<{ title: string; required?: boolean }>
) => {
    return (
        <div className="mt-4 flex flex-col">
            <p className="basis-1/5 overflow-hidden text-md font-semibold">
                {props.title}
                {props.required && (
                    <span className="text-red-600 font-bold"> *</span>
                )}
            </p>
            <div className="basis-4/5">{props.children}</div>
        </div>
    );
};
