import FriendTabSwitch from "../../Components/Friend/FriendTabSwitch";
import ChatBorder from "../Chat/ChatBorder";

const Friend = () => {
	return (
	<ChatBorder>
		<div className="flex justify-center w-full">
			<FriendTabSwitch/>
		</div>
	</ChatBorder>
);
}
export default Friend;