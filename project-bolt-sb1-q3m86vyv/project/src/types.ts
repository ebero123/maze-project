export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  maze: CellType[][];
  playerPos: Position;
  startPos: Position;
  exitPos: Position;
  keys: Position[];
  traps: Position[];
  collectedKeys: number;
  totalKeys: number;
  timeLeft: number;
  score: number;
  gameStatus: 'menu' | 'playing' | 'won' | 'lost';
  gameStartTime: number;
  level: number;
  totalScore: number;
}

export type CellType = 'wall' | 'path' | 'player' | 'key' | 'trap' | 'exit';

export interface MazeConfig {
  width: number;
  height: number;
  keyCount: number;
  trapCount: number;
  timeLimit: number;
}