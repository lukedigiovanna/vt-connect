import { useRef, FC } from "react";

type UploadImageProps = {
    onImageUpload: (url: string) => void;
};

export const UploadImage: FC<UploadImageProps> = ({ onImageUpload }) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const fileURL = URL.createObjectURL(file);
            onImageUpload(fileURL);
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