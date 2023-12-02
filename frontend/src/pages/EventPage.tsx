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


    const cookies = useMemo(() => new Cookies(), []);

    const adminStatus = (cookies.get("admin_status"))
    const navigate = useNavigate();

    const deleteEvent = () => {
        // handle deleting event here if admin status is true 
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
                // If the user clicks "Yes, delete it!", send a request and go back to the previous page
                sendDeleteRequest();
            }
        });
    }

    const sendDeleteRequest = async() => {
        try {
            const response = await apiPost("/deleteEvent", { eventId: id });

            if (response.status === 200) {
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
                className={`primary-button-colors mt-4 mr-2 px-4 py-2 rounded ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Sign Up for Event
            </button>
            {adminStatus && (
  <button
    onClick={deleteEvent}
    className="primary-button-colors mt-4 px-4 py-2 rounded"
  >
    Remove Event
  </button>
)}

        </div>
    )}
    {status === "failure" && <p className="text-center mt-6">No event found or something went wrong.</p>}
</div>
        </div>
    );
};
