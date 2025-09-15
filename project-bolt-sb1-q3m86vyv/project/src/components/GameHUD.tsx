import React from 'react';
import { Clock, Key, Trophy, RotateCcw } from 'lucide-react';

interface GameHUDProps {
  timeLeft: number;
  collectedKeys: number;
  totalKeys: number;
  score: number;
  level: number;
  totalScore: number;
  onRestart: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({
  timeLeft,
  collectedKeys,
  totalKeys,
  score,
  level,
  totalScore,
  onRestart
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 10) return 'text-red-600';
    if (timeLeft <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md mb-4 flex-wrap gap-2">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-indigo-600">Level {level}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className={`w-5 h-5 ${getTimeColor()}`} />
          <span className={`font-bold text-lg ${getTimeColor()}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-yellow-600" />
          <span className="font-bold text-lg">
            {collectedKeys}/{totalKeys}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-lg text-purple-600">
            {score}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="font-bold text-lg text-gray-800">
            {totalScore + score}
          </span>
        </div>
      </div>
      
      <button
        onClick={onRestart}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Restart</span>
      </button>
    </div>
  );
};

export default GameHUD;