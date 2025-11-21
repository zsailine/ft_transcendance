import { useState } from "react"
import Friends from "./Friends";
import FriendRequests from "./FriendRequests";
import ResearchTab from "./ResearchTab";

function FriendTabSwitch() {
	const [ selectedTab, setSelectedTab ] = useState<React.ReactElement>(<Friends/>);
	const [ tabSelected, setTabSelected ] = useState<string>("friends");

	const getTabClasses = (tab: string) => {
		const base = "py-2 px-4 cursor-pointer transition-all duration-200 ease-in-out font-helvetica-b text-xl";
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
		}
	}

	return (
	<div className="text-white flex flex-col gap-10 items-center w-full">
		<div className="flex justify-center w-full border-slate-700/50 gap-20 p-5">
			<div onClick={() => handleClick("friends") } className={getTabClasses("friends")}>
				Friends
			</div>
			<div onClick={() => handleClick("requests") } className={getTabClasses("requests")}>
				Requests
			</div>
			<div onClick={() => handleClick("research") } className={getTabClasses("research")}>
				Research
			</div>
		</div>
		<div className="text-slate-200 p-4 w-full max-w-lg">
			{selectedTab}
		</div>
	</div>
	)
}

export default FriendTabSwitch
