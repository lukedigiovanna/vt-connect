import { useParams } from "react-router-dom"
import { Navbar } from "../components/Navbar";
import { useState, useEffect } from "react";
import { Event } from "../constants/models";
import { get } from "../constants/api";

type StatusType = 'loading' | 'success' | 'failure';

export const EventPage = () => {
    const { id } = useParams();

    const [event, setEvent] = useState<Event | null>(null);
    const [status, setStatus] = useState<StatusType>("loading");

    useEffect(() => {
        (async () => {
            try {
                const result = await get(`/event?id=${id}`);
                setEvent(result.data);
                setStatus("success");
            }
            catch (err: any) {
                setStatus("failure");
            }
        })();
    }, [id])

    return (
        <>
            <Navbar />
            {
                status === "loading" &&
                <p>
                    Loading...
                </p>
            }
            {
                status === "success" && event &&
                <p>
                    {event.title}
                </p>
            }
            {
                status === "failure" &&
                <p>
                    No event found or something went wrong.
                </p>
            }
        </>    
    )
}