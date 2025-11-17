import ChatBorder from "../../Pages/Chat/ChatBorder";
import FriendsList from "./FriendsList";
import ChatTitle from "./ChatTitle";
import SearchBar from "./SearchBar";
import ChatContainer from "./ChatContainer";
import { useChat } from "../../Providers/ChatProvider";

function Discussion() {
	const { searchValue, setSearchValue, friendsList, setSelectedUser } = useChat()

	return (
		<div className="flex justify-center">
			<ChatBorder>

				<div className="ml-8 mt-8 w-1/6 mr-8 flex flex-col gap-10">
					<ChatTitle />
					<SearchBar 
						searchValue={searchValue}
						setSearchValue={setSearchValue}/>
					<FriendsList
						friendsList={friendsList}
						searchValue={searchValue}
						setSelectedUser={setSelectedUser}/>
				</div>

				<div className="w-px border-1 border-cyan-500/20 h-full"></div>

				<ChatContainer/>

			</ChatBorder>
		</div>
	);
}

export default Discussion;
