import { useChat } from "../../Providers/ChatProvider"
import { useFriend } from "../../Providers/FriendProvider";
import FriendsList from "../Chat/FriendsList";
import SearchBar from "../Chat/SearchBar";

interface FriendsProps {
	click: () => void
}

function Friends({click}: FriendsProps) {
	const { friendsList, setSelectedUser } = useChat();
	const { searchValue, setSearchValue, setSelectedUserProfil } = useFriend();

  return (
	<div className="flex flex-col gap-10 items-center">
		{friendsList.length === 0 ? <></> :
		<SearchBar
			searchValue={searchValue}
			setSearchValue={setSearchValue}
			className="md:w-[50%] w-full"/>}
		<FriendsList
			setFriendsList={ () => {} }
			friendsList={friendsList}
			searchValue={searchValue}
			setSelectedUser={setSelectedUser}
			message={"friends"}
			setSelectedUserProfil={setSelectedUserProfil}
			click={click}
			/>
	</div>
  )
}

export default Friends
