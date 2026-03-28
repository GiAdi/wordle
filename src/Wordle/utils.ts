import {
	CellColor,
	GameStatus,
	type GridType,
	type KeypadCell,
	type GridRowType,
	type CellColorType,
} from "./types";

const KEYPAD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export const createInitialGrid = ([wordLength, attemptsCount]: [
	number,
	number,
]): GridType => {
	const keypad: KeypadCell[][] = KEYPAD_ROWS.map((row) =>
		Array.from(row, (char) => ({
			value: char,
			color: CellColor.Whitesmoke,
		})),
	);

	const gridData: GridRowType[] = Array.from(
		{ length: attemptsCount },
		() => ({
			rowData: Array.from({ length: wordLength }, () => ({
				value: "",
				color: CellColor.Whitesmoke,
			})),
			isSubmitted: false,
		}),
	);

	return {
		currentAttempt: 0,
		gridData,
		keypad,
		status: GameStatus.Ongoing,
	};
};

export const computeRowColors = (
	row: GridRowType,
	word: string,
): GridRowType => {
	const coloredRow = { ...row, rowData: [...row.rowData], isSubmitted: true };

	// First pass: mark correct positions (green)
	for (let i = 0; i < word.length; i++) {
		if (word[i] === coloredRow.rowData[i].value) {
			coloredRow.rowData[i] = {
				...coloredRow.rowData[i],
				color: CellColor.Lightgreen,
			};
		}
	}

	// Second pass: mark correct letters in wrong positions (yellow)
	for (let i = 0; i < word.length; i++) {
		if (coloredRow.rowData[i].color !== "lightgreen") {
			const matchIndex = coloredRow.rowData.findIndex(
				(cell) =>
					cell.value === word[i] &&
					cell.color === CellColor.Whitesmoke,
			);
			if (matchIndex > -1) {
				coloredRow.rowData[matchIndex] = {
					...coloredRow.rowData[matchIndex],
					color: CellColor.Khaki,
				};
			}
		}
	}

	return coloredRow;
};

const getColorPriority = (color: CellColorType): number => {
	switch (color) {
		case "lightgreen":
			return 4;
		case "khaki":
			return 3;
		case "white":
			return 2;
		case "whitesmoke":
			return 1;
		default:
			return 0;
	}
};
export const updateKeypadColors = (
	row: GridRowType,
	keypad: KeypadCell[][],
): KeypadCell[][] => {
	// Determine the best color for each letter based on the row
	const bestColorByKey: Record<string, CellColorType> = {};
	row.rowData.forEach((rowCell) => {
		const existing = bestColorByKey[rowCell.value];
		if (
			!existing ||
			getColorPriority(rowCell.color) > getColorPriority(existing)
		) {
			bestColorByKey[rowCell.value] =
				rowCell.color === CellColor.Whitesmoke
					? CellColor.White
					: rowCell.color;
		}
	});

	// Update keypad only if necessary
	const updatedKeypad: KeypadCell[][] = [];
	let keypadChanged = false;

	keypad.forEach((keypadRow) => {
		let rowChanged = false;
		const updatedRow = keypadRow.map((keypadCell) => {
			const bestColor = bestColorByKey[keypadCell.value];
			if (
				!bestColor ||
				getColorPriority(bestColor) <=
					getColorPriority(keypadCell.color)
			) {
				return keypadCell;
			}

			rowChanged = true;
			keypadChanged = true;
			return { ...keypadCell, color: bestColor };
		});

		updatedKeypad.push(rowChanged ? updatedRow : keypadRow);
	});
	return keypadChanged ? updatedKeypad : keypad;
};
