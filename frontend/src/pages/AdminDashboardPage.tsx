import { useEffect } from "react";
import { useUserAccount } from "../components/providers/UserAccountProvider"
import { Navbar } from "../components/Navbar";

export const AdminDashboardPage = () => {
    const { user } = useUserAccount();
    
    useEffect(() => {
        
    }, []);

    return (
        <>
            <Navbar />
            Admin Page
        </>
    )
}