import { PropsWithChildren, createContext, useContext, useState } from "react";
import { UserAccount } from "../../constants/models";

type UserAccountContextType = {
    user: UserAccount | null,
    login: (user: UserAccount) => void,
    logout: () => void;
}

export const UserAccountContext = createContext<UserAccountContextType | undefined>(undefined);

export const useUserAccount = () => {
    const context = useContext(UserAccountContext);

    if (!context) {
        throw new Error("useUserAccount must be used within a UserAccountProvider");
    }

    return context;
}

export const UserAccountProvider = (props: PropsWithChildren) => {
    const [user, setUser] = useState<UserAccount | null>(null);

    const login = (user: UserAccount) => {
        setUser(user);
    }

    const logout = () => {
        setUser(null);
    }
    
    return (
        <UserAccountContext.Provider value={{user, login, logout}}>
            {props.children}
        </UserAccountContext.Provider>
    )
}