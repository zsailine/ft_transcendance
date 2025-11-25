interface MenuCardProps {
    title: string;
    description: string;
    onClick: () => void;
    buttonContent: string;
    bgColor: string;
}

const MenuCard = ({ title, description, onClick, buttonContent, bgColor }: MenuCardProps) => {
    return (
        <div 
            className={`
                ${bgColor} p-6 rounded-xl shadow-2xl transition transform hover:scale-[1.03]
                w-full max-w-sm border border-gray-700
                flex flex-col justify-between h-70
            `}
        >
            <div>
                <h2 className="text-3xl font-extrabold mb-2 text-white">{title}</h2>
                <p className="text-gray-300 mb-6 text-sm">{description}</p>
            </div>
            <button
                onClick={onClick}
                className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded-lg 
                           hover:bg-gray-200 transition duration-200 shadow-lg"
            >
                {buttonContent}
            </button>
        </div>
    );
};

export default MenuCard;