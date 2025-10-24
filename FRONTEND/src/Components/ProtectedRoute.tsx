import { Navigate } from "react-router-dom"
import { useAuth } from "../Providers/AuthProvider"
import type { PropsWithChildren } from "react";


const ProtectedRoute = ({ children }: PropsWithChildren<{}>): React.ReactElement | null => 
{
    const {isAuthenticated, loading} = useAuth()

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