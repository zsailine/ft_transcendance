import { motion } from "framer-motion";
import ButtonMenu from "./ButtonMenu";
import { FaPaperPlane } from "react-icons/fa";
import type { FormEvent } from "react";
import {useOnlineGame} from "../../Providers/OnlineGameProvider"

type OverlayInputProps = {
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
	onQuit: () => void;
	hoverEffect?: string;
	buttonText: string;
};

export default function OverlayInput({ buttonText, handleSubmit, onQuit, hoverEffect }: OverlayInputProps) {
	
	const  {text, setText} = useOnlineGame()
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -30 }}
			transition={{ duration: 1, ease: "easeOut" }}
			className="absolute z-10 top-0 w-full h-full flex flex-col items-center justify-center 
			bg-black/30 backdrop-blur-[2px] text-white"
		>
			<form className="flex justify-center gap-4 h-[50px]" onSubmit={handleSubmit}>
				<input placeholder="Room to join"
					type="text"
					className="py-2 pl-10 pr-4 text-md text-white backdrop-blur-xl bg-cyan-800/5
					 border-none rounded-lg flex-1"
					value={text}
					onChange={(e) => {setText(e.target.value)}} />

				<button type="submit"
					className="w-12 text-sm text-white bg-slate-800 border-none rounded-lg flex justify-center items-center hover:ring-1 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={!text}>
					<FaPaperPlane />
				</button>
			</form>
			<ButtonMenu
				onClick={onQuit}
				className={`cursor-pointer mt-4 mr-1.5 py-1.5 px-6 text-xl flex items-center 
					h-max gap-2 backdrop-blur-xl rounded-xl 
					bg-cyan-800/5 shadow-md shadow-cyan-500/50 ${hoverEffect}`}
			>
				{buttonText}
			</ButtonMenu>
		</motion.div>
	);
}