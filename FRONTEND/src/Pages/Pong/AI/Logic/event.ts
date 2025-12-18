import type { Paddle } from "../../../../Pong/logic";

function keySoloPlayerHandler(e: KeyboardEvent, paddle1: Paddle): void {
	switch(e.key) {
		case "w":
		case "W":
			paddle1.Direction = -1;
			break;
		case "s":
		case "S":
			paddle1.Direction = 1;
			break;
	}
}

function keySoloPlayerHandlerDown(e: KeyboardEvent, paddle1: Paddle, slide: boolean | undefined): void {
	if (!slide) {
		switch(e.key) {
			case "w":
			case "W":
			case "s":
			case "S":
				paddle1.Direction = 0;
				break;
		}
	}
}

export { keySoloPlayerHandler, keySoloPlayerHandlerDown }