import { FaUserPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

interface NoContactsProps {
	message: string
}

export function NoContacts({ message }: NoContactsProps) {
	return (
	<div className="flex flex-col items-center h-full text-center p-6 w-full">
		<div className={`${message === "friends" ? "size-20" : "size-15"} bg-gradient-to-br from-cyan-500/20 to-cyan-400/10  rounded-full flex items-center justify-center mb-6`}>
			<FaUserPlus className={`${message === "friends" ? "size-10" : "size-5"} text-cyan-400`} /> 
		</div>
		<h3 className={`${message === "friends" ? "text-xl" : "text-md"} font-semibold text-slate-200 mb-2 font-helvetica-b`}>No friends yet</h3>
		<p className={`text-slate-400 max-w-md font-helvetica ${message === "friends" ? "" : "text-sm"}`}>
			Add new friends
		</p>
	</div>
	);
}

export function NotFound() {
	return (
	<div className="flex flex-col items-center h-full text-center p-6 w-full">
		<div className="size-15 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10  rounded-full flex items-center justify-center mb-6">
			<FaSearch className="size-5 text-cyan-400" /> 
		</div>
		<p className="text-slate-400 max-w-md font-helvetica text-sm">No result</p>
	</div>
	);
}
