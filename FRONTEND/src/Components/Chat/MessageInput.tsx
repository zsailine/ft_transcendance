import { FaPaperPlane } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";

function MessageInput() {
	return (
	<div className="flex ml-8 mr-8 justify-center gap-4 font-helvetica h-[50px]">
		<button type="submit"
		className="w-12 text-sm text-white bg-slate-800 border-none rounded-lg flex justify-center items-center hover:ring-1 focus:ring-white">
			<AiFillPicture /></button>
		<input placeholder="Type Message" type="text"
		className="py-2 pl-10 pr-4 text-md text-white bg-slate-800 border-none rounded-lg flex-1" />
		<button type="submit"
		className="w-12 text-sm text-white bg-slate-800 border-none rounded-lg flex justify-center items-center hover:ring-1 focus:ring-white">
			<FaPaperPlane /></button>
	</div>
	)
}

export default MessageInput
