import { useChat } from "../../Providers/ChatProvider"
import { getImageUrlFromBlob } from "../../Utils/blob";

function ReceiverHeader() {

	const { selectedUser } = useChat();
	
	return (
		<div className="flex items-center gap-4 rounded-lg cursor-pointer mb-0 pl-8">

			<div id="friends-avatar" className="w-15 h-15">
				{ selectedUser?.avatar ?
				<img	alt={selectedUser.username?.at(0)?.toUpperCase()}
						src={getImageUrlFromBlob(selectedUser.avatar.data)?.toString()}
						className="w-full h-full rounded-full object-cover border border-cyan-500/20" /> :
				<div className="font-helvetica w-full h-full rounded-full bg-cyan-500/10 text-cyan-300 flex items-center justify-center text-lg font-semibold border border-cyan-500/20">
					{selectedUser?.username?.at(0)?.toUpperCase()}
				</div> }
			</div>

			<div id="friends-username" className="text-sm text-white font-medium truncate font-helvetica">
				{selectedUser?.username}
			</div>

		</div>
	);
}

export default ReceiverHeader
