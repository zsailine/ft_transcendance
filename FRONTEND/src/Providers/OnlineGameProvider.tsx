import { createContext } from "react-router-dom"
import { useContext, useEffect, useState } from "react";


interface OnlineGameInterface {
	text: string,
}

export const OnlineGameContext = createContext<OnlineGameInterface | null>(null);

export const useOnlineGame = () => {
	const context = useContext(OnlineGameContext);
	if (!context)
		throw new Error("Error in context");
	return context
}