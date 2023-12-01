import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useState, useEffect } from "react";
import { Event } from "../constants/models";
import { apiGet, apiPost } from "../constants/api";
import { Background } from "../components/Background";
import { useUserAccount } from "../components/providers/UserAccountProvider"; 

type StatusType = 'loading' | 'success' | 'failure';

export const EventPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [status, setStatus] = useState<StatusType>("loading");
    const { user } = useUserAccount(); 

    useEffect(() => {
        (async () => {
            try {
                const result = await apiGet(`/event?id=${id}`);
                setEvent(result.data);
                setStatus("success");
            } catch (err) {
                console.error(err);
                setStatus("failure");
            }
        })();
    }, [id]);

    const signUpForEvent = async () => {
        if (user && user.pid) {
            try {
                const response = await apiPost('/event-attendee', { userPid: user.pid, eventId: id });
                if (response.status === 200) {
                    alert('Successfully signed up for the event!');
                } else {
                    throw new Error(response.statusText);
                }
            } catch (err: any) {
                if (err.response && err.response.status === 400) {
                    const errorMessage = err.response.data.message;
                    alert(errorMessage); 
                } else {
                    console.error(err);
                    alert('Error signing up for the event.');
                }
            }
        } else {
            alert('You must be signed in to sign up for an event.');
        }
    };

    return (
        <div className="relative min-h-screen">
            <Background />
            <Navbar />
            <div className="pt-16">
                {status === "loading" && <p className="text-center">Loading...</p>}
                {status === "success" && event && (
                    <div className="mx-auto max-w-4xl bg-white/80 rounded shadow-lg p-6 mt-6">
                        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                        <p className="mb-4">{event.description}</p>
                        <p className="mb-2"><strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}</p>
                        {event.endTime && <p><strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}</p>}
                        <button 
                            onClick={signUpForEvent} 
                            disabled={!user} 
                            className={`primary-button-colors mt-4 px-4 py-2 rounded ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Sign Up for Event
                        </button>
                    </div>
                )}
                {status === "failure" && <p className="text-center mt-6">No event found or something went wrong.</p>}
            </div>
        </div>
    );
};
