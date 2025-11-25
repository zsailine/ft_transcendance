import { FaPaperPlane } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useChat } from "../../Providers/ChatProvider";
import { MdClose } from "react-icons/md";
import { getImageUrlFromBlob } from "../../Utils/blob";
import type { ImageBuffer } from "../../Providers/DashboardProvider";

function MessageInput() {

	const [ text, setText ] = useState<string>("");
	const [ image, setImage ] = useState<ImageBuffer | null>(null);
	const { sendMessages } = useChat();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!text.trim() && !image) {
			return ;
		}
		sendMessages({
			text: text.trim(),
			image: image
		});
		setText("");
		setImage(null);
	}

	const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const arrayBuffer = reader.result as ArrayBuffer;
			const bufferArray = Array.from(new Uint8Array(arrayBuffer));
			setImage({ type: "Buffer", data: bufferArray });
		}
		reader.readAsArrayBuffer(file);
	}

	const removeImage = () => setImage(null);

	return (
	<div className="p-4 font-helvetica flex-1 shrink-0 min-w-0">

		{image && (
			<div className="max-w-3xl mb-3 ml-16 flex items-center flex-1">
				<div className="relative">
					<img alt="Preview"
						src={getImageUrlFromBlob(image?.data) || ""}
						className="w-20 h-20 object-cover rounded-lg border border-slate-700" />
					<button type="button"
						className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
						onClick={removeImage} >
						<MdClose className="w-4 h-4" />
					</button>
				</div>
			</div>
		)}

		<form className="flex justify-center gap-4 h-[50px] min-h-[50px] flex-1 shrink-0" onSubmit={handleSubmit}>
			<label
				htmlFor="image-upload"
				className="min-w-12 shrink-0 w-12 text-sm text-white bg-slate-800 border-none rounded-lg flex justify-center items-center hover:ring-1 focus:ring-white cursor-pointer">
				<AiFillPicture />
			</label>
			<input
				id="image-upload"
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleImage}/>

			<input placeholder="Aa"
				type="text"
				className="min-w-0 py-2 pl-4 pr-4 text-md font-helvetica italic text-white bg-slate-800 border-none rounded-lg flex-1"
				value={text}
				onChange={(e) => setText(e.target.value)} />

			<button type="submit"
				className="min-w-12 shrink-0 w-12 text-sm text-white bg-slate-800 border-none rounded-lg flex justify-center items-center hover:ring-1 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={!text && !image}>
				<FaPaperPlane />
			</button>
		</form>
	</div>
	)
}

export default MessageInput;
