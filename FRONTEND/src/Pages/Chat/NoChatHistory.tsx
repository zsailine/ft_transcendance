import { TbMessageDots } from "react-icons/tb";
import { useChat } from "../../Providers/ChatProvider";
import { useEffect, useState } from "react";
import { useSocket } from "../../Providers/SocketProvider";
import Typing from "./isTyping";

interface NoChatHistory {
	name: string | null
}

export function NoChatHistory({ name }: NoChatHistory) {

	const [ typing, setTyping ] = useState<boolean>(false);
	const { socketFriend } = useSocket();
	const { selectedUser, messages } = useChat();

	useEffect(() => {
		socketFriend?.on("typing", (response) => {
			if (response === selectedUser?.username)
				setTyping(true); 
		});
		socketFriend?.on("stop typing", (response) => {
			if (response === selectedUser?.username)
				setTyping(false);
		});

		return () => {
			socketFriend?.off("typing");
			socketFriend?.off("stop typing");
			}
	}, [socketFriend, selectedUser, messages]);

	const { sendMessages } = useChat();
	const handleClick = (text: string) => {
		sendMessages({
			text: text.trim(),
			image: null
		})
	};

	return (
	<div className="relative flex flex-col items-center justify-center flex-1 text-center w-full p-4">
	<div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mb-5">
		<TbMessageDots className="size-8 text-cyan-400" />
	</div>
	<h3 className="text-lg font-medium text-slate-200 mb-3 font-helvetica">
		Start your conversation with {name}
	</h3>
	<div className="flex flex-col space-y-3 max-w-md mb-5">
		<p className="text-slate-400 text-sm font-helvetica">
		This is the beginning of your conversation
		</p>
		<div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto"></div>
	</div>
	<div className="flex flex-wrap gap-2 justify-center">
		<button className="font-helvetica px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors"
			onClick={() => handleClick("Hello 👋")}>
		👋 Say Hello
		</button>
		<button className="font-helvetica px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors"
			onClick={() => handleClick("How are you? 😀")}>
		🤝 How are you?
		</button>
		<button className="font-helvetica px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors"
			onClick={() => handleClick("Wanna play? 🎮")}>
		🎮 Play with them
		</button>
	</div>
	{typing && <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6">
		<Typing />
	</div>}
	</div>
	)
}

export function NoChatHistoryBlocked() {
	return (
	<div className="flex flex-col items-center justify-center flex-1 text-center w-full p-4">
		<div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mb-5">
			<TbMessageDots className="size-8 text-cyan-400" />
		</div>
		<h3 className="text-lg font-medium text-slate-200 mb-3 font-helvetica">
			No Chat History
		</h3>
		<div className="flex flex-col space-y-3 max-w-md mb-5">
			<p className="text-slate-400 text-sm font-helvetica">
			No messages in your inbox
			</p>
			<div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto"></div>
		</div>
	</div>
	);
}
