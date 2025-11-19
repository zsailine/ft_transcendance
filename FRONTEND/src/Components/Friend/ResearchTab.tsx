import { useState, type FormEvent } from "react"
import SearchBar from "../Chat/SearchBar"
import type { UserInterface } from "../../Providers/ChatProvider";
import { useFriend } from "../../Providers/FriendProvider";
import FriendsList from "../Chat/FriendsList";

function ResearchTab() {
	const [ searchValue, setSearchValue ] = useState<string>("");
	const [ selectedUser, setSelectedUser ] = useState<UserInterface | null>(null);
	const [ foundUser, setFoundUser ] = useState<UserInterface[]>([]);
	const { notFriends } = useFriend();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSearchValue(searchValue);
		setFoundUser(await notFriends(searchValue));
	}

  return (
	<div className="flex flex-col gap-5">
		<form onSubmit={handleSubmit}>
			<SearchBar
				searchValue={searchValue}
				setSearchValue={setSearchValue}/>
		</form>
		{foundUser.length !== 0 ?
			<FriendsList
				friendsList={foundUser}
				searchValue=""
				setSelectedUser={setSelectedUser}
				message={"research"}/>
			: <></>}
	</div>
  )
}

export default ResearchTab;
