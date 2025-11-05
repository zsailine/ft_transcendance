import ChatBorder from "../../Pages/Chat/ChatBorder";
import FriendsList from "./FriendsList";
import ChatTitle from "./ChatTitle";
// import MessageInput from "./MessageInput";
// import MessageList from "./MessageList";
import ReceiverHeader from "./ReceiverHeader";
import SearchBar from "./SearchBar";

function Discussion() {
	return (
	<div className="flex justify-center">
		<ChatBorder>

			<div className="ml-8 mt-8 w-1/6 mr-8 flex flex-col gap-10">
				<ChatTitle />
				<SearchBar />
				<FriendsList />
			</div>

			<div className="w-px border-1 border-cyan-500/20 h-full"></div>

			<div className="flex flex-col w-5/6 gap-10 mt-8">
				<ReceiverHeader />
				<div className="w-full border-1 border-cyan-500/20 h-px"></div>
				{/* <MessageList />
				<MessageInput /> */}
			</div>

		</ChatBorder>
	</div>
	);
}

export default Discussion;
