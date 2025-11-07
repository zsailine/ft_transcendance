import ChatBorder from "../../Pages/Chat/ChatBorder";
import FriendsList from "./FriendsList";
import ChatTitle from "./ChatTitle";
import SearchBar from "./SearchBar";
import { ChatProvider } from "../../Providers/ChatProvider";
import ChatContainer from "./ChatContainer";

function Discussion() {

	return (
	<ChatProvider>
		<div className="flex justify-center">
			<ChatBorder>

				<div className="ml-8 mt-8 w-1/6 mr-8 flex flex-col gap-10">
					<ChatTitle />
					<SearchBar />
					<FriendsList />
				</div>

				<div className="w-px border-1 border-cyan-500/20 h-full"></div>

				<ChatContainer/>

			</ChatBorder>
		</div>
	</ChatProvider>
	);
}

export default Discussion;
