import React from 'react';
import { GridCell, Direction } from '../types';

interface CrosswordGridProps {
	width: number;
	height: number;
	grid: GridCell[][];
	selectedRow: number;
	selectedCol: number;
	direction: Direction;
	onCellClick: (row: number, col: number) => void;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({
	width,
	height,
	grid,
	selectedRow,
	selectedCol,
	direction,
	onCellClick,
}) => {

	// Calculate checking logic (basic)
	const isSelected = (r: number, c: number) => r === selectedRow && c === selectedCol;

	const isInWord = (r: number, c: number) => {
		if (grid[r][c].isBlack) return false;
		if (selectedRow === -1 || selectedCol === -1) return false;

		// Check if this cell belongs to the currently selected word
		// This is a naive check; real logic would traverse the grid or use pre-calculated word IDs
		if (direction === 'across') {
			return r === selectedRow && !grid[r][c].isBlack &&
				// Ensure it's part of the contiguous block
				isPartOfWord(r, c, selectedRow, selectedCol, 'across');
		} else {
			return c === selectedCol && !grid[r][c].isBlack &&
				isPartOfWord(r, c, selectedRow, selectedCol, 'down');
		}
	};

	const isPartOfWord = (r: number, c: number, activeR: number, activeC: number, dir: Direction) => {
		// Simple adjacency check for demo purposes
		// In a real app, you'd have word IDs on each cell
		// Here we just check if they are on same row/col and no black squares between them

		if (dir === 'across') {
			if (r !== activeR) return false;
			const start = Math.min(c, activeC);
			const end = Math.max(c, activeC);
			for (let k = start; k <= end; k++) {
				if (grid[r][k].isBlack) return false;
			}
			return true;
		} else {
			if (c !== activeC) return false;
			const start = Math.min(r, activeR);
			const end = Math.max(r, activeR);
			for (let k = start; k <= end; k++) {
				if (grid[k][c].isBlack) return false;
			}
			return true;
		}
	};


	return (
		<div
			className="grid gap-[1px] bg-slate-800 border-[3px] border-slate-900 select-none shadow-lg w-full max-w-[600px] aspect-square mx-auto"
			style={{
				gridTemplateColumns: `repeat(${width}, 1fr)`,
				gridTemplateRows: `repeat(${height}, 1fr)`
			}}
		>
			{grid.map((row, rIndex) => (
				row.map((cell, cIndex) => {
					if (cell.isBlack) {
						return <div key={`${rIndex}-${cIndex}`} className="bg-black w-full h-full" />;
					}

					const selected = isSelected(rIndex, cIndex);
					const highlighted = !selected && isInWord(rIndex, cIndex);

					return (
						<div
							key={`${rIndex}-${cIndex}`}
							onClick={() => onCellClick(rIndex, cIndex)}
							className={`
                relative flex items-center justify-center cursor-pointer text-base sm:text-lg md:text-xl lg:text-2xl uppercase font-sans font-bold
                transition-colors duration-75
                ${selected ? 'bg-xword-selected text-black z-10' : ''}
                ${highlighted ? 'bg-xword-blue text-black' : ''}
                ${!selected && !highlighted ? 'bg-white hover:bg-slate-50 text-black' : ''}
              `}
						>
							{/* Clue Number */}
							{cell.number && (
								<span className="absolute top-[1px] left-[2px] text-[9px] sm:text-[10px] leading-none font-sans font-normal text-slate-800 pointer-events-none">
									{cell.number}
								</span>
							)}

							{/* Circle Theme */}
							{cell.isCircle && (
								<div className="absolute inset-0 m-[1px] border rounded-full border-slate-400 opacity-60 pointer-events-none"></div>
							)}

							{/* Value */}
							<span className="mt-[20%] pointer-events-none transform scale-100 origin-center block">
								{cell.value}
							</span>
						</div>
					);
				})
			))}
		</div>
	);
};

export default CrosswordGrid;
