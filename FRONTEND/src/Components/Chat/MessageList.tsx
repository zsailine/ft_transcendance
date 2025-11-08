import { useEffect, useRef } from "react";
import { useChat } from "../../Providers/ChatProvider"
import { getImageUrlFromBlob } from "../../Utils/blob";

const senderStyle = "self-end bg-cyan-500 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-sm break-words shadow-md mb-3 mr-4 transition-transform hover:-translate-y-0.5 flex flex-col gap-2";
const receiverStyle = "self-start bg-gray-200/15 text-white px-4 py-2 rounded-2xl rounded-bl-none max-w-sm break-words shadow mb-3 transition-transform hover:-translate-y-0.5 flex flex-col gap-2";

const getHour = (timestamp: string) => {
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

function MessageList() {
	const { messages, selectedUser } = useChat();
	const bottomScroll = useRef<HTMLDivElement | null>(null);
	
	useEffect(() => {
		if (bottomScroll.current) {
			bottomScroll.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	if (messages.length === 0) {
		return (
			<div className="text-white">NO message to show</div>
		);
	}

	return (
	<div className="m-8 text-white overflow-y-auto h-[600px]">
		<ul className="flex flex-col gap-5">
		{messages.map(message => 
			<li key={message.id}
				className={message.receiver_username === selectedUser?.username ? senderStyle : receiverStyle }>

				{message.image && (
					<img alt="preview"
					src={getImageUrlFromBlob(message.image.data) || ""}
					className="max-w-l max-h-60 rounded-lg mt-1"/>
				)}

				{message.text && <div className="text-lg">{message.text}</div>}

				<div className={`text-xs ${
					message.receiver_username === selectedUser?.username ? "self-end" : "self-start"
				}`}>{getHour(message.created_at)}</div>
			</li>
		)}
		</ul>
		<div ref={bottomScroll}></div>
	</div>
	)
}

export default MessageList
