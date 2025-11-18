import { useState } from "react"
import Friends from "./Friends";
import FriendRequests from "./FriendRequests";
import ResearchTab from "./ResearchTab";

function FriendTabSwitch() {
	const [ selectedTab, setSelectedTab ] = useState<React.ReactElement>(<Friends/>);

	const handleClick = (event: string) => {
		if (event === "friends") {
			setSelectedTab(<Friends/>)
		} else if (event === "requests") {
			setSelectedTab(<FriendRequests/>)
		} else if (event === "research") {
			setSelectedTab(<ResearchTab/>)
		}
	}

	return (
	<div className="text-white flex flex-col gap-20 items-center w-full">
		<div className="flex gap-10">
			<div onClick={() => handleClick("friends") }>Friends</div>
			<div onClick={() => handleClick("requests") }>Requests</div>
			<div onClick={() => handleClick("research") }>Research</div>
		</div>
		<div className="text-white">{selectedTab}</div>
	</div>
	)
}

export default FriendTabSwitch
