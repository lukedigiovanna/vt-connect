import { PropsWithChildren } from "react";

export const FormRow = (props: PropsWithChildren<{ title: string }>) => {
  return (
    <div className="mt-2 flex flex-row">
      <p className="basis-1/5 overflow-hidden">{props.title}</p>
      <div className="basis-4/5">{props.children}</div>
    </div>
  );
};
