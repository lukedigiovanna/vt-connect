import { PropsWithChildren, createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { UserAccount, UserAuth } from "../../constants/models";
import Cookies from "universal-cookie"
import { apiPost } from "../../constants/api";

type UserAccountContextType = {
    user: UserAccount | null;
    login: (user: UserAccount, auth?: UserAuth) => void;
    logout: () => void;
};

export const UserAccountContext = createContext<
    UserAccountContextType | undefined
>(undefined);

export const useUserAccount = () => {
    const context = useContext(UserAccountContext);

    if (!context) {
        throw new Error(
            "useUserAccount must be used within a UserAccountProvider"
        );
    }

    return context;
};

export const UserAccountProvider = (props: PropsWithChildren) => {
    const [user, setUser] = useState<UserAccount | null>(null);

    const cookies = useMemo(() => new Cookies(), []);

    const login = useCallback((user: UserAccount, auth?: UserAuth) => {
        setUser(user);
        if (auth) {
            cookies.set("pid", auth.pid, { path: '/' });
            cookies.set("password", auth.password, { path: '/' });
        }
    }, [cookies]);
    
    const logout = () => {
        setUser(null);
        cookies.remove("pid", { path: '/' });
        cookies.remove("password", { path: '/' });
        cookies.remove("admin_status", {path:'/'}); 
    };

    useEffect(() => {
        // check if authentication credentials are available
        const pid = cookies.get("pid");
        const password = cookies.get("password");
        const isAdmin = cookies.get("admin_status")

        if (pid !== undefined && password !== undefined ) {
            apiPost("/login", {
                pid,
                password
            }).then((res => {
                const user = res.data
                login(user, { pid, password, isAdmin});
            })).catch(err => {
                console.error(err);
            })
        }
    }, [cookies, login])

    return (
        <UserAccountContext.Provider value={{ user, login, logout }}>
            {props.children}
        </UserAccountContext.Provider>
    );
};
