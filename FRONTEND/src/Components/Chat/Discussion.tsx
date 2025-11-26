import ChatBorder from "../../Pages/Chat/ChatBorder";
import FriendsList from "./FriendsList";
import ChatTitle from "./ChatTitle";
import SearchBar from "./SearchBar";
import ChatContainer from "./ChatContainer";
import { useChat } from "../../Providers/ChatProvider";

function Discussion() {
	const { searchValue, setSearchValue, friendsList, setSelectedUser } = useChat()

	return (
		<div className="flex justify-center h-full w-full min-h-[450px]">
			<ChatBorder>
				<div className="flex w-full h-full" id="message-box">

					<div className="md:w-75 shrink-0 flex flex-col gap-10 p-6 h-full w-full" id="message-sidebar">
						<ChatTitle />
						<SearchBar 
							searchValue={searchValue}
							setSearchValue={setSearchValue}/>
						<div className="flex-1 overflow-y-auto">
						<FriendsList
							friendsList={friendsList}
							searchValue={searchValue}
							setSelectedUser={setSelectedUser}
							message={"message"} />
						</div>
					</div>

					<div className="w-px md:block bg-cyan-500/20 h-full flex-none"></div>

					<div className="hidden md:flex flex-1 h-full min-w-0 w-full">
						<ChatContainer/>
					</div>

				</div>
			</ChatBorder>
		</div>
	);
}

export default Discussion;
