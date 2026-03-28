export const GameStatus = {
	Ongoing: "ONGOING",
	Won: "WON",
	Lost: "LOST",
} as const;

export const CellColor = {
	Whitesmoke: "whitesmoke",
	White: "white",
	Khaki: "khaki",
	Lightgreen: "lightgreen",
} as const;

export type GameStatusType = (typeof GameStatus)[keyof typeof GameStatus];

export type CellColorType = (typeof CellColor)[keyof typeof CellColor];

export type GridType = {
	currentAttempt: number;
	gridData: GridRowType[];
	keypad: KeypadCell[][];
	status: GameStatusType;
};

export type GridCellType = {
	value: string;
	color: CellColorType;
};

export type GridRowType = {
	rowData: GridCellType[];
	isSubmitted: boolean;
};

export type KeypadCell = {
	value: string;
	color: CellColorType;
};

export type AddCharFunction = (key: string) => void;

export const WORDLE_ACTIONS = {
	ADD_CHAR: "ADD_CHAR",
	SUBMIT_ATTEMPT: "SUBMIT_ATTEMPT",
	RESET: "RESET",
} as const;

export type WordleAction =
	| {
			type: typeof WORDLE_ACTIONS.ADD_CHAR;
			payload: { key: string; attempts: number };
	  }
	| {
			type: typeof WORDLE_ACTIONS.SUBMIT_ATTEMPT;
			payload: { correctWord: string; attempts: number };
	  }
	| {
			type: typeof WORDLE_ACTIONS.RESET;
			payload: { wordLength: number; attempts: number };
	  };
