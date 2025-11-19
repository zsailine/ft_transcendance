interface SearchBarProps {
	searchValue: string,
	setSearchValue: (searchValue: string) => void
}

function SearchBar({ searchValue, setSearchValue }: SearchBarProps) {
	return (
	<div>
		<input placeholder="Search"
			type="text"
			value={searchValue}
			onChange={(e) => setSearchValue(e.target.value)}
			className="w-full py-2 pl-10 pr-4 text-sm text-white bg-slate-800 border-none rounded-lg focus:outline-none font-helvetica" />
	</div>
	)
}
 
export default SearchBar
