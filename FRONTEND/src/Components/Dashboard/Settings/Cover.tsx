import { GoPlusCircle } from "react-icons/go";
import { useDashboard } from "../../../Providers/DashboardProvider";
import { useRef, useState, useEffect } from "react";
import { getImageUrlFromBlob } from "../../../Utils/blob";

interface ProfilProps {
    hoverEffect: string;
}

const CoverInput = ({hoverEffect} : ProfilProps) => {

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { coverImage, setCoverImage } = useDashboard()
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [coverURL, setCoverURL] = useState<string | null>(null);


    useEffect(() => {
        let url: string | null = getImageUrlFromBlob(coverImage?.data);
        setCoverURL(url);
    }, [coverImage]);

    const handleChange = (e: any) => {
        setSelectedFile(e.target?.files[0]);
        setCoverImage(e.target?.files[0]);
    }

    const style = selectedFile ? {
        backgroundImage: `url(${URL.createObjectURL(selectedFile)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    } : {
        backgroundImage: `url(${coverURL ? coverURL : "/images/cover.jpg"})`,
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
                            className={`w-20 h-20 mx-auto text-cyan-400 cursor-pointer ${hoverEffect}`}
                            onClick={() => inputRef.current?.click()}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CoverInput