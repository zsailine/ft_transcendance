import { useChat } from "../../Providers/ChatProvider"
import { useFriend } from "../../Providers/FriendProvider";
import FriendsList from "../Chat/FriendsList";
import SearchBar from "../Chat/SearchBar";

function Friends() {
	const { friendsList, setSelectedUser } = useChat();
	const { searchValue, setSearchValue } = useFriend();

  return (
	<div className="flex flex-col gap-10 items-center">
		{friendsList.length === 0 ? <></> :
		<SearchBar
			searchValue={searchValue}
			setSearchValue={setSearchValue}
			className="md:w-[50%] w-full"/>}
		<FriendsList
			friendsList={friendsList}
			searchValue={searchValue}
			setSelectedUser={setSelectedUser}
			message={"friends"}/>
	</div>
  )
}

export default Friends
