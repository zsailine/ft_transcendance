import { useState, type FormEvent } from "react"
import SearchBar from "../Chat/SearchBar"
import { useFriend } from "../../Providers/FriendProvider";
import type { UserInterface } from "../../Providers/ChatProvider";
import FriendsList from "../Chat/FriendsList";

function ResearchTab() {
	const [ searchValue, setSearchValue ] = useState<string>("");
	const { unknowns, fetchNotFriends } = useFriend();
	const [ foundUsers, setFoundUsers ] = useState<UserInterface[]>([]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		fetchNotFriends();
		if (searchValue !== "") {
			setFoundUsers(unknowns.filter((user : UserInterface) =>
				user.username?.toLowerCase().includes(searchValue.toLowerCase())));
		}
	}

  return (
	<div className="flex flex-col gap-10 items-center">
		<form onSubmit={handleSubmit} className="w-full flex justify-center">
			<SearchBar
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				className="md:w-[50%] w-full"/>
		</form>
		{foundUsers.length !== 0 ?
		
		<FriendsList
			friendsList={foundUsers}
			searchValue=""
			setSelectedUser={()=>{}}
			message="research"
		/>

		: <></>}
	</div>
  )
}

export default ResearchTab;
