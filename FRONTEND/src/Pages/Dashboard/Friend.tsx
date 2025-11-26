import FriendTabSwitch from "../../Components/Friend/FriendTabSwitch";
import ChatBorder from "../Chat/ChatBorder";

const Friend = () => {
	return (
	<div className="flex justify-center h-full w-full min-h-[450px]">
		<ChatBorder>
			<div className="flex w-full h-full">
				<FriendTabSwitch/>
			</div>
		</ChatBorder>
	</div>
);
}
export default Friend;