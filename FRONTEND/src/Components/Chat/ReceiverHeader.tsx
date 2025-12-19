import { useChat } from "../../Providers/ChatProvider"
import { getImageUrlFromBlob } from "../../Utils/blob";
import { GiConsoleController } from "react-icons/gi";
import { AiFillNotification } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useAuth } from "../../Providers/AuthProvider";
import { generateRoom } from "../../Utils/tools";
import { useNavigate } from "react-router-dom";
import { BsBoxArrowInRight } from "react-icons/bs";
import { getRelationship } from "../../Utils/getter";

interface ReceiverHeaderProps {
	click: () => void
}

function ReceiverHeader({click}: ReceiverHeaderProps) {
	const { socket, user, onlineUsers } = useAuth();
	const navigate = useNavigate();
	const { selectedUser, setSelectedUser } = useChat();
	const [relation, setRelation] = useState<string | null>("");
	const [join, setJoin] = useState(false);
	const [link, setLink] = useState("");

	function invite() {
		if (!user || !socket || !selectedUser || relation === "blocked") return;
		const room = generateRoom();
		const toInvite = selectedUser.username;
		socket.emit("invite", { user, toInvite, room });
		setLink(room);
	}

	function joinRoom() {
		if (!link) return;
		navigate(`/dashboard/play/online?mode=invite&link=${link}`);
	}

	useEffect(() => {
		if (!socket || !selectedUser) return;
		setJoin(false);
		const handler = (data: any) => {
			if (data.user !== selectedUser.username) return;
			socket.emit("received", selectedUser.username);
			setJoin(true);
			setLink(data.room);
		}
		socket.on("join", handler);
		return () => {
			socket.off("join", handler);
		};
	}, [socket, selectedUser]);

	useEffect(() => {
		if (!link.length || !socket) return;

		const handler = () => {
			socket.off("received", handler);
			setJoin(true);
		};

		socket.on("received", handler);

		return () => {
			socket.off("received", handler);
		};
	}, [link, socket]);

	useEffect(() => {
		getRelationship(selectedUser?.username || "", setRelation);
	}, [selectedUser]);

	return (
		<div className="flex items-center gap-4 rounded-lg cursor-pointer mb-0 pl-8 shrink-0">

			{selectedUser && <div id="friends-avatar" className="relative w-12 h-12 md:w-15 md:h-15" onClick={click}>
				<img alt={selectedUser?.username?.at(0)?.toUpperCase()}
					src={selectedUser?.avatar ? getImageUrlFromBlob(selectedUser.avatar.data)?.toString() : "/images/avatar.jpg"}
					className="w-full h-full rounded-full object-cover border border-cyan-500/20" />
				<span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#101728] ${onlineUsers.includes(selectedUser.username) ? "bg-green-400" : ""} rounded-full border-2 border-gray-600`}></span>
			</div>}

			<div id="friends-username" className="text-sm text-white font-medium truncate font-helvetica hover:underline"
				onClick={click}>
				{selectedUser?.username}
			</div>
			<div className=" flex ml-auto mr-6 gap-2 md:gap-4">
				{join && (
					<AiFillNotification className="size-6 md:size-8 text-cyan-500" onClick={joinRoom} />
				)}
				<GiConsoleController className={`size-6 md:size-8 text-cyan-500 ${relation === "blocked" ? "opacity-50 cursor-not-allowed" : ""}`}
					onClick={invite} />
				<BsBoxArrowInRight className="size-6 md:size-8 text-cyan-500"
					onClick={() => setSelectedUser(null)} />
			</div>
		</div>
	);
}

export default ReceiverHeader
