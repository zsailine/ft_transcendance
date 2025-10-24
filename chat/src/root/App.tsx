import './App.css'

class Person {
	name: string;
	message: string;

	constructor(name: string, message: string) {
		this.name = name;
		this.message = message;
	}
}

const Title = () => {
	return (
		<>
			<h1 className="title">MESSAGE</h1>
		</>
	);
}

const Messages = (props: any) => {
	const	lists = props.message.map(one => {
		return (
		<>
			<h6 className="sender">{one.name}</h6>
			<p className="block">{one.message}</p>
		</>
		);
	});

	return (
		<>
			<div>{lists}</div>
		</>
	);
}

function App() {
	const	lists: Person[] = [
		new Person("Mitia", "HELLOOOO"),
		new Person("Bot", "Sup")]

	return (
		<>
			<Title/>
			<Messages message={lists}/>
		</>
	)
}

export default App
