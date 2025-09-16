@@ .. @@
export type CellType = 'wall' | 'path' | 'player' | 'key' | 'trap' | 'exit';

export interface MazeConfig {
  width: number;
  height: number;
  keyCount: number;
  trapCount: number;
  timeLimit: number;
}