import { useState } from "react"
import Friends from "./Friends";
import FriendRequests from "./FriendRequests";

function FriendTabSwitch() {
	const [ selectedTab, setSelectedTab ] = useState<React.ReactElement>(<Friends/>);

	const handleClick = (event: string) => {
		if (event === "friends") {
			setSelectedTab(<Friends/>)
		} else if (event === "requests") {
			setSelectedTab(<FriendRequests/>)
		}
	}

	return (
	<div className="text-white flex flex-col gap-20 items-center">
		<div className="flex gap-10">
			<div onClick={() => handleClick("friends") }>Friends</div>
			<div onClick={() => handleClick("requests") }>Requests</div>
		</div>
		<div className="text-white">{selectedTab}</div>
	</div>
	)
}

export default FriendTabSwitch
