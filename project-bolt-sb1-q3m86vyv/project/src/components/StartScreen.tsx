import React from 'react';
import { Play, Target, Key, Skull, Clock } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Escape the Maze
          </h1>
          <p className="text-gray-600">
            Navigate through the maze, collect keys, and escape before time runs out!
          </p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Target className="w-6 h-6 text-green-600" />
            <span className="text-sm">Find the exit to escape the maze</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Key className="w-6 h-6 text-yellow-600" />
            <span className="text-sm">Collect all keys to unlock the exit</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <Skull className="w-6 h-6 text-red-600" />
            <span className="text-sm">Avoid traps or restart from the beginning</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600" />
            <span className="text-sm">Race against time for a higher score</span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Use Arrow Keys or WASD to move
          </p>
          <div className="inline-flex items-center space-x-2 text-xs text-gray-400">
            <span className="px-2 py-1 bg-gray-100 rounded">↑</span>
            <span className="px-2 py-1 bg-gray-100 rounded">↓</span>
            <span className="px-2 py-1 bg-gray-100 rounded">←</span>
            <span className="px-2 py-1 bg-gray-100 rounded">→</span>
          </div>
        </div>
        
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Play className="w-6 h-6" />
          <span>Start Game</span>
        </button>
      </div>
    </div>
  );
};

export default StartScreen;