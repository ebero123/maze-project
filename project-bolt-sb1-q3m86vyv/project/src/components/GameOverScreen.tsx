import React from 'react';
import { Trophy, Clock, Key, RotateCcw, Home } from 'lucide-react';

interface GameOverScreenProps {
  isWin: boolean;
  score: number;
  timeLeft: number;
  collectedKeys: number;
  totalKeys: number;
  level: number;
  totalScore: number;
  onRestart: () => void;
  onBackToMenu: () => void;
  onNextLevel?: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  isWin,
  score,
  timeLeft,
  collectedKeys,
  totalKeys,
  level,
  totalScore,
  onRestart,
  onBackToMenu,
  onNextLevel
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 ${
        isWin ? 'border-4 border-green-400' : 'border-4 border-red-400'
      }`}>
        <div className="text-center mb-6">
          <div className={`text-6xl mb-4 ${isWin ? 'text-green-500' : 'text-red-500'}`}>
            {isWin ? '🎉' : '💀'}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            isWin ? 'text-green-700' : 'text-red-700'
          }`}>
            {isWin ? `Level ${level} Complete!` : 'Game Over'}
          </h2>
          <p className="text-gray-600">
            {isWin 
              ? 'Congratulations! Ready for the next challenge?' 
              : 'Time ran out or you hit a trap. Better luck next time!'}
          </p>
        </div>
        
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Level</span>
            </div>
            <span className="font-bold text-indigo-700">{level}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">Level Score</span>
            </div>
            <span className="font-bold text-purple-700">{score}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Total Score</span>
            </div>
            <span className="font-bold text-gray-700">{totalScore + score}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Time Left</span>
            </div>
            <span className="font-bold text-blue-700">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold">Keys Collected</span>
            </div>
            <span className="font-bold text-yellow-700">{collectedKeys}/{totalKeys}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {isWin && onNextLevel && (
            <button
              onClick={onNextLevel}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Next Level</span>
              <span className="text-lg">→</span>
            </button>
          )}
          
          <button
            onClick={onRestart}
            className={`${isWin && onNextLevel ? 'flex-1' : 'flex-1'} bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isWin ? 'Replay Level' : 'Try Again'}</span>
          </button>
          
          <button
            onClick={onBackToMenu}
            className={`${isWin && onNextLevel ? 'flex-none px-6' : 'flex-1'} bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2`}
          >
            <Home className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;