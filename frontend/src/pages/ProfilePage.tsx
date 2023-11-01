import { useParams } from "react-router-dom";

export const ProfilePage = () => {
    // Should display details about the user with the pid from the url
    const { pid } = useParams();

    return (
        <> 
            <p> user: {pid} </p>
        </>
    )
}