import { useChat } from "../../Providers/ChatProvider"

const senderStyle = "self-end bg-cyan-500 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-sm break-words shadow-md mb-3 mr-4 transition-transform hover:-translate-y-0.5 flex flex-col gap-2";
const receiverStyle = "self-start bg-gray-200/15 text-white px-4 py-2 rounded-2xl rounded-bl-none max-w-sm break-words shadow mb-3 transition-transform hover:-translate-y-0.5 flex flex-col gap-2";

const getHour = (timestamp: string) => {
	const date = new Date(timestamp);
	return date.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
}

function MessageList() {
	const { messages, selectedUser } = useChat();

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
				<div className="text-lg">{message.text}</div>
				<div className={`text-xs ${
					message.receiver_username === selectedUser?.username ? "self-end" : "self-start"
				}`}>{getHour(message.created_at)}</div>
			</li>
		)}
		</ul>
	</div>
	)
}

export default MessageList
