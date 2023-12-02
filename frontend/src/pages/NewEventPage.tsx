import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { Navbar } from "../components/Navbar";
import { UploadImage } from "../components/UploadImage";
import { useUserAccount } from "../components/providers/UserAccountProvider";
import { useEffect } from "react";

export const NewEventPage = () => {
    const { user } = useUserAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate])

    return (
        <>
            <Navbar />
            <Background />

            <div className="flex flex-col mx-auto max-w-3xl border p-4 mt-4 border-gray-500 shadow-xl rounded bg-gray-50/75">
                <h1 className="font-bold text-2xl mb-2">
                    New Event
                </h1>
                <input placeholder="title" className="border px-3 py-1 rounded outline-gray-800 active:outline-1 mb-1" />
                <textarea placeholder="description" className="border px-3 py-1 rounded outline-gray-800 mb-1" />
                <div className="flex">
                    <input type="datetime-local" className="mb-1 rounded px-2" />
                    <span className="px-4">
                        to
                    </span>
                    <input type="datetime-local" className="mb-1 rounded px-2" />
                </div>
                <input placeholder="image url" className="border px-3 py-1 rounded outline-gray-800 active:outline-1 mb1" />
                <div className="flex justify-end mt-2">
                    <button className="primary-button-colors px-4 py-2 text-sm rounded">
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}