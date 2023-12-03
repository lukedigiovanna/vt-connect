import { useRef, FC } from "react";
import { apiPost } from "../constants/api";

type UploadImageProps = {
    onImageUpload: (url: string) => void;
};

export const UploadImage: FC<UploadImageProps> = ({ onImageUpload }) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: any) => {
        e.preventDefault();
        const file = e.target.files ? e.target.files[0] : null;
    
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                try {
                    const base64String = reader.result;
                    const file_name = Math.random().toString(36).substring(2,7);
                    const response = await apiPost("/saveImage", { image: base64String, file_name: file_name});
                    onImageUpload(file_name);
                } catch (err) {
                    console.error("Error uploading image:", err);
                }
            };
        }
    };

    return (
        <div>
            <input 
                type="file" 
                ref={fileRef} 
                className="hidden" 
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
            />
            <button 
                onClick={() => fileRef.current?.click()} 
                className="secondary-button-colors px-4 py-2 text-sm rounded"
            >
                Upload Image
            </button>
        </div>
    );
}