import { Dispatch } from "react";

export const debounce = <F extends (...args: any[]) => any>(
    func: F,
    waitFor: number
) => {
    let timeout: NodeJS.Timeout | null = null;

    const debounced = (...args: any[]) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    };

    return debounced as unknown as (...args: Parameters<F>) => ReturnType<F>;
};

export const toOrdinal = (num: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const updateState = (
    setState: Dispatch<React.SetStateAction<string>>,
    callback: (content: string) => void = () => {}
) => {
    return (e: React.ChangeEvent<any>) => {
        setState(e.target.value as string);
        callback(e.target.value);
    };
};
