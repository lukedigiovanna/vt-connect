import { Event } from "../constants/models"
import { months } from "../constants/data"
import { toOrdinal } from "../constants/utils";

const DateLine = (props: {date: Date}) => {
    const month = months[props.date.getMonth()];
    const day = toOrdinal(props.date.getDate());
    const year = props.date.getFullYear();
    
    return (
        <span className="italic">
            {month} {day}, {year}
        </span>
    )
}

const TimeLine = (props: {date: Date}) => {
    const hour = props.date.getHours();
    const meridiem = hour >= 12 ? "PM" : "AM";
    const timeHour = hour % 12 === 0 ? 12 : hour % 12;
    const minutes = String(props.date.getMinutes()).padStart(2, '0');

    return (
        <span className="italic">
            {timeHour}:{minutes} {meridiem}
        </span>
    )
}

export const EventCard = (props: {event: Event}) => {
    return (
        <div className="rounded border border-black p-5 max-w-xl my-4">
            <h1 className="font-bold text-xl">
                {
                    props.event.title
                }
            </h1>
            <p>
                <DateLine date={props.event.startTime} />
                <br />
                <TimeLine date={props.event.startTime} />
                {
                    props.event.endTime && 
                    <>
                        {" - "}
                        <TimeLine date={props.event.endTime} />
                    </>
                }
            </p>
            <div className="flex w-full justify-between px-8">
                <p>
                    {
                        props.event.description
                    }
                </p>
                {
                    props.event.imageUrl &&
                    <img src={props.event.imageUrl} alt="" className="w-32 self-end" />
                }
            </div>
        </div>
    )
}