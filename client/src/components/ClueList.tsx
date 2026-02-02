import React, { useRef, useEffect } from 'react';
import { Clue, Direction } from '../types';

interface ClueListProps {
  title: string;
  clues: Clue[];
  activeDirection: Direction;
  activeNumber: number | null;
  onClueClick: (clue: Clue) => void;
}

const ClueList: React.FC<ClueListProps> = ({ title, clues, activeDirection, activeNumber, onClueClick }) => {
  const activeRef = useRef<HTMLLIElement>(null);
  
  const isCorrectDirection = title.toLowerCase() === activeDirection;

  useEffect(() => {
    if (activeRef.current && isCorrectDirection) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeNumber, isCorrectDirection]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50 border border-slate-200 shadow-sm rounded-lg">
      <h3 className="bg-slate-100 p-2 font-bold text-sm tracking-widest text-slate-700 border-b border-slate-200 sticky top-0 uppercase text-center">
        {title}
      </h3>
      <ul className="flex-1 overflow-y-auto p-0 m-0 list-none no-scrollbar">
        {clues.map((clue) => {
          const isActive = isCorrectDirection && clue.number === activeNumber;
          return (
            <li
              key={`${clue.direction}-${clue.number}`}
              ref={isActive ? activeRef : null}
              onClick={() => onClueClick(clue)}
              className={`
                flex px-4 py-2 cursor-pointer border-b border-slate-100 text-[15px]
                hover:bg-blue-50 transition-colors duration-150
                ${isActive ? 'bg-xword-highlight font-medium' : ''}
              `}
            >
              <span className="font-bold w-6 shrink-0 text-right mr-3 text-slate-900">{clue.number}</span>
              <span className={`text-slate-800 leading-snug ${isActive ? 'text-black' : ''}`}>
                {clue.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ClueList;
