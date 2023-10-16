import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { get } from "../constants/api";

export const HomePage = () => {
  // const navigate = useNavigate();

  const [events, setEvents] = useState<unknown[]>([]);

  useEffect(() => {
    get("/events").then((value) => {
      console.log(value);
    });
  }, []);

  return (
    <div>
      {events.map((value: any, index: number) => {
        return <p key={index}>{value}</p>;
      })}
    </div>
  );
};
