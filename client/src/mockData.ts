import { PuzzleData, GridCell, Clue } from './types';

/**
 * Simulates fetching data from Zoho Backend.
 * This constructs a 15x15 grid similar to the image provided.
 */
export const fetchPuzzleFromZoho = async (): Promise<PuzzleData> => {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 800));

	const width = 15;
	const height = 15;

	// Helper to create empty grid
	const grid: GridCell[][] = Array.from({ length: height }, (_, r) =>
		Array.from({ length: width }, (_, c) => ({
			row: r,
			col: c,
			value: '',
			answer: '',
			isBlack: false,
		}))
	);

	// Hardcoded puzzle layout based on the visual style of the prompt
	// 1 = White, 0 = Black
	// This is a simplified pattern for demo purposes
	const pattern = [
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1], // Row 0
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1], // Middle
		[1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1], // Row 14
	];

	// Apply pattern and dummy answers
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			grid[r][c].isBlack = pattern[r][c] === 0;
			if (!grid[r][c].isBlack) {
				grid[r][c].answer = 'A'; // Dummy answer for all cells for demo
			}
			// Add some circles like the image
			if ((r === 1 && c === 13) || (r === 2 && c === 13) || (r === 6 && c === 5)) {
				grid[r][c].isCircle = true;
			}
		}
	}

	// Generate basic clues and numbers
	const clues = { across: [] as Clue[], down: [] as Clue[] };
	let currentNum = 1;

	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			if (grid[r][c].isBlack) continue;

			let assigned = false;
			// Check Across
			if (c === 0 || grid[r][c - 1].isBlack) {
				// Look ahead to see if word length > 1
				if (c + 1 < width && !grid[r][c + 1].isBlack) {
					grid[r][c].number = currentNum;
					clues.across.push({
						number: currentNum,
						direction: 'across',
						text: `Mock clue for ${currentNum} Across`,
						row: r,
						col: c,
						length: 3, // simplified logic
					});
					assigned = true;
				}
			}

			// Check Down
			if (r === 0 || grid[r - 1][c].isBlack) {
				if (r + 1 < height && !grid[r + 1][c].isBlack) {
					grid[r][c].number = currentNum;
					clues.down.push({
						number: currentNum,
						direction: 'down',
						text: `Mock clue for ${currentNum} Down`,
						row: r,
						col: c,
						length: 3, // simplified logic
					});
					assigned = true;
				}
			}

			if (assigned) currentNum++;
		}
	}

	// Hardcode specific clues from image for realism
	const specificAcross = clues.across.find(c => c.number === 56);
	if (specificAcross) specificAcross.text = '"Yay, team!"';

	const specificDown = clues.down.find(c => c.number === 60);
	if (specificDown) specificDown.text = '18-wheeler';

	return {
		title: "Consciousness Carriers",
		author: "Aimee Lucido",
		date: "February 2026",
		width,
		height,
		grid,
		clues,
	};
};
