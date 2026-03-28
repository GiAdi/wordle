import { useCallback, useEffect, useReducer } from "react";
import { wordleReducer } from "./WordleReducer";
import { createInitialGrid } from "./utils";
import { Keypad } from "./components/Keypad";
import { Grid } from "./components/Grid";
import { CellColor, GameStatus, WORDLE_ACTIONS } from "./types";

type WordleProps = { word: string; attempts: number };
export const Wordle = ({ word, attempts }: WordleProps) => {
	const correctWord = word.trim().toUpperCase();

	const [grid, dispatch] = useReducer(
		wordleReducer,
		[correctWord.length, attempts],
		createInitialGrid,
	);

	const addChar = useCallback(
		(key: string): void => {
			dispatch({
				type: WORDLE_ACTIONS.ADD_CHAR,
				payload: { key, attempts },
			});
		},
		[attempts],
	);

	const handleSubmit = useCallback(
		() =>
			dispatch({
				type: WORDLE_ACTIONS.SUBMIT_ATTEMPT,
				payload: { correctWord, attempts },
			}),
		[attempts, correctWord],
	);

	const isFromInteractiveElement = (target: EventTarget | null): boolean =>
		target instanceof HTMLElement &&
		["BUTTON", "INPUT", "TEXTAREA"].includes(target.tagName);

	const heading =
		grid.status === GameStatus.Won
			? grid.gridData[grid.currentAttempt].rowData.map((_) => _.value)
			: ["W", "O", "R", "D", "L", "E"];

	useEffect(() => {
		dispatch({
			type: WORDLE_ACTIONS.RESET,
			payload: { wordLength: correctWord.length, attempts },
		});
	}, [attempts, correctWord]);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			const { key } = e;
			const isBackspace = key === "Backspace";
			const isChar = /^[a-zA-Z]$/.test(key);
			const isEnter = key === "Enter";
			const isSpace = key === " ";

			if (isFromInteractiveElement(e.target) && (isEnter || isSpace))
				return;
			if (!(isBackspace || isChar || isEnter)) return;

			if (isEnter) {
				handleSubmit();
			} else {
				addChar(isBackspace ? "" : key.toUpperCase());
			}
		};
		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [addChar, handleSubmit]);

	return (
		<div
			style={{
				margin:0,
				height: "100svh",
				display: "flex",
				flexDirection: "column",
				fontFamily: "monospace",
				alignItems: "center",
				justifyContent: "space-between",
				padding: '1rem',
				boxSizing: 'border-box',
			}}
		>
			<h1
				style={{
					display: "flex",
					justifyContent: "center",
					gap: "0.2rem",
				}}
			>
				{heading.map((_, i) => (
					<span
						key={i}
						style={{
							backgroundColor:
								grid.status === GameStatus.Won
									? CellColor.Lightgreen
									: "gray",
							color: "white",
							padding: "0.5rem",
							borderRadius: "5px",
							width: "2rem",
							height: "2rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{_}
					</span>
				))}
			</h1>
			{grid.status === GameStatus.Ongoing && (
				<>
					<Grid
						data={grid.gridData}
						currentAttempt={grid.currentAttempt}
					/>
					<Keypad
						data={grid.keypad}
						addChar={addChar}
						handleSubmit={handleSubmit}
					/>
				</>
			)}
			{grid.status === GameStatus.Won && <h1>You Guessed the word!</h1>}
			{grid.status === GameStatus.Lost && (
				<h1>You ran out of attempts!</h1>
			)}
		</div>
	);
};
