import { useEffect, useState } from "react";
import { apiGet } from "../constants/api";
import { EventCard } from "../components/EventCard";
import { Navbar } from "../components/Navbar";
import { Event, eventDataToEvent } from "../constants/models";
import { Background } from "../components/Background";

export const HomePage = () => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        apiGet("/events")
            .then(res => {
                const events = res.data;
                setEvents(events.map((eventData: any) => eventDataToEvent(eventData)));
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const sortEventsAlphabetically = () => {
        const sortedEvents = [...events].sort((a, b) => a.title.localeCompare(b.title));
        setEvents(sortedEvents);
    };

    const sortEventsByDate = () => {
        const sortedEvents = [...events].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        setEvents(sortedEvents);
    };

    const sortEventsByDateReverse = () => {
        const sortedEvents = [...events].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        setEvents(sortedEvents);
    };

    return (
        <div>
            <Background />
            <Navbar />

            <div className="mx-auto my-0 max-w-4xl bg-gray-50/90 px-8 py-4 grid grid-rows-1 grid-cols-[1fr_4fr]">
                <div>
                    <button onClick={sortEventsAlphabetically} className="primary-button-colors px-6 py-8 text-sm rounded">
                        Sort Alphabetically
                    </button>
                    <button onClick={sortEventsByDate} className="primary-button-colors mt-8 px-10 py-5 text-sm rounded">
                        Sort by Date (Newest First)
                    </button>
                    <button onClick={sortEventsByDateReverse} className="primary-button-colors mt-8 px-10 py-8 text-sm rounded">
                        Sort by Date (Oldest First)
                    </button>
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
