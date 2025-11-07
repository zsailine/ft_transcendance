import { useEffect, useState} from "react";
// import {start} from "../../OnlinePong/start.ts";
import io, { Socket } from "socket.io-client";

export default function OnlineTournament()
{
	const [socket, setSocket] = useState<Socket | null>(null);
	
	useEffect(() => {
		const s = io("http://localhost:3005/");
		setSocket(s);
		s.emit("tournament");
		s.on("ready", () =>
		{

		});

		return () => {
			s.disconnect();
		};
	}, []);
	return (
		<>
			<div className=""></div>
		</>
	);
}