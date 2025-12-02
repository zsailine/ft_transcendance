import { useState } from "react"
import Friends from "./Friends";
import FriendRequests from "./FriendRequests";
import ResearchTab from "./ResearchTab";
import { FaUserFriends, FaUserClock } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import BlockedUsers from "./BlockedUsers";
import { FaUserSlash } from "react-icons/fa";

function FriendTabSwitch() {
	const [ selectedTab, setSelectedTab ] = useState<React.ReactElement>(<Friends/>);
	const [ tabSelected, setTabSelected ] = useState<string>("friends");

	const getTabClasses = (tab: string) => {
		const base = "py-2 px-4 cursor-pointer transition-all duration-200 ease-in-out font-helvetica-b text-xl flex gap-2";
		const selected = "text-cyan-400 border-b-2 border-cyan-400";
		const unselected = "text-slate-400 hover:text-slate-200 border-b-2 border-transparent hover:border-slate-500";
		return `${base} ${tabSelected === tab ? selected : unselected}`
	}

	const handleClick = (event: string) => {
		if (event === "friends") {
			setSelectedTab(<Friends/>);
			setTabSelected("friends");
		} else if (event === "requests") {
			setSelectedTab(<FriendRequests/>);
			setTabSelected("requests");
		} else if (event === "research") {
			setSelectedTab(<ResearchTab/>);
			setTabSelected("research");
		} else if (event === "block") {
			setSelectedTab(<BlockedUsers/>);
			setTabSelected("block");
		}
	}

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
			<div onClick={() => handleClick("research") } className={getTabClasses("research")}>
				<MdPersonSearch />
				<p className="hidden md:block text-sm">Search</p>
			</div>
			<div onClick={() => handleClick("block") } className={getTabClasses("block")}>
				<FaUserSlash />
				<p className="hidden md:block text-sm">Blocked</p>
			</div>
		</div>
		<div className="text-slate-200 w-full flex-1">
			{selectedTab}
		</div>
	</div>
	)
}

export default FriendTabSwitch
