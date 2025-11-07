import { useChat } from "../../Providers/ChatProvider";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ReceiverHeader from "./ReceiverHeader";

function ChatContainer() {
	
	const { selectedUser } = useChat();

	if (selectedUser === null) {
		return (
			<div className="text-white font-helvetica">Select someone to Chat with</div>
		);
	}

	return (
		<div className="flex flex-col w-5/6 gap-10 mt-5">
			<ReceiverHeader />
			<div className="w-full border-1 border-cyan-500/20 h-px mt-0 mb-0"></div>
			<MessageList />
			<MessageInput />
		</div>
	)
}

export default ChatContainer;
