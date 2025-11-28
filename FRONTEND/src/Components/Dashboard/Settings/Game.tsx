import { useEffect } from "react";
import { useDashboard, type ThemeColors } from "../../../Providers/DashboardProvider";
import { clearBoard, drawBall, drawPaddles, type Paddle, drawScore, } from "../../../Pong/draw";
import ThemeSelector from "./Theme";

interface GameProps {
    handleSubmit: (e: any) => void;
    hoverEffect: string;
}

function drawBoard(color: ThemeColors) {
    const board = document.getElementById("board") as HTMLCanvasElement;
    let ctx = board.getContext("2d") as CanvasRenderingContext2D;
    let ballRadius = board.width * 0.0125;
    let paddle1: Paddle = {
        width: board.width * 0.02,
        height: board.height * 0.15,
        x: 0,
        y: board.height / 2 - board.height * 0.075,
    };

    let paddle2: Paddle = {
        width: board.width * 0.02,
        height: board.height * 0.15,
        x: board.width - board.width * 0.02,
        y: board.height / 2 - board.height * 0.075,
    };
    clearBoard(ctx, board, color.boardBackground);
    drawBall(ctx, ballRadius, color.ball, board.width / 2, board.height / 2);
    drawPaddles(ctx, color.paddle1, color.paddle2, paddle1, paddle2);
    drawScore(ctx, board, "4", "2", color.score);
}

export default function Game({ handleSubmit, hoverEffect }: GameProps) {
    const { theme } = useDashboard();
    useEffect(() => {
        if (theme)
            drawBoard(theme);
    }, [theme]);

    return (
        <div className="flex flex-col items-center gap-6 w-full h-full p-4">
            <div className="flex justify-center w-full">
                <p
                    id="player1"
                    className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
                    style={{ color: theme?.paddle1 }}
                >Player 1</p>
                <canvas id="board" className="border-4 rounded-lg h-full w-[90%] shadow-lg"
                    style={{ backgroundColor: theme?.boardBackground, borderColor: theme?.boardBorder }}
                ></canvas>
                <p
                    id="player2"
                    className="font-bold [writing-mode:vertical-rl] rotate-180 text-center"
                    style={{ color: theme?.paddle2 }}
                >Player 2</p>
            </div>
            <ThemeSelector />
            <button
                onClick={handleSubmit}
                type="submit"
                className={`justify-center cursor-pointer rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 
                            focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${hoverEffect}`}>Update</button>
        </div>
    );
}