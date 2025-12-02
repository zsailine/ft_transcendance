import { type Paddle} from "./logic";


function keyHandler(e: KeyboardEvent, paddle1: Paddle, paddle2: Paddle): void {
	switch (e.key) {
		case "w":
		case "W":
			paddle1.Direction = -1;
			break;
		case "s":
		case "S":
			paddle1.Direction = 1;
			break;
		case "o":
		case "O":
			paddle2.Direction = -1;
			break;
		case "l":
		case "L":
			paddle2.Direction = 1;
			break;
	}
}

function keyUpHandler(e: KeyboardEvent, paddle1: Paddle, paddle2: Paddle, slide: boolean | undefined): void {
	if (!slide) {
		switch (e.key) {
			case "w":
			case "W":
			case "s":
			case "S":
				paddle1.Direction = 0;
				break;
			case "o":
			case "O":
			case "l":
			case "L":
				paddle2.Direction = 0;
				break;
		}
	}
}

export {keyHandler, keyUpHandler }