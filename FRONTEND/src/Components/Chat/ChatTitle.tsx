import {
	IoChatboxEllipsesSharp
} from "react-icons/io5";

function ChatTitle() {
	return (
	<div
		className="flex gap-5">
	
		<IoChatboxEllipsesSharp
			className="text-cyan-500/20 text-xl"/>

		<h3
			className="font-helvetica-b">Discussion</h3>
	</div>
	)
}

export default ChatTitle;
