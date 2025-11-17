import { useChat } from "../../Providers/ChatProvider"
import { useFriend } from "../../Providers/FriendProvider";
import FriendsList from "../Chat/FriendsList";
import SearchBar from "../Chat/SearchBar";

function Friends() {
	const { friendsList } = useChat();
	const { searchValue, setSearchValue, setSelectedUser } = useFriend();
  return (
	<div className="flex flex-col gap-10">
		<SearchBar
	  		searchValue={searchValue}
			setSearchValue={setSearchValue}/>
		<FriendsList
			friendsList={friendsList}
			searchValue={searchValue}
			setSelectedUser={setSelectedUser}/>
	</div>
  )
}

export default Friends
