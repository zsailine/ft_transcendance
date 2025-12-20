import Avatar from "./Avatar";
import CoverInput from "./Cover";
import InputText from "./InputText";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import QRCode from 'react-qr-code';

import { useEffect, useState } from "react";
import api from "../../../Utils/axios";
import { toast } from "react-toastify";

interface ProfilProps {
    handleSubmit: (e: any) => void;
    hoverEffect: string;
}

export default function Profil({ handleSubmit, hoverEffect }: ProfilProps) {
    const [checked, setChecked] = useState(false);
    const [qrCodeVisible, setQrCodeVisible] = useState(false);
    const [dataURL, setDataURL] = useState<string>("");
    const [inputCode, setInputCode] = useState<string>("");

    useEffect(() => {
        const fetch2FAStatus = async () => {
            try {
                const res = await api.get('/auth/me');
                setChecked(res.data.enabled2FA === 1);
            } catch (error) {
                console.error("Error fetching 2FA status:", error);
            }
        };
        fetch2FAStatus();
    }, []);

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = event.target.checked;
        
        if (!newChecked && checked) {
            try {
                await api.post('/users/2fa/disable');
                setChecked(false);
                setQrCodeVisible(false);
                setDataURL("");
                setInputCode("");
                toast.info("2FA disabled successfully!");
            } catch (error) {
                console.error("Error disabling 2FA:", error);
                toast.error("Error disabling 2FA. Please try again.");
            }
        } else {
            setChecked(newChecked);
        }
    };

    const fetch2FASetup = async () => {
        try {
            const res = await api.get('/users/2fa/setup');
            setDataURL(res.data.qrCode);
            setQrCodeVisible(true);
        } catch (error) {
            console.error("Error fetching 2FA setup:", error);
            setQrCodeVisible(false);
        }
    };

    const verify2FA = async () => {
        setInputCode("");
        if (!inputCode) {
            toast.error("Please enter the 2FA code.");
            return;
        }
        try {
            const res = await api.post('/users/2fa/verify', {
                token: inputCode
            });
            if (res.data.success) {
                toast.success("2FA activated successfully!");
                setQrCodeVisible(false);
                setChecked(true); 
            } else {
                toast.error("Invalid 2FA token. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying 2FA code:", error);
            toast.error("Error verifying 2FA code. Please try again.");
        }
    };

    useEffect(() => {
        if (checked && !qrCodeVisible) {
            fetch2FASetup();
        } else if (!checked) {
            setQrCodeVisible(false);
            setDataURL("");
            setInputCode("");
        }
    }, [checked]);

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
                    <Avatar hoverEffect={hoverEffect}/>
                </div>
                <div className="mt-4 col-span-full">
                    <CoverInput hoverEffect={hoverEffect} />
                </div>

                <div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={checked}
                                onChange={handleChange}
                            />
                        }
                        label="Enable two-factor"
                        className="text-white mt-6"
                        labelPlacement="start"
                        style={{ marginLeft: 0 }}
                    />

                    {checked && qrCodeVisible && dataURL && (
                        <div className="mt-4">
                            <p className="text-white mb-2">
                                Scan this QR code with your authenticator app:
                            </p>
                            <QRCode value={dataURL} size={200} />
                            <input
                                type="text"
                                placeholder="Enter code from app"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                className="mt-2 p-1 rounded active:border-b-cyan-500 text-gray-100 border border-gray-500"
                            />
                            <button
                                type="button"
                                onClick={verify2FA}
                                className={`underline cursor-pointer mt-2 px-4 py-2 text-white rounded ${hoverEffect}`}
                            >
                                Activate
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        className={`cursor-pointer text-sm/6 font-semibold text-white ${hoverEffect}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className={`cursor-pointer rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 
                            focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${hoverEffect}`}
                    >
                        Update
                    </button>
                </div>
            </form>
        </>
    );
}