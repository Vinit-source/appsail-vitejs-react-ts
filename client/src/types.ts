export type Direction = 'across' | 'down';

export interface GridCell {
	row: number;
	col: number;
	value: string; // The user's input
	answer: string; // The correct answer
	number?: number; // Clue number (if applicable)
	isBlack: boolean;
	isCircle?: boolean; // Special theme indicator
}

export interface Clue {
	number: number;
	direction: Direction;
	text: string;
	row: number; // Starting row
	col: number; // Starting col
	length: number; // Length of word
	relatedClueIds?: string[]; // IDs of related clues if any
}

export interface PuzzleData {
	title: string;
	author: string;
	date: string;
	width: number;
	height: number;
	grid: GridCell[][];
	clues: {
		across: Clue[];
		down: Clue[];
	};
}

export interface GameState {
	grid: GridCell[][];
	selectedRow: number;
	selectedCol: number;
	direction: Direction;
	isSolved: boolean;
	timer: number; // in seconds
	isPaused: boolean;
}
