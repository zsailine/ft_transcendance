import { LuBellRing } from "react-icons/lu";
import { FaUser } from "react-icons/fa";

export function NoFriendRequests() {
	return (
	<div className="flex flex-col items-center p-10 h-full text-center w-full">
			<div className="size-15 md:size-20 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mb-6">
				<LuBellRing className="size-5 md:size-10 text-cyan-400" /> 
			</div>
			<h3 className="text-md md:text-xl font-semibold text-slate-200 mb-2 font-helvetica-b">No pending requests</h3>
			<p className="text-slate-400 max-w-md font-helvetica text-sm md:text-base">
				You're all caught up!
			</p>
		</div>
	)
}

export function NoBlockedUser() {
	return (
		<div className="flex flex-col items-center p-10 h-full text-center w-full">
			<div className="size-15 md:size-20 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mb-6">
				<FaUser className="size-5 md:size-10 text-cyan-400" /> 
			</div>
			<h3 className="text-md md:text-xl font-semibold text-slate-200 mb-2 font-helvetica-b">No blocked users</h3>
			<p className="text-slate-400 max-w-md font-helvetica text-sm md:text-base">
				You're all caught up!
			</p>
		</div>
	);
}
