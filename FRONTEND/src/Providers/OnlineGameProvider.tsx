import { createContext, useContext, useEffect, useState } from "react";


interface OnlineGameInterface {
	text: string,
	setText: (result: string) => void,
}

export const OnlineGameContext = createContext<OnlineGameInterface | null>(null);

export const useOnlineGame = () => {
	const context = useContext(OnlineGameContext);
	if (!context)
		throw new Error("Error in context");
	return context
}

export const OnlineGameProvider = ({ children }: any) => {
    const [text, setText] = useState<string>("");

    const value = {
        text,
		setText
    }

    return (
        <OnlineGameContext.Provider value={value}>
            {children}
        </OnlineGameContext.Provider>
    )
}