import { useDashboard, type ThemeColors } from "../../../Providers/DashboardProvider";
const defaultTheme: ThemeColors = {
    paddle1: '#5c9cd1',
    paddle2: '#6bd1e6', // Déjà similaire (bleu clair)
    ball: '#a9e6f9',
    boardBackground: '#101728',
    boardBorder: '#3c4e8b',
    score: '#3c4e8b',   // Déjà identique à la bordure
}

interface ThemeOption {
    name: string;
    colors: ThemeColors;
}

const themes: ThemeOption[] = [
    { name: "Default", colors: defaultTheme },
    {
        name: "Neon", colors: {
            paddle1: "#ff00ff",
            paddle2: "#ff66ff",
            ball: "#ff88ff",
            boardBackground: "#000000",
            boardBorder: "#ff00ff",
            score: "#ff00ff",
        }
    },
    {
        name: "Golden", colors: {
            paddle1: "#ff9900",
            paddle2: "#ffcc00",
            ball: "#ffda66",
            boardBackground: "#222222",
            boardBorder: "#ff9900",
            score: "#ff9900",
        }
    },
    {
        name: "Forest", colors: {
            paddle1: "#32cd32",
            paddle2: "#90ee90",
            ball: "#b3f0b3",
            boardBackground: "#0a1f0a",
            boardBorder: "#228b22",
            score: "#228b22",
        }
    },
    {
        name: "Crimson", colors: {
            paddle1: "#dc143c",
            paddle2: "#ff6b6b",
            ball: "#ff8888",
            boardBackground: "#2b0505",
            boardBorder: "#dc143c",
            score: "#dc143c",
        }
    },
    {
        name: "Amethyst", colors: {
            paddle1: "#9932cc",
            paddle2: "#ba55d3",
            ball: "#cc99e6",
            boardBackground: "#15052b",
            boardBorder: "#8a2be2",
            score: "#8a2be2",
        }
    },
];


export default function ThemeSelector() {
    const { theme, setTheme } = useDashboard();
    return (
        <div className="flex items-center justify-center gap-6 my-6">
            {themes.map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                    <button
                        onClick={() => setTheme(t.colors)}
                        className={`
                        w-5 h-5 lg:w-10 lg:h-10 rounded-full border-4 transition 
                        ${theme?.boardBorder === t.colors.boardBorder
                                ? "border-cyan-400 scale-80"
                                : "border-transparent opacity-70 hover:opacity-100"}
                            `}
                        style={{ backgroundColor: t.colors.boardBorder }}
                    />
                    <h1 className="flex justify-center text-white text-xs sm:text-sm md:text-base ml-1">
                        {t.name}
                    </h1>
                </div>
            ))}
        </div>
    );
}
