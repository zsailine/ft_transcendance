import type { UserInterface } from "../ChatProvider";

export interface FriendInterface {
	friendRequests: UserInterface[],
	setFriendRequests: (friendRequests: UserInterface[]) => void,
	searchValue: string,
	setSearchValue: (searchValue: string) => void,
	selectedUserProfil: UserInterface | null,
	setSelectedUserProfil: (user: UserInterface | null) => void,
	unknowns: UserInterface[],
	setUnknowns: (unknown: UserInterface[]) => void,
	blockedUsers: UserInterface[],
	setBlockedUsers: (blocked: UserInterface[]) => void,
	blockedUsername: string[],
	setBlockedUsername: (block: string[]) => void,
	acceptInvite: (friend: UserInterface) => void,
	declineInvite: (friend: UserInterface) => void,
	addFriend: (friend: UserInterface) => void,
	unfriend: (friend: UserInterface) => void,
	unblock: (friend: UserInterface) => void,
	fetchNotFriends: () => void
};