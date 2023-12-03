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
                    const response = await apiPost("/saveImage", { image: base64String });
                    const { imageUrl } = response.data;
                    onImageUpload(imageUrl);
                } catch (err) {
                    console.error("Error uploading image:", err);
                }
            };
        }
    };


    // const handleFileChange = async (e: any) => {
    //     e.preventDefault();
    //     const file = e.target.files ? e.target.files[0] : null;
    //     console.log(file)
    //     if (file) {
    //         const formData = new FormData();
    //         formData.append('file', file);
            
    //         try {
    //             const newEvent = (
    //                 await apiPost("/saveImage", {
    //                     formData
    //                 })
    //             ).data;
    //             // const { imageUrl } = response.data;
    //             // onImageUpload(imageUrl);
    //         } catch (err) {
    //             console.error("Error uploading image:", err);
    //         }
    //     }
    // };

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