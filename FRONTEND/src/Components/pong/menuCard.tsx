interface MenuCardProps {
    title: string;
    description: string;
    onClick: () => void;
    buttonContent: string;
    bgCard: string;

}

const MenuCard = ({ title, description, onClick, buttonContent, bgCard}: MenuCardProps) => {
    return (
        <div
            className={`
                ${bgCard} rounded p-6 shadow-xl shadow-emerald-600 transition transform hover:scale-[1.03]
                max-w-sm 
                flex flex-col justify-between w-[250px]  h-[424px] 
            `}
        >
            <div>
                <h2 
                className="text-2xl mt-4 text-center font-extrabold mb-2 text-white">{title}</h2>
            </div>
            <div className="flex flex-col justify-center">
                <p className="mx-2 text-center text-gray-300 mb-6 text-sm">{description}</p>
                <button
                    onClick={onClick}
                    className="w-[90%] mx-auto bg-emerald-900 text-emerald-300 font-bold py-2 px-6 rounded-lg 
                           hover:bg-emerald-950 transition duration-200 shadow-lg"
                >
                    {buttonContent}
                </button>
            </div>
        </div>
    );
};

export default MenuCard;