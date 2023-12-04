import { useParams, useNavigate} from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useState, useEffect, useMemo} from "react";
import { Event } from "../constants/models";
import { apiGet, apiPost } from "../constants/api";
import { Background } from "../components/Background";
import { useUserAccount } from "../components/providers/UserAccountProvider"; 
import Cookies from "universal-cookie";
import Swal from "sweetalert2";

type StatusType = 'loading' | 'success' | 'failure';

export const EventPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [status, setStatus] = useState<StatusType>("loading");
    const { user } = useUserAccount(); 
    const [numberOfAttendees, setNumberofAttendees] = useState(0)
    const [userAlreadySignedUp, setUserAlreadySignedUp] = useState(false)

    const cookies = useMemo(() => new Cookies(), []);

    const adminStatus = (cookies.get("admin_status"))
    const navigate = useNavigate();

    const user_pid = cookies.get("pid")

    const deleteEvent = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                sendDeleteRequest();
            }
        });
    }

    const unregisterFromEvent = async() => {

        try {

            const response = await apiPost("/remove-from-event", {"user_pid": user_pid, "event_id": id})

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'You successfully unregistered for this event!',
                    confirmButtonText: 'Close',
                    showCloseButton: true,
                });

                navigate("/")
            }

        } catch (error) {

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Oops, an invalid error occured, please try again later!',
                confirmButtonText: 'Close',
                showCloseButton: true,
            });
        }

    }

    const sendDeleteRequest = async() => {
        try {
            const response = await apiPost("/deleteEvent", { eventId: id });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'The event was successfully deleted!',
                    confirmButtonText: 'Close',
                    showCloseButton: true,
                });
                
            
                navigate("/");
            }
            else {
                Swal.fire({'icon': 'error', 
            'title': 'Oops', 
        'text': "Something went wrong!"})
            }
        } catch (error) {
            Swal.fire({'icon': 'error', 
            'title': 'Oops', 
        'text': "Something went wrong!"})

        console.log("error " + error)
        }
        
    }

    useEffect(() => {
        (async () => {
            try {
                const result = await apiGet(`/event?id=${id}`);
                setEvent(result.data);
                setStatus("success");
                const grab_event_attendee_info = await apiGet(`/event_attendees?id=${id}&user_pid=${user_pid}`)

                console.log("grab event " + grab_event_attendee_info.data.num_attendees)
                if (grab_event_attendee_info.data.user_signed_up) {
                    setUserAlreadySignedUp(true)
                    setNumberofAttendees(grab_event_attendee_info.data.num_attendees)
                }
                else {  
                    setNumberofAttendees(grab_event_attendee_info.data.num_attendees)

                }
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
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Successfully Signed up For Event!",
                        showConfirmButton: true,
                    });
                } else {
                    throw new Error(response.statusText);
                }
            } catch (err: any) {
                if (err.response && err.response.status === 400) {
                    const errorMessage = err.response.data.message;
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `${errorMessage || 'Please try again.'}`,
                    });
                } else {
                    console.error(err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error Signing Up for Event!',
                    });                }
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'You Must Be Signed In To Sign Up for an Event!',
            });
        }
    };

    return (
        <div className="relative min-h-screen">
            <Background />
            <Navbar />
            <div className="pt-16">
                {
                    status === "loading" && 
                    <p className="text-center">Loading...</p>
                }
                {
                    status === "success" && event &&
                    <div className="mx-auto max-w-4xl bg-white/80 rounded shadow-lg p-6 mt-6">
                        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                        <div className="flex flex-row">
                            <div>
                                <p className="mb-4">
                                    {event.description}
                                </p>
                                <p>
                                    <strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}
                                </p>
                                {
                                    event.endTime && 
                                    <p>
                                        <strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}
                                    </p>
                                }
                                <p className="mt-2">
                                    <strong>Hosted By: </strong>
                                    <a href={`/user/${event.hostPid}`} className="text-blue-800 font-semibold hover:text-blue-400 active:text-red-300 transition"> {event.hostPid} </a>
                                </p>
                                <p className="mt-2">
                                    <strong>Number of Attendees: </strong>
                                    {numberOfAttendees}
                                </p>
                            </div>
                            {
                                event.imageUrl && (
                                <img
                                    src={event.imageUrl}
                                    alt=""
                                    className="w-64 self-end"
                                />
                            )}
                        </div>
                        

<div>
    <button
        onClick={signUpForEvent}
        disabled={!user}
        className={`primary-button-colors mt-4 mr-2 px-4 py-2 rounded ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
        Sign Up for Event
    </button>

    {userAlreadySignedUp && (
        <button
            onClick={unregisterFromEvent}
            className="primary-button-colors mt-4 px-4 py-2 rounded"
        >
            Unregister from Event
        </button>
    )}
</div>

{adminStatus && (
    <div>
        <button
            onClick={deleteEvent}
            className="primary-button-colors mt-4 px-4 py-2 rounded"
        >
            Remove Event
        </button>
    </div>
)}


                    </div>
                }
                {
                    status === "failure" && 
                    <p className="text-center mt-6">No event found or something went wrong.</p>
                }
            </div>
        </div>
    );
};
