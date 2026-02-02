import React from 'react';

interface HeaderProps {
	timer: number;
	onToggleDebug: () => void;
	onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ timer, onToggleDebug, onReset }) => {
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<header className="bg-white border-b border-slate-200 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

				{/* Left: Brand / Menu */}
				<div className="flex items-center gap-4">
					<button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 lg:hidden">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
						</svg>
					</button>
					<div className="flex items-center gap-2">
						<div className="md:hidden lg:flex w-8 h-8 bg-blue-600 text-white font-serif font-black flex items-center justify-center text-xl rounded">Z</div>
						<span className="font-sans font-bold text-lg tracking-tight text-slate-900 hidden sm:block">Games</span>
						<span className="mx-1 text-slate-300 hidden sm:block">|</span>
						<span className="font-serif font-bold text-xl text-slate-900">Crossword</span>
					</div>
				</div>

				{/* Center: Timer (Desktop) */}
				<div className="hidden md:flex items-center gap-2 text-slate-700 font-mono font-medium text-lg bg-slate-100 px-4 py-1 rounded-full border border-slate-200">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500">
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					{formatTime(timer)}
				</div>

				{/* Right: Actions */}
				<div className="flex items-center gap-2 md:gap-4">
					{/* Mobile Timer */}
					<div className="md:hidden font-mono font-medium text-slate-700 text-sm">
						{formatTime(timer)}
					</div>

					<button
						onClick={onToggleDebug}
						className="text-slate-400 hover:text-blue-600 transition-colors p-2"
						title="Dev Tools"
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
							<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
						</svg>
					</button>

					<div className="h-6 w-px bg-slate-200 hidden md:block"></div>

					<button
						onClick={onReset}
						className="text-sm font-sans font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
					>
						Reset
					</button>

					<button className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-5 rounded-full shadow-sm transition-all active:scale-95">
						Settings
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
