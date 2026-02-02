import React from 'react';
import { GameState } from '../types';

interface DebugModalProps {
	isVisible: boolean;
	gameState: GameState;
	onClose: () => void;
	updateState: (state: Partial<GameState>) => void;
}

const DebugModal: React.FC<DebugModalProps> = ({ isVisible, onClose, gameState, updateState }) => {
	if (!isVisible) return null;

	const solvePuzzle = () => {
		// Fill grid with dummy answers for demo
		const newGrid = gameState.grid.map(row =>
			row.map(cell => ({
				...cell,
				value: cell.isBlack ? '' : (cell.answer || 'A')
			}))
		);
		updateState({ grid: newGrid, isSolved: true });
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
				<div className="bg-slate-100 px-6 py-4 flex justify-between items-center border-b border-slate-200">
					<h2 className="text-lg font-bold text-slate-800">Developer Tools</h2>
					<button onClick={onClose} className="text-slate-500 hover:text-slate-800">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div className="p-6 space-y-4">
					<div className="space-y-2">
						<p className="text-sm text-slate-500 font-medium">Game State</p>
						<div className="bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-600 border border-slate-200">
							<p>Selected: [{gameState.selectedRow}, {gameState.selectedCol}]</p>
							<p>Direction: {gameState.direction}</p>
							<p>Timer: {gameState.timer}s</p>
							<p>Solved: {gameState.isSolved.toString()}</p>
						</div>
					</div>

					<div className="space-y-2">
						<p className="text-sm text-slate-500 font-medium">Actions</p>
						<button
							onClick={solvePuzzle}
							className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
							</svg>
							Auto-Solve Puzzle
						</button>
					</div>
				</div>

				<div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-center text-slate-400">
					Crossword POC v0.1 • Dev Context
				</div>
			</div>
		</div>
	);
};

export default DebugModal;
