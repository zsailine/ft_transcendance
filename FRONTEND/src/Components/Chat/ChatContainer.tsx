import NoConversation from "../../Pages/Chat/NoConversation";
import { useChat } from "../../Providers/ChatProvider";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ReceiverHeader from "./ReceiverHeader";
import { useFriend } from "../../Providers/FriendProvider";
import { useEffect } from "react";

interface ChatContainerProps {
	headerClick: () => void,
}

function ChatContainer({headerClick}: ChatContainerProps ) {
	
	const { selectedUser } = useChat();
	const { blockedUsername } = useFriend();

	useEffect(() => {
		console.log(blockedUsername);
	}, [blockedUsername]);

	if (selectedUser === null) {
		return (
			<NoConversation/>
		);
	}


	return (
		<div className="flex flex-col gap-3 h-full w-full min-h-0 p-4">
			<ReceiverHeader click={headerClick}/>
			<div className="w-full border-1 border-cyan-500/20 h-px mt-0 mb-0"></div>
			{blockedUsername.includes(selectedUser.username || "") ?
			
			<>NOOOOO</> :
			<> 
			<MessageList />
			<MessageInput />
			</>
			}
		</div>
	)
}

export default ChatContainer;
