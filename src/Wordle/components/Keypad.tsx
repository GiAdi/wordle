import React, { useState } from "react";
import { type KeypadCell, type AddCharFunction } from "../types";
import { IoReturnDownBack } from "react-icons/io5";
import { IoBackspaceOutline } from "react-icons/io5";

type KeypadProps = {
	data: KeypadCell[][];
	addChar: AddCharFunction;
	handleSubmit: () => void;
};

type RowProps = {
	row: KeypadCell[];
	addChar: AddCharFunction;
	handleSubmit: () => void;
};

type CellProps = {
	cell: KeypadCell;
	addChar: AddCharFunction;
	handleSubmit: () => void;
};

const keypadCellStyle = {
	backgroundColor: "whitesmoke",
	color: "silver",
	height: "clamp(1.5rem, 10vw, 3.5rem)",
	fontSize: "clamp(1rem, 1.5vw, 1.5rem)",
	padding: "0.75rem",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: "10px",
	cursor: "pointer",
	border: "none",
};

export const Keypad = React.memo(
	({ data, addChar, handleSubmit }: KeypadProps) => {
		return (
			<div
				style={{
					display: "flex",
					flex: 1,
					flexDirection: "column",
					position: "relative",
					gap: "0.75rem",
					alignItems: "center",
					maxWidth: "clamp(400px,100vw, 700px)",
					justifyContent: "center",
				}}
			>
				{data.map((row, i) => (
					<Row
						key={`keypad-row-${i}`}
						row={row}
						addChar={addChar}
						handleSubmit={handleSubmit}
					/>
				))}
			</div>
		);
	},
);

const Row = React.memo(({ row, addChar, handleSubmit }: RowProps) => (
	<div
		style={{
			display: "flex",
			flex: 1,
			width: "100%",
			gap: "0.5rem",
			justifyContent: "center",
		}}
	>
		{row.map((cell, i) => (
			<Cell
				cell={cell}
				addChar={addChar}
				handleSubmit={handleSubmit}
				key={i}
			/>
		))}
	</div>
));

const Cell = React.memo(({ cell, addChar, handleSubmit }: CellProps) => {
	const [hovered, setHovered] = useState(false);
	const inNotUsed = cell.color === "white";
	return (
		<>
			{cell.value === "Z" && (
				<button style={keypadCellStyle} onClick={() => addChar("")}>
					<IoBackspaceOutline size={24}/>
				</button>
			)}
			<button
				style={{
					...keypadCellStyle,
					backgroundColor: inNotUsed ? "white" : "whitesmoke",
					width: "clamp(1rem, 8vw, 3.5rem)",
					fontSize: hovered
						? "clamp(2rem, 2vw, 3rem)"
						: "clamp(1.2rem, 1.5vw, 1.5rem)",
					color: inNotUsed ? "lightgray" : "silver",
					outline: hovered ? "1px solid silver" : "none",
				}}
				onClick={() => addChar(cell.value)}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				{cell.value}
			</button>
			{cell.value === "M" && (
				<button style={keypadCellStyle} onClick={handleSubmit}>
					<IoReturnDownBack size={24}/>
				</button>
			)}
		</>
	);
});
