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

            <div className="mx-auto my-0 max-w-4xl bg-gray-50/90 px-8 py-4 grid grid-rows-1 grid-cols-[1fr_4fr]">
                <div>
                    <h1>Filters</h1>
                    <p>
                        Could put filters here like a full text search, search by time, search by tags, chronological etc.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    {events.map((event: Event, index: number) => {
                        return <EventCard key={index} event={event} />;
                    })}
                </div>
            </div>
        </div>
    );
};
