import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Background } from "../components/Background";
import { Navbar } from "../components/Navbar";
import { apiGet } from "../constants/api";
import { Event, UserAccount, eventDataToEvent } from "../constants/models";
import { EventCard } from "../components/EventCard";

type Status = "loading" | "success" | "error";

export const UserPage = () => {
    const { pid } = useParams();

    const [status, setStatus] = useState<Status>("loading");
    const [user, setUser] = useState<UserAccount | null>(null);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        apiGet(`/user?pid=${pid}`)
        .then((result) => {
            setUser(result.data);
            setStatus("success");
            apiGet(`/events?hostedBy=${pid}`)
            .then((result) => {
                setEvents(result.data.map((e: any) => eventDataToEvent(e)));
            })
            .catch(err => {
                console.log(err)
            });
        })
        .catch(_ => {
            setStatus("error");
        })
    }, [pid])

    return (
        <div className="relative min-h-screen">
            <Background />
            <Navbar />

            {
                status === "loading" &&
                <h1>
                    Loading...
                </h1>
            }
            {
                status === "error" &&
                <div className="flex flex-row justify-center">
                    <h1 className="text-red-500 font-bold margin-auto rounded bg-black/50 p-4 mt-16">
                        No user found with id "{pid}"
                    </h1>
                </div>
            }
            {
                status === "success" && user &&
                <div className="flex flex-row justify-center">
                    <div className="rounded bg-white/50 my-8 w-[50%] min-w-[500px] p-6">
                        <div className="flex flex-row">
                            <img src="/profile.png" alt="" className="w-32"/>
                            <div className="ml-8">
                                <h1 className="font-bold text-xl">
                                    {user.firstName} {user.lastName} <span className="text-lg font-semibold">({pid})</span>
                                </h1>
                                <p>
                                    <b>Major:</b> {user.major}
                                </p>
                                {
                                    user.bio ?
                                    <p>
                                        <b>Bio:</b> {user.bio}
                                    </p>
                                    :
                                    <p>
                                        <b>Bio:</b> <i>Nothing to see here!</i>
                                    </p>
                                }
                            </div>
                        </div>
                        <hr className="my-6" />
                        <div>
                            <h1 className="font-bold text-xl">
                                Events
                            </h1>
                            {
                                events.length === 0 &&
                                <p className="italic">
                                    It seems there's nothing here!
                                </p>
                            }
                            <div className="flex flex-col items-center">
                                {
                                    events.map(event => {
                                        return (
                                            <EventCard event={event} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}