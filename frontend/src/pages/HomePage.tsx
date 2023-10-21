import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { get } from "../constants/api";
import { EventCard } from "../components/EventCard";
import { Navbar } from "../components/Navbar";
import { Event, eventDataToEvent } from "../constants/models";
import { Background } from "../components/Background";

export const HomePage = () => {
    // const navigate = useNavigate();

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        (async () => {
            const result = await get("/events");
            setEvents(
                result.data.map((eventData: any) => eventDataToEvent(eventData))
            );
        })();
    }, []);

    return (
        <div>
            <Background />
            <Navbar />

            <div className="mx-auto my-0 max-w-4xl bg-gray-50/25 p-4 flex flex-col items-center">
                {events.map((event: Event, index: number) => {
                    return <EventCard key={index} event={event} />;
                })}
            </div>
        </div>
    );
};
