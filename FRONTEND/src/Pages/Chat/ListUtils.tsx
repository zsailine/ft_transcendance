import { GrSend } from "react-icons/gr";
import { IoMdPersonAdd } from "react-icons/io";
import { BiUserCheck } from "react-icons/bi";
import type { UserInterface } from "../../Providers/ChatProvider";
import { useState } from "react";
import { useFriend } from "../../Providers/FriendProvider";
import { FaUserTimes, FaUserSlash } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";

interface MessageFriendProps {
	handleClick: () => void
}

interface AddFriendButtonProps {
	friend: UserInterface
}

interface UnfriendButtonProps {
	user: UserInterface,
	handleUnfriend: (user: UserInterface, c: boolean, f: (b: boolean) => void,
		unfriend: (user: UserInterface) => void, 
		setSelectedUser: (user: UserInterface | null) => void) => void,
	unfriend: (user: UserInterface) => void,
	setSelectedUser: (user: UserInterface | null) => void
}

interface BlockButtonProps {
	user: UserInterface,
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

export function AddFriendButton({ friend }: AddFriendButtonProps) {
	const [ sent, setSent ] = useState<boolean>(false);
	const { addFriend } = useFriend();

	const handleClick = () => {
		addFriend(friend);
		setSent(true);
	}

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

export function UnfriendButton({user, handleUnfriend, unfriend, setSelectedUser}: UnfriendButtonProps) {
	const [ clicked, setClicked ] = useState<boolean>(false);

	return (
	<button className="flex-1 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition duration-150 shadow-lg text-sm flex items-center justify-center space-x-2"
		onClick={() => handleUnfriend(user, clicked, setClicked, unfriend, setSelectedUser)} >
		{clicked ? 
		<>
			<BiUserCheck className="w-4 h-4"/>
			<span>Unfriended</span>
		</> 
			:
		<>
			<FaUserTimes className="w-4 h-4"/>
			<span>Unfriend</span>
		</>}
	</button>
	);
}

export function BlockButton({user, handleBlocked}: BlockButtonProps) {
	const [ clicked, setClicked ] = useState<boolean>(false);

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
