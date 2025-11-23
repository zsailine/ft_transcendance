import Avatar from "./Avatar";
import CoverInput from "./Cover";
import InputText from "./InputText";

interface ProfilProps {
    handleSubmit: (e: any) => void;
    hoverEffect: string;
}

export default function Profil({ handleSubmit, hoverEffect }: ProfilProps) {
    return (
        <>
            <div className="rounded-lg text-white text-center ml-4 mr-3 my-8">
                <h1 className="text-3xl">Profil management</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="sm:col-span-4">
                    <InputText />
                </div>
                <div className="mt-4 col-span-full">
                    <Avatar />
                </div>
                <div className="mt-4 col-span-full">
                    <CoverInput />
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        className={`cursor-pointer text-sm/6 font-semibold text-white ${hoverEffect}`}
                    >
                        Cancel</button>
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className={`cursor-pointer rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 
                            focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${hoverEffect}`}>Update</button>
                </div>
            </form>
        </>
    )
} 