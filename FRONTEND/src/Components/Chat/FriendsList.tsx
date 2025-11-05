import { useEffect, useState } from "react"
import api from "../../Utils/axios"
import { getImageUrlFromBlob } from "../../Utils/blob";

export interface Users {
	id: number,
	username: string,
	avatar: { 
		type: "Buffer";
		data: number[];
} | null;
}

function FriendsList() {
	const [ usersList, setUsersList ] = useState<Users[] | null>(null);

	const getFriends = async () => {
		try {
			const { data } = await api.get("/message/contacts");
			if (data)
				setUsersList(data);
		} catch(error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getFriends();
	}, []);

	return (
		<div className="flex flex-col h-full overflow-y-auto font-helvetica">       
			{usersList ? (
				usersList.map((user) => {
					const avatarDataArray = user.avatar ? user.avatar.data : null;
					const imgSrc = getImageUrlFromBlob(avatarDataArray);
					return (
						<div key={user.username} className="p-3 text-white border-b border-slate-700 hover:bg-slate-800 cursor-pointer flex items-center gap-5 text-lg">
							{imgSrc ? (
								<img src={imgSrc} alt={user.username} className="w-8 h-8 rounded-full mr-3 object-cover" />
							) : (
								<div className="w-10 h-10 rounded-full mr-3 bg-cyan-600 flex items-center justify-center text-sm font-bold">
									{user.username.charAt(0).toUpperCase()}
								</div>
							)}
							<span className="font-medium">{user.username}</span>
						</div>
					);
				})
			) : (
				<p className="text-cyan-200/50 p-3">No Friends</p>
			)}
		</div>
	);
}

export default FriendsList;
