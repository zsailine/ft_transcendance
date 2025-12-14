import NoConversation from "../../Pages/Chat/NoConversation";
import { useChat } from "../../Providers/ChatProvider";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ReceiverHeader from "./ReceiverHeader";
import { useFriend } from "../../Providers/FriendProvider";
import { useEffect, useState } from "react";
import BlockedNotification from "../Friend/BlockedNotification";
import { getRelationship } from "../../Utils/getter";
import { useSocket } from "../../Providers/SocketProvider";

interface ChatContainerProps {
	headerClick: () => void,
}

function ChatContainer({headerClick}: ChatContainerProps ) {
	const { selectedUser } = useChat();
	const { socketFriend } = useSocket();
	const { blockedUsername } = useFriend();
	const [ relationship, setRelationship ] = useState<string | null>("")

	useEffect(() => {
		getRelationship(selectedUser?.username || "", setRelationship);
	}, [selectedUser]);

	useEffect(() => {
		socketFriend?.on("i am blocked", () => {
			setRelationship("blocked");
		});

		return () => {
			socketFriend?.off("i am blocked");
		}
	}, [socketFriend, selectedUser]);

	if (selectedUser === null) {
		return (
			<NoConversation/>
		);
	}

	return (
		<div className="flex flex-col gap-3 h-full w-full min-h-0 p-4">
			<ReceiverHeader click={headerClick}/>
			<div className="w-full border-1 border-cyan-500/20 h-px mt-0 mb-0"></div>
			<MessageList />
			{blockedUsername.includes(selectedUser.username || "")
				|| relationship === "blocked" ?
			<BlockedNotification selectedUser={selectedUser}/> :
			<MessageInput />
			}
		</div>
	)
}

export default ChatContainer;
