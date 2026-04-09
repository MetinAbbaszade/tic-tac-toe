"use client";

import { useMemo, useState } from "react";

type Mark = "X" | "O";
type Cell = Mark | null;
type Winner = Mark | "Tie" | null;

export default function Home() {
	const [playerOneName, setPlayerOneName] = useState("Player 1");
	const [playerTwoName, setPlayerTwoName] = useState("Player 2");
	const [started, setStarted] = useState(false);
	const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
	const [currentPlayer, setCurrentPlayer] = useState<Mark>("X");

	const players = useMemo(() => {
		return {
			X: {
				name: playerOneName || "Player 1",
				mark: "X" as Mark,
			},
			O: {
				name: playerTwoName || "Player 2",
				mark: "O" as Mark,
			},
		};
	}, [playerOneName, playerTwoName]);

	const GameBoard = (() => {
		const getBoard = () => board;

		const reset = () => setBoard(Array(9).fill(null));

		const placeMark = (index: number, mark: Mark) => {
			if (board[index] !== null) return false;

			setBoard((prev) => {
				const next = [...prev];
				next[index] = mark;
				return next;
			});

			return true;
		};

		return {
			getBoard,
			reset,
			placeMark,
		};
	})();

	const GameController = (() => {
		const winningCombos = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		const start = () => {
			setStarted(true);
			GameBoard.reset();
			setCurrentPlayer("X");
		};

		const playround = (index: number) => {
			const winner = GameController.getWinner();

			if (winner) return;

			const played = GameBoard.placeMark(index, currentPlayer);

			if (!played) return;

			setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
		};

		const getWinner = () => {
			const currentBoard = GameBoard.getBoard();

			for (const [a, b, c] of winningCombos) {
				if (
					currentBoard[a] &&
					currentBoard[a] === currentBoard[b] &&
					currentBoard[b] === currentBoard[c]
				) {
					return currentBoard[a];
				}
			}

			if (currentBoard.every((cell) => cell !== null)) {
				return "Tie";
			}

			return null;
		};

		return {
			start,
			restart: start,
			playround,
			getWinner,
		};
	})();

	const winner = GameController.getWinner();

	const statusText = !started
		? "Enter player names and start the game"
		: winner === "Tie"
			? "It's a tie!"
			: winner
				? `${players[winner].name} wins!`
				: `${players[currentPlayer].name}'s turn (${currentPlayer})`;

	return (
		<div className="game-page">
			<div className="game-card">
				<h1>Tic-Tac-Toe</h1>

				<div className="controls">
					<input
						type="text"
						placeholder="Player 1 name"
						value={playerOneName}
						onChange={(e) => setPlayerOneName(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Player 2 name"
						value={playerTwoName}
						onChange={(e) => setPlayerTwoName(e.target.value)}
					/>

					<div className="actions">
						<button type="button" onClick={GameController.start}>
							Start Game
						</button>
						<button type="button" onClick={GameController.restart}>
							Restart
						</button>
					</div>
				</div>

				<p className="status">{statusText}</p>

				<div className="wrapper">
					{board.map((cell, index) => (
						<button
							key={index}
							type="button"
							className="cell-button"
							onClick={() => GameController.playround(index)}
							disabled={!started || !!winner || cell !== null}
						>
							<div className="box">{cell}</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
