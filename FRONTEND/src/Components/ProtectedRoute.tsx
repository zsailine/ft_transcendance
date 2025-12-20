import { Navigate } from "react-router-dom"
import { useAuth } from "../Providers/AuthProvider"
import type { PropsWithChildren } from "react";
import React, { useEffect } from "react";
import api from "../Utils/axios";



const ProtectedRoute = ({ children }: PropsWithChildren<{}>): React.ReactElement | null => 
{
    const {isAuthenticated, loading, setUser, setLoading} = useAuth()

    const verifyToken = async () =>
    {
        try
        {
            const {data} = await api.get("/auth/me")
            if (data)
                setUser(data.user)
            else
                setUser(null)
        }
        catch(e)
        {
        }
        finally
        {
            setLoading(false)
        }
    }

    useEffect(() => {
            verifyToken();
    }, [])

    if (loading) {
        return (
        <div className="flex justify-center items-center h-64">
            <div>Vérification de l'authentification...</div>
        </div>
        );
    }

    if (!isAuthenticated)
        return (<Navigate to="/login"/>)

    return (
        <>
            {children}
        </>
        )
}

export default ProtectedRoute