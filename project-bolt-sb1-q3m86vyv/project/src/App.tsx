import React from 'react';
import useGameLogic from './hooks/useGameLogic';
import StartScreen from './components/StartScreen';
import GameBoard from './components/GameBoard';
import GameHUD from './components/GameHUD';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const { gameState, startGame, restartGame, backToMenu } = useGameLogic();

  if (gameState.gameStatus === 'menu') {
    return <StartScreen onStart={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4">
      <div className="max-w-7xl mx-auto px-2">
        {gameState.gameStatus === 'playing' && (
          <GameHUD
            timeLeft={gameState.timeLeft}
            collectedKeys={gameState.collectedKeys}
            totalKeys={gameState.totalKeys}
            score={gameState.score}
            level={gameState.level}
            totalScore={gameState.totalScore}
            onRestart={restartGame}
          />
        )}
        
        <GameBoard
          maze={gameState.maze}
          playerPos={gameState.playerPos}
          keys={gameState.keys}
          traps={gameState.traps}
          exitPos={gameState.exitPos}
          collectedKeys={gameState.collectedKeys}
          totalKeys={gameState.totalKeys}
        />
        
        {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
          <GameOverScreen
            isWin={gameState.gameStatus === 'won'}
            score={gameState.score}
            timeLeft={gameState.timeLeft}
            collectedKeys={gameState.collectedKeys}
            totalKeys={gameState.totalKeys}
            level={gameState.level}
            totalScore={gameState.totalScore}
            onRestart={restartGame}
            onBackToMenu={backToMenu}
            onNextLevel={gameState.gameStatus === 'won' ? nextLevel : undefined}
          />
        )}
      </div>
    </div>
  );
}

export default App;