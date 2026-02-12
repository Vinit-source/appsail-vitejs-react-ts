import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPuzzleFromZoho } from './mockData';
import { PuzzleData, GameState, Clue } from './types';
import CrosswordGrid from './components/CrosswordGrid';
import ClueList from './components/ClueList';
import Header from './components/Header';
import DebugModal from './components/DebugModal';

// Emulate ENV variable for dev mode check
const ENV = "dev";

const App: React.FC = () => {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    selectedRow: 0,
    selectedCol: 0,
    direction: 'across',
    isSolved: false,
    timer: 117, // Start at 01:57 for demo matching image
    isPaused: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Load Data
  useEffect(() => {
    fetchPuzzleFromZoho().then(data => {
      setPuzzle(data);
      setGameState(prev => ({ ...prev, grid: data.grid }));
      setLoading(false);
      // Focus hidden input on load
      setTimeout(() => inputRef.current?.focus(), 100);
    });
  }, []);

  // Timer
  useEffect(() => {
    if (!loading && !gameState.isPaused && !gameState.isSolved) {
      const interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, gameState.isPaused, gameState.isSolved]);

  // Handle Reset
  const handleReset = useCallback(() => {
    if (!puzzle) return;
    // Reset grid values but keep structure
    const newGrid = gameState.grid.map(row =>
      row.map(cell => ({ ...cell, value: '' }))
    );

    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      timer: 0,
      isSolved: false,
      isPaused: false
    }));

    // Refocus
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [gameState.grid, puzzle]);

  // Determine current active clue based on selection
  const getCurrentClue = useCallback((): Clue | null => {
    if (!puzzle) return null;
    const { selectedRow, selectedCol, direction, grid } = gameState;

    // Find the number associated with the current word
    let r = selectedRow;
    let c = selectedCol;

    if (grid[r][c].isBlack) return null;

    // Backtrack to find start of word
    if (direction === 'across') {
      while (c > 0 && !grid[r][c - 1].isBlack) c--;
    } else {
      while (r > 0 && !grid[r - 1][c].isBlack) r--;
    }

    const cellNumber = grid[r][c].number;
    if (!cellNumber) return null;

    const clueList = direction === 'across' ? puzzle.clues.across : puzzle.clues.down;
    return clueList.find(cl => cl.number === cellNumber) || null;
  }, [puzzle, gameState.selectedRow, gameState.selectedCol, gameState.direction, gameState.grid]);

  // Handle Input logic
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!puzzle) return;

    const { key, } = e;
    const { selectedRow, selectedCol, direction, grid } = gameState;

    // Navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();
      let dR = 0, dC = 0;
      if (key === 'ArrowUp') dR = -1;
      if (key === 'ArrowDown') dR = 1;
      if (key === 'ArrowLeft') dC = -1;
      if (key === 'ArrowRight') dC = 1;

      let newR = selectedRow;
      let newC = selectedCol;

      // Simple bounds check (could be enhanced to skip black squares)
      do {
        newR += dR;
        newC += dC;
      } while (
        newR >= 0 && newR < puzzle.height &&
        newC >= 0 && newC < puzzle.width &&
        grid[newR][newC].isBlack
      );

      if (newR >= 0 && newR < puzzle.height && newC >= 0 && newC < puzzle.width) {
        setGameState(prev => ({ ...prev, selectedRow: newR, selectedCol: newC }));
      }
      return;
    }

    // Toggle Direction on same cell click or Space
    if (key === ' ') {
      e.preventDefault();
      setGameState(prev => ({ ...prev, direction: prev.direction === 'across' ? 'down' : 'across' }));
      return;
    }

    // Backspace
    if (key === 'Backspace') {
      const newGrid = [...grid.map(row => [...row])];
      if (newGrid[selectedRow][selectedCol].value !== '') {
        newGrid[selectedRow][selectedCol].value = '';
        setGameState(prev => ({ ...prev, grid: newGrid }));
      } else {
        // Move back and delete
        let dR = direction === 'down' ? -1 : 0;
        let dC = direction === 'across' ? -1 : 0;

        let newR = selectedRow + dR;
        let newC = selectedCol + dC;

        if (newR >= 0 && newR < puzzle.height && newC >= 0 && newC < puzzle.width && !grid[newR][newC].isBlack) {
          newGrid[newR][newC].value = '';
          setGameState(prev => ({ ...prev, grid: newGrid, selectedRow: newR, selectedCol: newC }));
        }
      }
      return;
    }

    // Character Input
    if (key.length === 1 && key.match(/[a-zA-Z]/)) {
      const char = key.toUpperCase();
      const newGrid = [...grid.map(row => [...row])];
      newGrid[selectedRow][selectedCol].value = char;

      // Move to next cell
      let dR = direction === 'down' ? 1 : 0;
      let dC = direction === 'across' ? 1 : 0;
      let newR = selectedRow + dR;
      let newC = selectedCol + dC;

      // Skip black squares (simple skip active logic)
      while (newR >= 0 && newR < puzzle.height && newC >= 0 && newC < puzzle.width && newGrid[newR][newC].isBlack) {
        newR += dR;
        newC += dC;
      }

      const canMove = newR >= 0 && newR < puzzle.height && newC >= 0 && newC < puzzle.width;

      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        selectedRow: canMove ? newR : prev.selectedRow,
        selectedCol: canMove ? newC : prev.selectedCol
      }));
    }

  }, [puzzle, gameState]);

  const handleCellClick = (r: number, c: number) => {
    if (gameState.grid[r][c].isBlack) return;

    setGameState(prev => {
      // If clicking active cell, toggle direction
      if (prev.selectedRow === r && prev.selectedCol === c) {
        return { ...prev, direction: prev.direction === 'across' ? 'down' : 'across' };
      }
      // Else select cell
      return { ...prev, selectedRow: r, selectedCol: c };
    });
    inputRef.current?.focus();
  };

  const handleClueClick = (clue: Clue) => {
    setGameState(prev => ({
      ...prev,
      selectedRow: clue.row,
      selectedCol: clue.col,
      direction: clue.direction
    }));
    inputRef.current?.focus();
  };

  if (loading || !puzzle) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-slate-600 font-sans">Connecting to Zoho...</span>
      </div>
    );
  }

  const currentClue = getCurrentClue();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      {/* Hidden Input for Global Keyboard Capture on Mobile/Desktop */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute top-0 left-0 h-0 w-0"
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
      />

      <Header
        timer={gameState.timer}
        onToggleDebug={() => setShowDebug(!showDebug)}
        onReset={handleReset}
      />

      {/* Current Clue Bar */}
      <div className="bg-[#a7d8ff] py-3 px-4 text-center sticky top-[53px] z-40 shadow-sm border-b border-blue-200 min-h-[50px] flex items-center justify-center">
        <span className="text-lg md:text-xl font-medium truncate max-w-3xl">
          {currentClue ? (
            <>
              <span className="font-bold">{currentClue.number} {currentClue.direction.toUpperCase()}</span> • {currentClue.text}
            </>
          ) : 'Select a square to begin'}
        </span>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:flex gap-8">

        {/* Left Side: Grid */}
        <div className="flex-1 lg:max-w-[65%] xl:max-w-[60%] flex flex-col">
          <CrosswordGrid
            width={puzzle.width}
            height={puzzle.height}
            grid={gameState.grid}
            selectedRow={gameState.selectedRow}
            selectedCol={gameState.selectedCol}
            direction={gameState.direction}
            onCellClick={handleCellClick}
          />

          <div className="mt-6 text-center text-slate-700">
            <h1 className="text-xl font-serif italic mb-1">{puzzle.title} <span className="font-normal not-italic text-base">by {puzzle.author}</span></h1>
            <p className="text-sm text-slate-500">Powered by PuzzleMe™ (Mocked via Zoho)</p>
          </div>

          <div className="mt-8 text-center px-4 md:px-12 text-lg font-serif leading-relaxed text-slate-800">
            <p>This crossword is inspired by the {puzzle.date} issue of Scientific American. <a href="#" className="underline font-bold italic">Read it here.</a></p>
          </div>
        </div>

        {/* Right Side: Clue Lists (Desktop) / Bottom (Mobile) */}
        <div className="mt-8 lg:mt-0 lg:flex-1 grid grid-cols-2 lg:grid-cols-2 gap-4 h-[50vh] lg:h-[calc(100vh-160px)] sticky lg:top-32">
          <ClueList
            title="ACROSS"
            clues={puzzle.clues.across}
            activeDirection={gameState.direction}
            activeNumber={currentClue?.direction === 'across' ? currentClue.number : null}
            onClueClick={handleClueClick}
          />
          <ClueList
            title="DOWN"
            clues={puzzle.clues.down}
            activeDirection={gameState.direction}
            activeNumber={currentClue?.direction === 'down' ? currentClue.number : null}
            onClueClick={handleClueClick}
          />
        </div>
      </div>

      {ENV === 'dev' && (
        <DebugModal
          isVisible={showDebug}
          gameState={gameState}
          onClose={() => setShowDebug(false)}
          updateState={(newState) => setGameState(prev => ({ ...prev, ...newState }))}
        />
      )}
    </div>
  );
};

export default App;
