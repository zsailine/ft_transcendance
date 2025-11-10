
type ButtonMenuProps = {
    onClick : () => void;
    content: string;
}
function ButtonOption({ onClick, content } : ButtonMenuProps) {
    return (  
        <>
            <button
                onClick={onClick}
                className="px-6 py-3 bg-yellow-400 text-gray-900 text-xl font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition-all">
            {content}
            </button>
        </>
    );
}

export default ButtonOption