import React, { useState } from "react";
import { type KeypadCell, type AddCharFunction } from "../types";

type KeypadProps = {
	data: KeypadCell[][];
	addChar: AddCharFunction;
};

type RowProps = {
	row: KeypadCell[];
	addChar: AddCharFunction;
};

type CellProps = {
	cell: KeypadCell;
	addChar: AddCharFunction;
};

export const Keypad = React.memo(({ data, addChar }: KeypadProps) => {
	return (
		<div
			style={{
				display: "flex",
				flex: 1,
				gap: "0.75rem",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{data.map((row, i) => (
				<Row key={`keypad-row-${i}`} row={row} addChar={addChar} />
			))}
		</div>
	);
});

const Row = React.memo(({ row, addChar }: RowProps) => (
	<div
		style={{
			display: "flex",
			gap: "0.5rem",
			justifyContent: "center",
		}}
	>
		{row.map((cell, i) => (
			<Cell key={`cell-${i}`} cell={cell} addChar={addChar} />
		))}
	</div>
));

const Cell = React.memo(({ cell, addChar }: CellProps) => {
	const [hovered, setHovered] = useState(false);
	const inNotUsed = cell.color === "white";
	return (
		<button
			style={{
				backgroundColor: inNotUsed ? "white" : "whitesmoke",
				boxSizing: "border-box",
				height: "clamp(1rem, 6vw, 3.5rem)",
				width: "clamp(1rem, 6vw, 3.5rem)",
				fontSize: hovered
					? "clamp(1.5rem, 2vw, 3rem)"
					: "clamp(1rem, 1.5vw, 1.5rem)",
				padding: "0.75rem",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: "20%",
				border: "none",
				color: inNotUsed ? "lightgray" : "silver",
				cursor: 'pointer'
			}}
			onClick={() => addChar(cell.value)}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{cell.value}
		</button>
	);
});
