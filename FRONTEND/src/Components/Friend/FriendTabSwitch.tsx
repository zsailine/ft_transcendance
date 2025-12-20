import { useEffect, useState } from "react"
import Friends from "./Friends";
import FriendRequests from "./FriendRequests";
import ResearchTab from "./ResearchTab";
import { FaUserFriends, FaUserClock } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import BlockedUsers from "./BlockedUsers";
import { FaUserSlash } from "react-icons/fa";
import { useFriend } from "../../Providers/FriendProvider";
import FriendProfil from "../Profil/FriendProfil";
import { useSocket } from "../../Providers/SocketProvider";
import { getRelationship, getSetAvatar } from "../../Utils/getter";
import type { ImageBuffer } from "../../Providers/DashboardProvider";
import { useChat } from "../../Providers/ChatProvider";

function FriendTabSwitch() {
	const [ tabSelected, setTabSelected ] = useState<string>("friends");
	const [ previewProfil, setPreviewProfil ] = useState<boolean>(false);
	const [ relation, setRelation ] = useState<string | null>("");
	const [ type, setType ] = useState<string>("");
	const [ avatar, setAvatar ] = useState<ImageBuffer | null>(null);
	const [ whoChanged, setWhoChanged ] = useState<string>("");
	const { selectedUserProfil, blockedUsers, setBlockedUsers, friendRequests, setFriendRequests } = useFriend();
	const { socketFriend, socketUser } = useSocket();
	const { friendsList, setFriendsList } = useChat();

	const clickProfil = () => {
		setPreviewProfil(prev => !prev);
	}

	useEffect(() => {
		setBlockedUsers(blockedUsers.map((friend) => 
			(friend.username === whoChanged) ? {
				id: friend.id,
				avatar: avatar,
				username: friend.username
			} : friend ));
		setFriendRequests(friendRequests.map((friend) => 
			(friend.username === whoChanged) ? {
				id: friend.id,
				avatar: avatar,
				username: friend.username
			} : friend ));
		setFriendsList(friendsList.map((friend) => 
			(friend.username === whoChanged) ? {
				id: friend.id,
				avatar: avatar,
				username: friend.username
			} : friend ));
	}, [avatar, whoChanged]);

	useEffect(() => {
		socketUser?.on("user profil updated", (data) => {
			if (blockedUsers.some(f => f.username === data.whoChanged) ||
				friendRequests.some(f => f.username === data.whoChanged) ||
				friendsList.some(f => f.username === data.whoChanged)) {
				getSetAvatar(data.whoChanged, setAvatar);
				setWhoChanged(data.whoChanged);
			}
		});
	}, [socketUser, blockedUsers, friendRequests, blockedUsers]);

	const [ selectedTab , setSelectedTab ] = useState<React.ReactElement>(<Friends click={clickProfil}/>);

	const getTabClasses = (tab: string) => {
		const base = "py-2 px-4 cursor-pointer transition-all duration-200 ease-in-out font-helvetica-b text-xl flex gap-2";
		const selected = "text-cyan-400 border-b-2 border-cyan-400";
		const unselected = "text-slate-400 hover:text-slate-200 border-b-2 border-transparent hover:border-slate-500";
		return `${base} ${tabSelected === tab ? selected : unselected}`
	}

	const handleClick = (event: string) => {
		if (event === "friends") {
			setSelectedTab(<Friends click={clickProfil}/>);
			setTabSelected("friends");
			setType("");
		} else if (event === "requests") {
			setSelectedTab(<FriendRequests click={clickProfil}/>);
			setTabSelected("requests");
			setType("request");
		} else if (event === "research") {
			setSelectedTab(<ResearchTab click={clickProfil}/>);
			setTabSelected("research");
			setType("research");
		} else if (event === "block") {
			setSelectedTab(<BlockedUsers/>);
			setTabSelected("block");
			setType("");
		}
	}

	useEffect(() => {
		getRelationship(selectedUserProfil?.username || "", setRelation);
	}, [selectedUserProfil]);

	useEffect(() => {
		socketFriend?.on("i am blocked", () => { setRelation("blocked"); });
		socketFriend?.on("i blocked", () => { setRelation("blocked"); });
		socketFriend?.on("i am unblocked", () => { setRelation(""); });
		socketFriend?.on("i unblocked", () => { setRelation(""); });

		return () => {
			socketFriend?.off("i am blocked");
			socketFriend?.off("i blocked");
			socketFriend?.off("i am unblocked");
			socketFriend?.off("i unblocked");
		}
	}, [socketFriend, selectedUserProfil]);

	return (
	<div className="flex flex-col items-center w-full h-full p-4 gap-5 md:gap-8">
		<div className="flex justify-center w-full border-slate-700/50 gap-4 md:gap-8">
			<div onClick={() => handleClick("friends") } className={getTabClasses("friends")}>
				<FaUserFriends />
				<p className="hidden md:block text-sm">Friends</p>
			</div>
			<div onClick={() => handleClick("requests") } className={getTabClasses("requests")}>
				<FaUserClock />
				<p className="hidden md:block text-sm">Requests</p>
			</div>
			<div onClick={() => handleClick("block") } className={getTabClasses("block")}>
				<FaUserSlash />
				<p className="hidden md:block text-sm">Blocked</p>
			</div>
			<div onClick={() => handleClick("research") } className={getTabClasses("research")}>
				<MdPersonSearch />
				<p className="hidden md:block text-sm">Search</p>
			</div>
		</div>
		<div className="text-slate-200 w-full flex-1">
			{selectedTab}
		</div>

		{previewProfil && selectedUserProfil && relation !== "blocked" && (
			<FriendProfil
				user={selectedUserProfil}
				click={clickProfil}
				type={type}/>
		)}
	</div>
	)
}

export default FriendTabSwitch
