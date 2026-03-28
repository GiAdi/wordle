import React from "react";
import { type GridCellType, type GridRowType } from "../types";

type GridProps = { data: GridRowType[]; currentAttempt: number };
type RowProps = { row: GridRowType; isCurrent: boolean };
type CellProps = { cell: GridCellType };

export const Grid = ({ data, currentAttempt }: GridProps) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			{data.map((row, i) => (
				<Row
					key={`row-${i}`}
					row={row}
					isCurrent={i === currentAttempt}
				/>
			))}
		</div>
	);
};

const Row = React.memo(({ row, isCurrent }: RowProps) => {
	return(
		<div
			style={{
				display: "flex",
				gap: isCurrent
					? "clamp(0.6rem, 2vw, 1.5rem)"
					: "clamp(0.4rem, 1vw, 1rem)",
				borderRadius: "25px",
				padding: isCurrent
					? "clamp(1rem, 5vw, 1.2rem)"
					: "clamp(0.2rem, 2vw, 0.5rem)",
				justifyContent: "center",
				color: "darkslategray",
				fontSize: isCurrent
					? "clamp(1.5rem, 3vw, 3rem)"
					: "clamp(1.2rem, 2vw, 2rem)",
			}}
		>
			{row.rowData.map((cell, i) => (
				<Cell key={`cell-${i}`} cell={cell} />
			))}
		</div>
	);
});

const Cell = React.memo(({ cell }: CellProps) => (
	<span
		style={{
			backgroundColor: cell.color,
			height: "clamp(2rem, 10vw, 4rem)",
			width: "clamp(2rem, 10vw, 4rem)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			borderRadius: "20%",
		}}
	>
		{cell.value}
	</span>
));
