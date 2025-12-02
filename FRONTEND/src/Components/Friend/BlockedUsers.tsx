import { useFriend } from "../../Providers/FriendProvider"

function BlockedUsers() {
	const { blockedUsers } = useFriend();
  return (
	<div>
		Blocked User
	</div>
  )
}

export default BlockedUsers
