import { useChat } from "../../Providers/ChatProvider"
import { getImageUrlFromBlob } from "../../Utils/blob";
import { GiConsoleController } from "react-icons/gi";
import { AiFillNotification } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useAuth } from "../../Providers/AuthProvider";
import { generateRoom } from "../../Utils/tools";
import { useNavigate } from "react-router-dom";

function ReceiverHeader() {
	const { socket } = useAuth();
	const navigate = useNavigate();
	const { selectedUser } = useChat();
	const [join, setJoin] = useState(false);
	const [link, setLink] = useState("");

	function invite ()
	{
		if (!socket || !selectedUser) return;
		const room = generateRoom();
		const user = selectedUser.username;
		socket.emit("invite", {user , room});
		navigate(`/dashboard/play/online?mode=create&link=${room}`);
	}
	function joinRoom()
	{
		if (!link) return;
		navigate(`/dashboard/play/online?mode=join&link=${link}`);
	}
	useEffect(() => {
		if (!socket || !selectedUser) return ;
		setJoin(false);
		socket.on("join", (room) => {
			setJoin(true);
			setLink(room);
		})
	}, [socket, selectedUser]);

	return (
		<div className="flex items-center gap-4 rounded-lg cursor-pointer mb-0 pl-8">

			<div id="friends-avatar" className="w-15 h-15">
				{selectedUser?.avatar ?
					<img alt={selectedUser.username?.at(0)?.toUpperCase()}
						src={getImageUrlFromBlob(selectedUser.avatar.data)?.toString()}
						className="w-full h-full rounded-full object-cover border border-cyan-500/20" /> :
					<div className="w-full h-full rounded-full bg-cyan-500/10 text-cyan-300 flex items-center justify-center text-lg font-semibold border border-cyan-500/20">
						{selectedUser?.username?.at(0)?.toUpperCase()}
					</div>}
			</div>

			<div id="friends-username" className="text-sm text-white font-medium truncate font-helvetica">
				{selectedUser?.username}
			</div>
			<div className=" flex ml-auto mr-6">
			{join && (
				<AiFillNotification className="size-6 mt-1 mr-4 text-cyan-500" onClick={joinRoom} />
			)}
				<GiConsoleController className="size-8 text-cyan-500" onClick={invite} />
			</div>
		</div>
	);
}

export default ReceiverHeader
