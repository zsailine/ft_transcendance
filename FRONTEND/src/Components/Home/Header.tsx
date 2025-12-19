export default function Header({username} : {username:string | null}) {
	return (
		<>
			<header className="mb-12 text-center md:text-left">
				<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2">
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
						BEYOND THE  PONG
					</span>
				</h1>
				<p className="mt-4 text-xl text-cyan-200/80">
					Welcome <span className="font-bold text-slate-300">{username}</span>
				</p>
			</header>
		</>
	)
}