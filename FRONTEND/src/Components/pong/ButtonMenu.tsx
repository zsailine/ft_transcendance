type ButtonMenuProps = {
    className?: string;
    onClick: () => void;
    children?: React.ReactNode;
};

export default function ButtonMenu({ className, onClick, children }: ButtonMenuProps) {
    return (
        <div
            onClick={onClick}
            className={className}
        >
            {children}
        </div>
    );
}