import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../constants/api";

export default () => {
    const navigate = useNavigate();

    const events = useState<any[]>([]);

    useEffect(() => {
        const events = get('/events').then((value) => {
            console.log(value);
        });
    }, []);

    return (
        <>  

        </>
    )
}