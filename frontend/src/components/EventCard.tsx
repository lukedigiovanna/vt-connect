import { Event } from "../constants/models";
import { months } from "../constants/data";
import { toOrdinal } from "../constants/utils";
import { useNavigate } from "react-router-dom";

const DateLine = (props: { date: Date }) => {
    const month = months[props.date.getMonth()];
    const day = toOrdinal(props.date.getDate());
    const year = props.date.getFullYear();

    return (
        <span className="italic">
            {month} {day}, {year}
        </span>
    );
};

const TimeLine = (props: { date: Date }) => {
    let hour = props.date.getHours() + 5;

    if (hour >= 24) {
        hour -= 24;
    }

    const meridiem = hour >= 12 ? "PM" : "AM";
    const timeHour = hour % 12 === 0 ? 12 : hour % 12;
    const minutes = String(props.date.getMinutes()).padStart(2, "0");

    return (
        <span className="italic">
            {timeHour}:{minutes} {meridiem}
        </span>
    );
};

const locationOptions = [
    { id: 0, name: "McBryde Hall" },
    { id: 1, name: "D2" },
    { id: 2, name: "Torgersen Hall" },
    { id: 3, name: "Squires Student Center" },
    { id: 4, name: "Turner Place" },
    { id: 5, name: "West Ambler Johnston Hall" },
    { id: 6, name: "Slusher Hall" },
    { id: 7, name: "Owens Food Court" },
    { id: 8, name: "Drillfield" },
    { id: 9, name: "Duck Pond" },
];

const getLocationNameById = (locationId: any) => {
    const location = locationOptions.find(loc => loc.id === locationId);
    return location ? location.name : "Unknown location";
};

export const EventCard = (props: { event: Event }) => {
    const navigate = useNavigate();

    return (
        <div className="rounded border border-black p-5 max-w-xl w-full mb-4 cursor-pointer bg-gray-100/75" onClick={() => {
            navigate(`/event/${props.event.id}`)
        }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h1 className="font-bold text-xl">{props.event.title}</h1>
                    <h2>
                        <DateLine date={props.event.startTime} />
                        <br />
                        <TimeLine date={props.event.startTime} />
                        {props.event.endTime && (
                            <>
                                {" - "}
                                <TimeLine date={props.event.endTime} />
                            </>
                        )}
                    </h2>
                    <h3>{getLocationNameById(props.event.locationId)}</h3>
                    <p>{props.event.description}</p>
                </div>
                <div className="flex justify-center items-center">
                    {props.event.imageUrl && (
                        <img
                            src={"https://dbms-final.s3.us-east-2.amazonaws.com/" + props.event.imageUrl}
                            alt={props.event.title}
                            className="w-32 h-auto md:w-48 md:h-auto self-end"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
