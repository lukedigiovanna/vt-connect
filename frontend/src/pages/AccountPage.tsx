import { useEffect } from "react";
import { useUserAccount } from "../components/providers/UserAccountProvider"
import { useNavigate } from "react-router-dom";

export const AccountPage = () => {
    // Displays information about the signed in user and incorporate an ability to 
    // manage the account such as changing bio/major/password

    const { user } = useUserAccount();

    const navigate = useNavigate();

    useEffect(() => {
        // If not signed in then navigate to home page.
        if (!user) {
            navigate("/");
        }
    }, [user, navigate])

    return (
        <>
            <h1>
            Your account: { user?.pid }
            </h1>
        </>
    )
}