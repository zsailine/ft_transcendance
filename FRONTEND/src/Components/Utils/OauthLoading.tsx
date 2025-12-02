import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ImSpinner9 } from "react-icons/im";
import { toast } from "react-toastify";

export default function OauthLoading() {

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const oauthParam = queryParams.get('oauth');
        
        if (oauthParam === 'success') {
            const username = queryParams.get('username');
            toast.success(`Connexion réussie ! Bienvenue, ${username}.`);
            setTimeout(() => navigate('/dashboard') , 1200);
        } else if (oauthParam === 'error') {
            toast.error("Échec de la connexion via Google. Veuillez réessayer.");
            setTimeout(() => navigate('/login') , 1200);
        }
    }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-zinc-900/70 ">
      <ImSpinner9 className="animate-spin text-5xl text-blue-400" />
      <span className="ml-4 text-white text-xl">Loading please wait...</span>
    </div>
  );
}