function Typing() {
	return (
	<div className="flex items-center gap-1 bg-gray-700/50 px-4 py-3 rounded-2xl rounded-bl-none w-fit animate-pulse">
		<div className="flex gap-1 ml-1">
			<span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
			<span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
			<span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
		</div>
	</div>
  )
}

export default Typing