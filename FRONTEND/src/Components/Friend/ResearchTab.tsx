import { useState, type FormEvent } from "react"
import SearchBar from "../Chat/SearchBar"
import type { UserInterface } from "../../Providers/ChatProvider";

function ResearchTab() {
	const [ searchValue, setSearchValue ] = useState<string>("");
	const	[ foundUser, setFoundUser ] = useState<UserInterface[]>([]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	}

  return (
	<div>
		<form onSubmit={handleSubmit}>
			<SearchBar
				searchValue={searchValue}
				setSearchValue={setSearchValue}/>
		</form>
	</div>
  )
}

export default ResearchTab;
