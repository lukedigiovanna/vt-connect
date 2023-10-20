import { Event } from "../constants/models"

export const EventCard = (props: {event: Event}) => {
    return (
        <div className="rounded border border-black">
            <h1>
                {
                    props.event.title
                }
            </h1>
            <p>
                {
                    props.event.description
                }
            </p>
        </div>
    )
}