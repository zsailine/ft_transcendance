import type { ReactNode } from "react"

interface ChatBorderProps {
	children: ReactNode;
}

function ChatBorder({children} : ChatBorderProps) {
	return (
	<div className="mx-[1px] sm:mx-8 w-[95%] h-full bg-slate-900 rounded-2xl border-2 border-cyan-500/20 shadow-1xl sm:shadow-2xl shadow-cyan-500/50 flex overflow-hidden">
		{children}
	</div>
	)
}

export default ChatBorder
