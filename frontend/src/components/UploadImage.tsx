import { useRef } from "react"

export const UploadImage = () => {
    const fileRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <input type="file" ref={fileRef} className="hidden" accept=".png,.jpg,.jpeg"/>
            <button onClick={() => {
                fileRef.current?.click();
            }} className="secondary-button-colors px-4 py-2 text-sm rounded">
                Upload Image
            </button>
        </div>
    )
}