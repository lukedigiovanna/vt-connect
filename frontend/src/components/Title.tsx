import { useNavigate } from "react-router-dom"

export const Title = () => {
    const navigate = useNavigate();

    return (
        <h1 className="flex justify-center items-center font-bold text-3xl text-gray-800 my-5 cursor-pointer" onClick={() => {
            navigate("/");
        }}>
            <img src="vt-logo.png" alt="VT" className="w-14" /> Connect
        </h1>
    )
}