import { GrSend } from "react-icons/gr";
import { IoMdPersonAdd } from "react-icons/io";
import { BiUserCheck } from "react-icons/bi";
import type { UserInterface } from "../../Providers/ChatProvider";
import { useState } from "react";
import { useFriend } from "../../Providers/FriendProvider";

interface MessageFriendProps {
	handleClick: () => void
}

interface AddFriendButtonProps {
	friend: UserInterface
}

export function MessageFriendButton({ handleClick }: MessageFriendProps) {
	return (
	<div className="w-full flex gap-5 items-center bg-cyan-500/10 p-4 rounded-xl"
		onClick={handleClick}>
		<h1 className="font-helvetica hidden lg:block">Message</h1>
		<GrSend className="text-2xl"/>
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
		<BiUserCheck className="text-2xl"/> :
		<IoMdPersonAdd className="text-2xl"/>}
	</div>
	);
}
