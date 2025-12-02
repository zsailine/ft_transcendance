import { toast } from "react-toastify";
import type { UserInterface } from "../../Providers/ChatProvider";
import api from "../../Utils/axios";

const block = async (friend: UserInterface) => {
	await api.put(`/friend/request/${friend.username}/block`);
}

export const handleUnfriend = (user: UserInterface, c: boolean, f: (b:boolean) => void,
		unfriend: (friend: UserInterface) => void,
		setSelectedUser: (user: UserInterface | null) => void) => {

	if (c) return;
	else f(!c);
	try {
		unfriend(user);
		setSelectedUser(null);
		toast("User successfully unfriended");
	} catch {
		f(!c);
		toast.error("Something went wrong!");
	}
}

export const handleBlocked = (user: UserInterface, c: boolean, f: (b: boolean) => void) => {
	if (c) return;
	else f(!c);
	try {
		block(user);
		toast("User successfully blocked");
	} catch(error) {
		f(!c);
		toast.error("Something went wrong!");
	}
}
