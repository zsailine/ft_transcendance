import { GoPlusCircle } from "react-icons/go";
import { useDashboard } from "../../../Providers/DashboardProvider";
import { useRef, useState } from "react";

const CoverInput = () => {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { setCoverImage } = useDashboard()
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleChange = (e: any) => {
        setSelectedFile(e.target?.files[0]);
        setCoverImage(e.target?.files[0]);
    }

    const style = selectedFile ? {
        backgroundImage: `url(${URL.createObjectURL(selectedFile)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    } : {
        backgroundImage: "url(/images/cover.jpg)", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <>
            <label className="block text-sm/6 font-medium text-white">
                Cover photo
            </label>
            <input
                type="file"
                onChange={handleChange}
                ref={inputRef}
                style={{ display: "none" }}
            />
            <div style={style} className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                <div className="text-center">
                    <div className="flex text-sm/6 text-gray-400">
                        <GoPlusCircle
                            className="w-20 h-20 mx-auto text-cyan-400/50 cursor-pointer"
                            onClick={() => inputRef.current?.click()}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CoverInput