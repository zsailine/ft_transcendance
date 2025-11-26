import ChatBorder from "../../Pages/Chat/ChatBorder";
import FriendsList from "./FriendsList";
import ChatTitle from "./ChatTitle";
import SearchBar from "./SearchBar";
import ChatContainer from "./ChatContainer";
import { useChat } from "../../Providers/ChatProvider";

function Discussion() {
	const { searchValue, setSearchValue, friendsList, setSelectedUser, selectedUser } = useChat()

	const exist = !!selectedUser?.username;
	const leftClass = `md:w-75 shrink-0 flex flex-col gap-10 p-6 h-full w-full ${exist ? 'hidden md:flex' : 'flex'} ${exist && 'w-0 p-0'}`;
	const separatorClass = "w-px md:block bg-cyan-500/20 h-full flex-none";
	const chatClass = `w-full h-full min-w-0 ${exist ? 'flex' : 'hidden md:flex'} ${exist ? 'flex-1' : 'w-full'}`;

	return (
		<div className="flex justify-center h-full w-full min-h-[450px]">
			<ChatBorder>
				<div className="flex w-full h-full" id="message-box">

					<div className={leftClass} id="message-sidebar">
						<ChatTitle />
						<SearchBar 
							searchValue={searchValue}
							setSearchValue={setSearchValue}
							className=""/>
						<div className="flex-1 overflow-y-auto">
						<FriendsList
							friendsList={friendsList}
							searchValue={searchValue}
							setSelectedUser={setSelectedUser}
							message={"message"} />
						</div>
					</div>

					<div className={separatorClass}></div>

					<div className={chatClass}>
						<ChatContainer/>
					</div>

				</div>
			</ChatBorder>
		</div>
	);
}

export default Discussion;
