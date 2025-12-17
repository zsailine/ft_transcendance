import { useEffect, useRef, useState } from "react";
import { useChat } from "../../Providers/ChatProvider"
import { getImageUrlFromBlob } from "../../Utils/blob";
import { NoChatHistory, NoChatHistoryBlocked } from "../../Pages/Chat/NoChatHistory";
import { useFriend } from "../../Providers/FriendProvider";
import { getRelationship } from "../../Utils/getter";
import { useSocket } from "../../Providers/SocketProvider";
import { PiChecks } from "react-icons/pi";
import Typing from "../../Pages/Chat/isTyping";
import { useAuth } from "../../Providers/AuthProvider";

const senderStyle = "self-end bg-cyan-500/20 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-sm break-words shadow-md mr-4 transition-transform hover:-translate-y-0.5 flex flex-col gap-2";
const receiverStyle = "self-start bg-gray-200/10 text-white px-4 py-2 rounded-2xl rounded-bl-none max-w-sm break-words shadow transition-transform hover:-translate-y-0.5 flex flex-col gap-2";

export const getHour = (timestamp: string) => {
	const date = new Date(timestamp);
	const newDate = date.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
	const tempDate = new Date();
	const [ h, m ] = newDate.split(':').map(Number);
	tempDate.setHours(h, m);
	tempDate.setHours(tempDate.getHours() + 3);
	return tempDate.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
}

export function MessageList() {
	const { messages, selectedUser } = useChat();
	const { blockedUsername } = useFriend();
	const { socketFriend } = useSocket();
	const bottomScroll = useRef<HTMLDivElement | null>(null);
	const [ relationship, setRelationship ] = useState<string | null>("");
	const [ typing, setTyping ] = useState<boolean>(false);
	
	useEffect(() => {
		getRelationship(selectedUser?.username || "", setRelationship);
	}, [selectedUser]);

	useEffect(() => {
		if (bottomScroll.current) {
			bottomScroll.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, typing]);

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

	if ((messages.length === 0 && selectedUser?.username && blockedUsername.includes(selectedUser?.username)) ||
		(messages.length === 0 && relationship === "blocked")) {
		return (
		<NoChatHistoryBlocked/>
	);
	} else if (messages.length === 0 && selectedUser?.username && !blockedUsername.includes(selectedUser?.username)) {
		return (
			<NoChatHistory name={selectedUser?.username || ""}/>
		);
	}

	return (
	<div className="p-4 text-white overflow-y-auto flex-1">
		<ul className="flex flex-col gap-5 font-helvetica">
		{messages.map((message) =>
			<li key={message.id}
				className={message.receiver_username === selectedUser?.username ? senderStyle : receiverStyle }>
				{
				message.image && (
					<img alt="preview"
					src={(getImageUrlFromBlob(message.image)) || ""}
					className="max-w-l max-h-60 rounded-lg mt-1"
					onLoad={() => {bottomScroll.current?.scrollIntoView({behavior: "smooth"})}}/>
				)}
				{message.text &&
					<div className={`text-lg
					${message.sender_username === user ? "self-end" : "self-start"}`}>
						{message.text}</div>}
				<div className="flex self-end gap-2">
				<div className={`text-xs ${
					message.receiver_username === selectedUser?.username ? "self-end" : "self-start"
				}`}>{getHour(message.created_at)}</div>
				{
				message.receiver_username === selectedUser?.username && message.status === "sent" &&
				<PiChecks className="self-end text-xl mr-4 text-gray-200/30" />
				}
				{
				message.receiver_username === selectedUser?.username && message.status === "read" &&
				<PiChecks className="self-end text-xl mr-4 text-cyan-400 " />
				}
				</div>
			</li>
		)}
		{typing && (
			<li key="typing-indicator" className="self-start mb-2">
				<Typing/>
			</li>
			)}
		<div ref={bottomScroll}></div>
		</ul>
	</div>
	)
}

