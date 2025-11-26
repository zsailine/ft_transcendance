import Avatar from "./Avatar";
import CoverInput from "./Cover";
import InputText from "./InputText";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useEffect, useState } from "react";
import api from "../../../Utils/axios";


interface ProfilProps {
    handleSubmit: (e: any) => void;
    hoverEffect: string;
}

export default function Profil({ handleSubmit, hoverEffect }: ProfilProps) {
    
    const [checked, setChecked] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    const verify2FAStatus =  async () => {
        try {
            const response = await api.get('/users/2fa/setup');
            console.log("2FA status response:", response.data);
            setChecked(response.data.enabled);
        } catch (error) {
            console.error("Error fetching 2FA status:", error);
        }
    };

    useEffect(() => {
        verify2FAStatus();
    }, []);

    // useEffect(() => {
    //     api.get('/users/2fa/setup').then((response) => {
    //         console.log("2FA status response:", response.data);
    //     }).catch((error) => {
    //         console.error("Error fetching 2FA status:", error);
    //     });
    // }, []);
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
                <div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={checked}
                                onChange={handleChange}
                            />
                        }
                        label="Enable two-factor" className="text-white mt-6"
                        labelPlacement="start"
                        color="#000000"
                        style={{ marginLeft: 0 }}
                        
                    />
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