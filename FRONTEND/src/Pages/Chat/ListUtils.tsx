import { GrSend } from "react-icons/gr";
import { IoMdPersonAdd } from "react-icons/io";
import { BiUserCheck } from "react-icons/bi";
import type { UserInterface } from "../../Providers/ChatProvider";
import { useEffect, useState } from "react";
import { useFriend } from "../../Providers/FriendProvider";
import { FaUserTimes, FaUserSlash } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { useSocket } from "../../Providers/SocketProvider";
import { useAuth } from "../../Providers/AuthProvider";

interface MessageFriendProps {
	handleClick: () => void
}

interface AddFriendButtonProps {
	friend: UserInterface,
	foundUsers: UserInterface[],
	setFoundUsers: (user: UserInterface[]) => void
}

interface UnfriendButtonProps {
	user: UserInterface,
	handleUnfriend: (user: UserInterface, c: boolean, f: (b: boolean) => void,
		unfriend: (user: UserInterface) => void, 
		setSelectedUser: (user: UserInterface | null) => void) => void,
	unfriend: (user: UserInterface) => void,
	setSelectedUser: (user: UserInterface | null) => void,
	type: string
}

interface BlockButtonProps {
	user: UserInterface,
	type: string,
	handleBlocked: (user: UserInterface, c: boolean, f: (b: boolean) => void) => void
}

interface UnblockButtonProps {
	user: UserInterface
}

export function MessageFriendButton({ handleClick }: MessageFriendProps) {
	return (
	<div className="w-full flex gap-5 items-center bg-cyan-500/10 p-4 rounded-xl"
		onClick={handleClick}>
		<h1 className="font-helvetica hidden lg:block">Message</h1>
		<GrSend className="text-md md:text-2xl"/>
	</div>
	);
}

export function AddFriendButton({ friend, foundUsers, setFoundUsers }: AddFriendButtonProps) {
	const [ sent, setSent ] = useState<boolean>(false);
	const { user } = useAuth();
	const { socketFriend } = useSocket();
	const { setUnknowns, addFriend, unknowns } = useFriend();

	const handleClick = () => {
		addFriend(friend);
		socketFriend?.emit("add friend button clicked", user);
		setSent(true);
	}

	useEffect(() => {
		socketFriend?.on("add friend button handled", () => {
			const filtered = unknowns.filter((f) => f.username !== friend.username);
			setUnknowns(filtered);
			const foundFiltered = foundUsers.filter((f) => f.username !== friend.username);
			setFoundUsers(foundFiltered);
		});
		return () => {
			socketFriend?.off("add friend button handled");
		}
	}, [socketFriend]);

	return (
	<div className="w-full flex gap-5 items-center bg-cyan-500/10 p-4 rounded-xl"
		onClick={() => handleClick()}>
		<h1 className="font-helvetica hidden md:block">{sent ? "Sent" : "Add"}</h1>
		{sent ?
		<BiUserCheck className="text-md md:text-2xl"/> :
		<IoMdPersonAdd className="text-md md:text-2xl"/>}
	</div>
	);
}

export function UnfriendButton({user, handleUnfriend, unfriend, setSelectedUser, type}: UnfriendButtonProps) {
	const [ clicked, setClicked ] = useState<boolean>(false);
	const [ sent, setSent ] = useState<boolean>(false);
	const [ confirm, setConfirm ] = useState<boolean>(false);
	const { addFriend, acceptInvite } = useFriend();

	const handleClick = () => {
		(type === "research") ? addFriend(user) : acceptInvite(user);
		(type === "research") ? setSent(true) : setConfirm(true);
	}

	if (type === "research") {
	return (
	<button className="flex-1 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition duration-150 shadow-lg text-sm flex items-center justify-center space-x-2"
		onClick={() => handleClick()} >
		{sent ? 
			<BiUserCheck className="w-4 h-4"/> :
			<IoMdPersonAdd className="w-4 h-4"/>}
		<span>{sent ? "Sent" : "Add friend"}</span>
	</button>
	)} else if (type === "request") {
		return (
	<button className="flex-1 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition duration-150 shadow-lg text-sm flex items-center justify-center space-x-2"
		onClick={() => handleClick()} >
		{confirm ? 
			<BiUserCheck className="w-4 h-4"/> :
			<IoMdPersonAdd className="w-4 h-4"/>}
		<span>{confirm ? "Added" : "Confirm"}</span>
	</button>);
	}
	return (
	<button className="flex-1 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition duration-150 shadow-lg text-sm flex items-center justify-center space-x-2"
		onClick={() => handleUnfriend(user, clicked, setClicked, unfriend, setSelectedUser)} >
		{clicked ? 
			<BiUserCheck className="w-4 h-4"/> :
			<FaUserTimes className="w-4 h-4"/>}
		<span>{clicked ? "Unfriended" : "Unfriend"}</span>
	</button>
	);
}

export function BlockButton({user, handleBlocked, type}: BlockButtonProps) {
	const [ clicked, setClicked ] = useState<boolean>(false);
	const [ sent, setSent ] = useState<boolean>(false);
	const { unfriend } = useFriend();

	const handleSent = () => {
		unfriend(user);
		setSent(true);
	}

	if (type === "request") {
		return (
	<button className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-150 shadow-lg text-sm flex items-center justify-center space-x-2"
		onClick={() => handleSent()} >		
		<FaUserSlash className="w-4 h-4"/>
		<span>{sent ? "Deleted" : "Delete"}</span>
	</button>
	);}
	return (
	<button className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-150 shadow-lg text-sm flex items-center justify-center space-x-2"
		onClick={() => handleBlocked(user, clicked, setClicked)} >		
		<FaUserSlash className="w-4 h-4"/>
		{clicked ? 
			<span>Blocked</span> :
			<span>Block</span>}
	</button>
	);
}

export function UnblockButton({user}: UnblockButtonProps) {
	const { unblock } = useFriend();

	const handleClick = () => {
		unblock(user);
	}

	return (
		<div className="w-full flex gap-5 items-center bg-cyan-500/10 p-4 rounded-xl"
			onClick={() => handleClick()}>
			<h1 className="font-helvetica hidden md:block">Unblock</h1>
			<FaUserPen className="text-md md:text-2xl"/>
		</div>
	);
}
