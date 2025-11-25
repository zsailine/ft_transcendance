import axios from "axios";
import { getCookies } from "./verify.js";

const CHAT_URL = "http://localhost:3004";
const FRIEND_URL = "http://localhost:3006"

const getNonFriends = async (req, rep) => {
	try {
		const cookies = await getCookies(req);
		const users = await axios.get(`${CHAT_URL}/message/contacts`,
			{ headers: { 'Cookie': cookies }});
		const friends = await axios.get(`${FRIEND_URL}/friend/all`,
			{ headers: { 'Cookie': cookies }});
		const usernames = new Set(friends.data.map(friend => friend.username));
		const nonFriends = users.data.filter((user) => {
			return usernames.has(user.username) === false;
		});
		if (nonFriends) {
			return rep.status(200).send(nonFriends);
		} else {
			return rep.status(200).send([]);
		}
	} catch(error) {
		console.log(error.message);
		return rep.status(500).send({
			error: "Error in fetchin non Friends"
		});
	}
}

export {
	getNonFriends
};
