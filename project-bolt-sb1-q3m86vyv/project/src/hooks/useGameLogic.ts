import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Position, CellType, MazeConfig } from '../types';
import { MazeGenerator } from '../utils/MazeGenerator';

const getConfigForLevel = (level: number): MazeConfig => {
  const baseConfig = {
    width: 31,
    height: 21,
    keyCount: 3,
    trapCount: 5,
    timeLimit: 120
  };

  return {
    width: Math.min(41, baseConfig.width + Math.floor(level / 3) * 2),
    height: Math.min(31, baseConfig.height + Math.floor(level / 3) * 2),
    keyCount: Math.min(6, baseConfig.keyCount + Math.floor(level / 2)),
    trapCount: Math.min(12, baseConfig.trapCount + level),
    timeLimit: Math.max(90, baseConfig.timeLimit - level * 5)
  };
};

const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    maze: [],
    playerPos: { x: 1, y: 1 },
    startPos: { x: 1, y: 1 },
    exitPos: { x: 19, y: 13 },
    keys: [],
    traps: [],
    collectedKeys: 0,
    totalKeys: 3,
    timeLeft: 120,
    score: 0,
    gameStatus: 'menu',
    gameStartTime: 0,
    level: 1,
    totalScore: 0
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewMaze = useCallback((level: number) => {
    const config = getConfigForLevel(level);
    const generator = new MazeGenerator(config.width, config.height);
    const maze = generator.generate();
    
    const startPos = { x: 1, y: 1 };
    const exitCells = generator.findPathCellsAwayFrom(maze, startPos, 10);
    const exitPos = exitCells[Math.floor(Math.random() * exitCells.length)];
    
    const keys: Position[] = [];
    const traps: Position[] = [];
    const occupiedPositions = [startPos, exitPos];
    
    // Place keys
    for (let i = 0; i < config.keyCount; i++) {
      let keyPos: Position;
      do {
        keyPos = generator.findRandomPathCell(maze);
      } while (occupiedPositions.some(pos => pos.x === keyPos.x && pos.y === keyPos.y));
      
      keys.push(keyPos);
      occupiedPositions.push(keyPos);
    }
    
    // Place traps
    for (let i = 0; i < config.trapCount; i++) {
      let trapPos: Position;
      do {
        trapPos = generator.findRandomPathCell(maze);
      } while (occupiedPositions.some(pos => pos.x === trapPos.x && pos.y === trapPos.y));
      
      traps.push(trapPos);
      occupiedPositions.push(trapPos);
    }

    return {
      maze,
      playerPos: startPos,
      startPos,
      exitPos,
      keys,
      traps,
      collectedKeys: 0,
      totalKeys: config.keyCount,
      timeLeft: config.timeLimit,
      score: 0,
      gameStatus: 'playing' as const,
      gameStartTime: Date.now(),
    };
  }, []);

  const startGame = useCallback(() => {
    const newGameState = generateNewMaze(1);
    setGameState({ ...newGameState, level: 1, totalScore: 0 });
  }, [generateNewMaze]);

  const restartGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const newGameState = generateNewMaze(gameState.level);
    setGameState(prev => ({ ...newGameState, level: prev.level, totalScore: prev.totalScore }));
  }, [startGame]);

  const nextLevel = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState(prev => {
      const newLevel = prev.level + 1;
      const newGameState = generateNewMaze(newLevel);
      return {
        ...newGameState,
        level: newLevel,
        totalScore: prev.totalScore + prev.score
      };
    });
  }, [generateNewMaze]);

  const backToMenu = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState(prev => ({ ...prev, gameStatus: 'menu' }));
  }, []);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;

      const { playerPos, maze } = prev;
      let newX = playerPos.x;
      let newY = playerPos.y;

      switch (direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
      }

      // Check bounds and walls
      if (newX < 0 || newX >= maze[0].length || newY < 0 || newY >= maze.length) {
        return prev;
      }
      if (maze[newY][newX] === 'wall') {
        return prev;
      }

      const newPos = { x: newX, y: newY };

      // Check for trap collision
      const hitTrap = prev.traps.some(trap => trap.x === newX && trap.y === newY);
      if (hitTrap) {
        return {
          ...prev,
          playerPos: prev.startPos,
          score: Math.max(0, prev.score - 100)
        };
      }

      // Check for key collection
      const keyIndex = prev.keys.findIndex(key => key.x === newX && key.y === newY);
      let newKeys = prev.keys;
      let newCollectedKeys = prev.collectedKeys;
      let newScore = prev.score;

      if (keyIndex !== -1) {
        newKeys = prev.keys.filter((_, index) => index !== keyIndex);
        newCollectedKeys = prev.collectedKeys + 1;
        newScore = prev.score + 200;
      }

      // Check for exit (only if all keys collected)
      if (newX === prev.exitPos.x && newY === prev.exitPos.y && newCollectedKeys === prev.totalKeys) {
        const config = getConfigForLevel(prev.level);
        const timeTaken = config.timeLimit - prev.timeLeft;
        const timeBonus = Math.max(0, prev.timeLeft * 10);
        const levelBonus = prev.level * 500;
        const finalScore = newScore + timeBonus + 1000 + levelBonus;
        
        return {
          ...prev,
          playerPos: newPos,
          keys: newKeys,
          collectedKeys: newCollectedKeys,
          score: finalScore,
          gameStatus: 'won'
        };
      }

      return {
        ...prev,
        playerPos: newPos,
        keys: newKeys,
        collectedKeys: newCollectedKeys,
        score: newScore
      };
    });
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            return { ...prev, timeLeft: 0, gameStatus: 'lost' };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.gameStatus]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;

      switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          event.preventDefault();
          movePlayer('up');
          break;
        case 'arrowdown':
        case 's':
          event.preventDefault();
          movePlayer('down');
          break;
        case 'arrowleft':
        case 'a':
          event.preventDefault();
          movePlayer('left');
          break;
        case 'arrowright':
        case 'd':
          event.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameStatus, movePlayer]);

  return {
    gameState,
    startGame,
    restartGame,
    backToMenu,
    movePlayer,
    nextLevel
  };
};

export default useGameLogic;