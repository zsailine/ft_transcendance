import { toast } from "react-toastify";
import api from "../../Utils/axios";
import type { UserInterface } from "../ChatProvider";

interface FriendActionProps {
	setFriendRequests: (user: UserInterface[]) => void,
	setUnknowns: (user: UserInterface[] | ((prev: UserInterface[]) => UserInterface[])) => void,
	setBlockedUsers: (user: UserInterface[]) => void,
	friendRequests: UserInterface[]
}

export const useFriendAction = ({
	setFriendRequests, setUnknowns, setBlockedUsers, friendRequests
	}: FriendActionProps) => {
		const fetchFriendRequests = async () => {
		try {
			const response = await api.get("friend/request/all");
			if (response) {
				setFriendRequests(response.data);
			}
		} catch(error) {
			toast.error(`Something went wrong`);
		}
	}

	const fetchNotFriends = async () => {
		try {
			const response = await api.get("/friend/non-friends");
			if (response) {
				setUnknowns(response.data);
			}
		} catch(error) {
			toast.error("Something went wrong");
		}
	}

	const fetchBlockedUsers = async () => {
		try {
			const response = await api.get("/friend/blocked/all");
			if (response) {
				setBlockedUsers(response.data);
			}
		} catch(error) {
			toast.error("Something went wrong");
		}
	}

	const acceptInvite = async (friend: UserInterface) => {
		await api.put(`/friend/request/${friend.username}/accept`)
		.then(() => {
			toast("Friend request accepted");
		})
		.catch(() => {
			toast.error("Something went wrong");
			const filtered = friendRequests.filter((f) => f.username !== friend.username);
			setFriendRequests(filtered);
		})
	}

	const declineInvite = async (friend: UserInterface) => {
		await api.put(`/friend/request/${friend.username}/decline`)
		.then(() => {
			toast("Friend request declined");
		})
		.catch((err) => {
			toast.error("Something went wrong");
			const filtered = friendRequests.filter((f) => f.username !== friend.username);
			setFriendRequests(filtered);
		})
	}

	const addFriend = async (friend: UserInterface) => {
		await api.post(`/friend/request/${friend.username}`)
		.then(() => {
			toast("Friend request sent");
			setUnknowns(prev => prev.filter(u => u.username !== friend.username));
		})
		.catch(() => {
			toast.error("Something went wrong");
		})
	}

	const unfriend = async (friend: UserInterface) => {
		await api.put(`/friend/request/${friend.username}/decline`)
		.then(() => {});
	}

	const unblock = async (friend: UserInterface) => {
		await api.put(`/friend/request/${friend.username}/unblock`)
		.then(() => {
			toast("User unblocked successfully");
		})
	}

	return {
		fetchFriendRequests,
		fetchNotFriends,
		fetchBlockedUsers,
		acceptInvite,
		declineInvite,
		addFriend,
		unfriend,
		unblock
	};
}
