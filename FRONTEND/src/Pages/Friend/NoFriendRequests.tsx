import { LuBellRing } from "react-icons/lu";

function NoFriendRequests() {
  return (
	<div className="flex flex-col items-center justify-center h-full text-center p-6 w-full">
      <div className="size-20 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mb-6">
        <LuBellRing className="size-10 text-cyan-400" /> 
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2 font-helvetica-b">No pending requests</h3>
      <p className="text-slate-400 max-w-md font-helvetica">
        You're all caught up!
      </p>
    </div>
  )
}

export default NoFriendRequests
