import { TbMessageDots } from "react-icons/tb";

function NoConversation() {
	return (
	<div className="flex flex-col items-center justify-center h-full text-center p-6 w-full">
		<div className="size-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6">
			<TbMessageDots className="size-10 text-cyan-400" />
		</div>
		<h3 className="text-xl font-semibold text-slate-200 mb-2 font-helvetica-b">Select a conversation</h3>
		<p className="text-slate-400 max-w-md font-helvetica">
	 		Choose a friend to chat with
		</p>
	</div>
	)
}

export default NoConversation
