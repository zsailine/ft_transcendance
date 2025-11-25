import NoConversation from "../../Pages/Chat/NoConversation";
import { useChat } from "../../Providers/ChatProvider";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ReceiverHeader from "./ReceiverHeader";

function ChatContainer() {
	
	const { selectedUser } = useChat();

	if (selectedUser === null) {
		return (
			<NoConversation/>
		);
	}

	return (
		<div className="flex flex-col w-5/6 gap-3 mt-3 h-[800px]">
			<ReceiverHeader />
			<div className="w-full border-1 border-cyan-500/20 h-px mt-0 mb-0"></div>
			<MessageList />
			<MessageInput />
		</div>
	)
}

export default ChatContainer;
