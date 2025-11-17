import { useChat } from "../../Providers/ChatProvider"

function SearchBar() {
	const { searchValue, setSearchValue } = useChat();

	return (
	<div>
		<input placeholder="Search"
			type="text"
			value={searchValue}
			onChange={(e) => setSearchValue(e.target.value)}
			className="w-full py-2 pl-10 pr-4 text-sm text-white bg-slate-800 border-none rounded-lg focus:outline-none" />
	</div>
	)
}
 
export default SearchBar
