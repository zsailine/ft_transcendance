import type { ReactNode } from "react"

interface ChatBorderProps {
	children: ReactNode;
}

function ChatBorder({children} : ChatBorderProps) {
	return (
	<div className="ml-8 mr-8 w-[95%] h-full bg-slate-900 rounded-2xl border-2 border-cyan-500/20 shadow-2xl shadow-cyan-500/50 flex overflow-hidden">
		{children}
	</div>
	)
}

export default ChatBorder
