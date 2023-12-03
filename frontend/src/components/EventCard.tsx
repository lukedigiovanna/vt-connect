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
    const hour = props.date.getHours();
    const meridiem = hour >= 12 ? "PM" : "AM";
    const timeHour = hour % 12 === 0 ? 12 : hour % 12;
    const minutes = String(props.date.getMinutes()).padStart(2, "0");

    return (
        <span className="italic">
            {timeHour}:{minutes} {meridiem}
        </span>
    );
};

export const EventCard = (props: { event: Event }) => {
    const navigate = useNavigate();

    return (
        <div className="rounded border border-black p-5 max-w-xl w-full mb-4 cursor-pointer bg-gray-100/75" onClick={() => {
            navigate(`/event/${props.event.id}`)
        }}>
            <h1 className="font-bold text-xl">{props.event.title}</h1>
            <p>
                <DateLine date={props.event.startTime} />
                <br />
                <TimeLine date={props.event.startTime} />
                {props.event.endTime && (
                    <>
                        {" - "}
                        <TimeLine date={props.event.endTime} />
                    </>
                )}
            </p>
            <div className="flex w-full justify-between px-8">
                <p>{props.event.description}</p>
                {"https://dbms-final.s3.us-east-2.amazonaws.com/" + props.event.imageUrl && (
                    <img
                        src={"https://dbms-final.s3.us-east-2.amazonaws.com/" + props.event.imageUrl}
                        alt=""
                        className="w-32 self-end"
                    />
                )}
            </div>
        </div>
    );
};
