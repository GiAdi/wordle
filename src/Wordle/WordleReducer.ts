import {
	CellColor,
	WORDLE_ACTIONS,
	GameStatus,
	type GridCellType,
	type GridType,
	type GridRowType,
	type WordleAction,
} from "./types";
import {
	computeRowColors,
	createInitialGrid,
	updateKeypadColors,
} from "./utils";

export const wordleReducer = (
	state: GridType,
	action: WordleAction,
): GridType => {
	switch (action.type) {
		case WORDLE_ACTIONS.ADD_CHAR: {
			const { key, attempts } = action.payload;
			if (state.currentAttempt >= attempts) return state;

			const currentRow = state.gridData[state.currentAttempt];
			const indexToUpdate = key
				? currentRow.rowData.findIndex((cell) => !cell.value)
				: currentRow.rowData.findLastIndex((cell) => cell.value);

			if (indexToUpdate === -1) return state;

			const newCell: GridCellType = {
				value: key,
				color: CellColor.Whitesmoke,
			};

			const newRow: GridRowType = {
				...currentRow,
				rowData: currentRow.rowData.map((cell, i) =>
					i === indexToUpdate ? newCell : cell,
				),
			};

			const newGridData = state.gridData.map((row, i) =>
				i === state.currentAttempt ? newRow : row,
			);

			return {
				...state,
				gridData: newGridData,
			};
		}
		case WORDLE_ACTIONS.SUBMIT_ATTEMPT: {
			const currentRow = state.gridData[state.currentAttempt];
			const { correctWord, attempts } = action.payload;

			if (state.currentAttempt >= attempts) return state;
			if (!currentRow.rowData[correctWord.length - 1].value) return state;

			const coloredRow = computeRowColors(currentRow, correctWord);
			if (
				coloredRow.rowData.every(
					(_) => _.color === CellColor.Lightgreen,
				)
			)
				return {
					...state,
					status: GameStatus.Won,
				};
			else if (state.currentAttempt === attempts - 1)
				return {
					...state,
					status: GameStatus.Lost,
				};

			const newGridData = state.gridData.map((row, i) =>
				i === state.currentAttempt ? coloredRow : row,
			);
			const updatedKeypad = updateKeypadColors(coloredRow, state.keypad);
			return {
				...state,
				gridData: newGridData,
				keypad: updatedKeypad,
				currentAttempt: state.currentAttempt + 1,
			};
		}
		case WORDLE_ACTIONS.RESET: {
			const { wordLength, attempts } = action.payload;
			return createInitialGrid([wordLength, attempts]);
		}
		default:
			return state;
	}
};
