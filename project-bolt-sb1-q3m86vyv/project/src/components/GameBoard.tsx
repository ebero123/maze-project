import React from 'react';
import { CellType, Position } from '../types';
import { Key, Zap, Target, User, Skull } from 'lucide-react';

interface GameBoardProps {
  maze: CellType[][];
  playerPos: Position;
  keys: Position[];
  traps: Position[];
  exitPos: Position;
  collectedKeys: number;
  totalKeys: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  maze,
  playerPos,
  keys,
  traps,
  exitPos,
  collectedKeys,
  totalKeys
}) => {
  const getCellContent = (x: number, y: number) => {
    // Player position
    if (playerPos.x === x && playerPos.y === y) {
      return <User className="w-3 h-3 text-blue-600" />;
    }

    // Exit position (locked/unlocked based on keys)
    if (exitPos.x === x && exitPos.y === y) {
      return (
        <Target 
          className={`w-3 h-3 ${
            collectedKeys === totalKeys 
              ? 'text-green-600 animate-pulse' 
              : 'text-gray-400'
          }`} 
        />
      );
    }

    // Keys
    const keyAtPosition = keys.find(key => key.x === x && key.y === y);
    if (keyAtPosition) {
      return <Key className="w-2 h-2 text-yellow-500 animate-bounce" />;
    }

    // Traps
    const trapAtPosition = traps.find(trap => trap.x === x && trap.y === y);
    if (trapAtPosition) {
      return <Skull className="w-3 h-3 text-red-600" />;
    }

    return null;
  };

  const getCellStyle = (cellType: CellType, x: number, y: number) => {
    const baseStyle = "w-5 h-5 flex items-center justify-center text-xs font-bold transition-all duration-200";
    
    switch (cellType) {
      case 'wall':
        return `${baseStyle} bg-gray-800 border border-gray-700`;
      case 'path':
        // Special styling for exit
        if (exitPos.x === x && exitPos.y === y) {
          return `${baseStyle} ${
            collectedKeys === totalKeys 
              ? 'bg-green-100 border-2 border-green-400' 
              : 'bg-gray-100 border-2 border-gray-400'
          }`;
        }
        // Special styling for traps
        const trapAtPosition = traps.find(trap => trap.x === x && trap.y === y);
        if (trapAtPosition) {
          return `${baseStyle} bg-red-100 border border-red-300`;
        }
        // Special styling for keys
        const keyAtPosition = keys.find(key => key.x === x && key.y === y);
        if (keyAtPosition) {
          return `${baseStyle} bg-yellow-100 border border-yellow-300`;
        }
        // Player position highlight
        if (playerPos.x === x && playerPos.y === y) {
          return `${baseStyle} bg-blue-100 border-2 border-blue-400 shadow-lg`;
        }
        return `${baseStyle} bg-gray-50 border border-gray-200`;
      default:
        return `${baseStyle} bg-gray-50 border border-gray-200`;
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="grid gap-0 border-2 border-gray-800 rounded-lg overflow-hidden shadow-2xl bg-white" style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 31}, minmax(0, 1fr))` }}>
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={getCellStyle(cell, x, y)}
            >
              {getCellContent(x, y)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;