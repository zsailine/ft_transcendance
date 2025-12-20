import { useEffect, useState, type FormEvent } from "react"
import SearchBar from "../Chat/SearchBar"
import { useFriend } from "../../Providers/FriendProvider";
import type { UserInterface } from "../../Providers/ChatProvider";
import FriendsList from "../Chat/FriendsList";
import { useSocket } from "../../Providers/SocketProvider";

interface ResearchTabProps {
	click: () => void
}

function ResearchTab({click}: ResearchTabProps) {
	const [ searchValue, setSearchValue ] = useState<string>("");
	const { unknowns, fetchNotFriends, setSelectedUserProfil, setUnknowns } = useFriend();
	const [ foundUsers, setFoundUsers ] = useState<UserInterface[]>([]);
	const { socketFriend } = useSocket();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		fetchNotFriends();
		if (searchValue !== "") {
			setFoundUsers(unknowns.filter((user : UserInterface) =>
				user.username?.toLowerCase().includes(searchValue.toLowerCase())));
		}
	}

	useEffect(() => {
		if (searchValue !== "") {
			setFoundUsers(unknowns.filter((user : UserInterface) =>
				user.username?.toLowerCase().includes(searchValue.toLowerCase())));
		}
	}, [unknowns]);

	useEffect(() => {
		socketFriend?.on("add friend button handled", (friend) => {
			const filtered = unknowns.filter((f) => f.username !== friend.username);
			setUnknowns(filtered);
			const foundFiltered = foundUsers.filter((f) => f.username !== friend.username);
			setFoundUsers(foundFiltered);
		});
		return () => {
			socketFriend?.off("add friend button handled");
		}
	}, [socketFriend, foundUsers]);

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
			setFriendsList={setFoundUsers}
			searchValue=""
			setSelectedUser={()=>{}}
			message="research"
			setSelectedUserProfil={setSelectedUserProfil}
			click={click}
		/>

		: <></>}
	</div>
  )
}

export default ResearchTab;
