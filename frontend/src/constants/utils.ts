export function debounce<T extends Function>(cb: T, wait = 400) {
    let h: any = 0;
    let callable = (...args: any) => {
        clearTimeout(h);
        h = setTimeout(() => cb(...args), wait);
    };
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return <T>(<any>callable);
}
