import { useNavigate } from "react-router-dom";

interface ButtonOnlineProps {
  type: "quick" | "join" | "create";
  text: string;
}

export default function ButtonOnline({ type, text }: ButtonOnlineProps) {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/dashboard/play/online?mode=${type}`);
  };

  return (
    <button
      onClick={handleStart}
      className="px-6 py-3 bg-yellow-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md 
      hover:bg-yellow-300 transition-all"
    >
      {text}
    </button>
  );
}