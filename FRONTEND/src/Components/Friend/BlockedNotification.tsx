import { useEffect, useState } from "react"
import type { UserInterface } from "../../Providers/ChatProvider";
import { getBlocker } from "../../Utils/getter";
import { useAuth } from "../../Providers/AuthProvider";

interface BlockedNotificationProps {
	selectedUser: UserInterface
}

function BlockedNotification({selectedUser}: BlockedNotificationProps) {
	const { user } = useAuth();
	const [ blocker, setBlocker ] = useState<string | null>("");

	useEffect(() => {
		if (selectedUser) {
			getBlocker(selectedUser.username, setBlocker);
		}
	}, [selectedUser]);
	
	return (
	<div className="p-4 font-helvetica shrink-0 min-w-0 h-[70px] relative">
		<div className="flex justify-center gap-4 h-[50px] min-h-[50px] flex-1 shrink-0 text-md text-gray-500 italic">
			{ blocker === user ? 
			`You have blocked this contact` :
			`Messaging is unavalaible`}
		</div>
	</div>
	)
}

export default BlockedNotification