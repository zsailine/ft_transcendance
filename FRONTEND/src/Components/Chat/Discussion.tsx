import ChatBorder from "../../Pages/Chat/ChatBorder";
// import FriendsList from "./FriendsList";
import ChatTitle from "./ChatTitle";
// import MessageInput from "./MessageInput";
// import MessageList from "./MessageList";
// import ReceiverHeader from "./ReceiverHeader";
// import SearchBar from "./SearchBar";

function Discussion() {
	return (
	<div className="flex justify-center">
		<ChatBorder>

			{/* LEFT SIDE COMPONENT */}
			<div className="ml-8 mt-8">
				<ChatTitle />
				{/* <SearchBar />
				<FriendsList /> */}
			</div>

			{/* RIGHT SIDE COMPONENT */}
			<div className="">
				{/* <ReceiverHeader />
				<MessageList />
				<MessageInput /> */}
			</div>

		</ChatBorder>
	</div>
	);
}

export default Discussion;
