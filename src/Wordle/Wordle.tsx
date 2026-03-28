import { useCallback, useEffect, useReducer, useRef } from "react";
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

	const handleSubmit = () =>
		dispatch({
			type: WORDLE_ACTIONS.SUBMIT_ATTEMPT,
			payload: { correctWord, attempts },
		});

	const isFromInteractiveElement = (target: EventTarget | null): boolean =>
		target instanceof HTMLElement &&
		["BUTTON", "INPUT", "TEXTAREA"].includes(target.tagName);

	const handleKeyPress = (e: KeyboardEvent) => {
		const { key } = e;
		const isBackspace = key === "Backspace";
		const isChar = /^[a-zA-Z]$/.test(key);
		const isEnter = key === "Enter";
		const isSpace = key === " ";

		if (isFromInteractiveElement(e.target) && (isEnter || isSpace)) return;
		if (!(isBackspace || isChar || isEnter)) return;

		if (isEnter) {
			handleSubmit();
		} else {
			addChar(isBackspace ? "" : key.toUpperCase());
		}
	};

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

	const handlerRef = useRef(handleKeyPress);
	useEffect(() => {
		handlerRef.current = handleKeyPress;
	}, [handleKeyPress]);
	useEffect(() => {
		const listener = (e: KeyboardEvent) => handlerRef.current(e);
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	}, []);

	return (
		<div
			style={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				fontFamily: "monospace",
			}}
		>
			<h1
				style={{
					display: "flex",
					justifyContent: "center",
					gap: "0.5rem",
					padding: "1rem",
				}}
			>
				{heading.map((_, i) => (
					<span key={i}
						style={{
							backgroundColor:
								grid.status === GameStatus.Won
									? CellColor.Lightgreen
									: "gray",
							color: "white",
							padding: "0.5rem",
							borderRadius: "5px",
							width: "3rem",
							height: "3rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{_}
					</span>
				))}
			</h1>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexWrap: "wrap",
					flexDirection: "row",
					justifyContent: "space-around",
					alignItems: "center",
					padding: "1rem",
					gap: "1rem",
				}}
			>
				{grid.status === GameStatus.Ongoing && (
					<>
						<Grid
							data={grid.gridData}
							currentAttempt={grid.currentAttempt}
						/>
						<Keypad data={grid.keypad} addChar={addChar} />
					</>
				)}
				{grid.status === GameStatus.Won && (
					<h1>You Guessed the word!</h1>
				)}
				{grid.status === GameStatus.Lost && (
					<h1>You ran out of attempts!</h1>
				)}
			</div>
		</div>
	);
};
