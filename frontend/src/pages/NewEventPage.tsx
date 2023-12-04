import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { Navbar } from "../components/Navbar";
import { UploadImage } from "../components/UploadImage";
import { useUserAccount } from "../components/providers/UserAccountProvider";
import { apiPost } from "../constants/api";

export const NewEventPage = () => {
    const { user } = useUserAccount();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [locationId, setLocationId] = useState<number | null>(null);

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
    

    const handleLocationChange = (e:any) => {
        // Assuming the value of each option is the location ID
        setLocationId(parseInt(e.target.value, 10));
        console.log(locationId)
    };
    
    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e: any) => {
        setDescription(e.target.value);
    };

    const handleStartChange = (e: any) => {
        setStart(e.target.value);
    };

    const handleEndChange = (e: any) => {
        setEnd(e.target.value);
    };

    const handleImageChange = (url: any) => {
        setImageURL(url);
    };


    const addEvent = async (e: any) => {
        e.preventDefault();
        console.log(imageURL)
        if (imageURL !== "") { 
            try {
                const newEvent = (
                    await apiPost("/addEvent", {
                        title, 
                        description, 
                        start, 
                        end, 
                        imageURL, 
                        user, 
                        locationId
                    })
                ).data;
                navigate("/");
            } catch (err) {
                console.log("error in creating a new event");
            }
        }
        console.log("you took an L")
    };

    return (
        <>
            <Navbar />
            <Background />

            <div className="flex flex-col mx-auto max-w-3xl border p-4 mt-4 border-gray-500 shadow-xl rounded bg-gray-50/75">
                <h1 className="font-bold text-2xl mb-2">
                    New Event
                </h1>
                <form onSubmit={addEvent}>
                    <input 
                        placeholder="title"
                        className="border px-3 py-1 rounded outline-gray-800 active:outline-1 mb-1"
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <input 
                        placeholder="description"
                        className="border px-3 py-1 rounded outline-gray-800 mb-1"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <div className="flex">
                        <input 
                            type="datetime-local"
                            className="mb-1 rounded px-2"
                            value={start}
                            onChange={handleStartChange}
                        />
                        <span className="px-4">to</span>
                        <input 
                            type="datetime-local"
                            className="mb-1 rounded px-2"
                            value={end}
                            onChange={handleEndChange}
                        />
                    </div>
                    <div className="flex">
                        <select 
                            className="border px-3 py-1 rounded outline-gray-800 active:outline-1 mb-1"
                            value={locationId !== null ? locationId : ''}
                            onChange={handleLocationChange}
                        >
                            {locationOptions.map((location) => (
                                <option key={location.id} value={location.id}>{location.name}</option>
                            ))}
                        </select>

                        <UploadImage onImageUpload={handleImageChange} />
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            className="primary-button-colors px-4 py-2 text-sm rounded"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}