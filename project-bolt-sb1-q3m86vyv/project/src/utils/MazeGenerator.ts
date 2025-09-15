import { Position, CellType } from '../types';

export class MazeGenerator {
  private width: number;
  private height: number;
  private maze: CellType[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maze = [];
  }

  generate(): CellType[][] {
    // Initialize maze with walls
    this.maze = Array(this.height).fill(null).map(() => 
      Array(this.width).fill('wall' as CellType)
    );

    // Create paths using recursive backtracking
    this.carvePassages(1, 1);
    
    // Ensure borders are walls
    this.ensureBorders();

    return this.maze;
  }

  private carvePassages(x: number, y: number) {
    this.maze[y][x] = 'path';

    const directions = [
      [0, -2], [2, 0], [0, 2], [-2, 0]
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (this.isValid(nx, ny) && this.maze[ny][nx] === 'wall') {
        this.maze[y + dy / 2][x + dx / 2] = 'path';
        this.carvePassages(nx, ny);
      }
    }
  }

  private isValid(x: number, y: number): boolean {
    return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1;
  }

  private ensureBorders() {
    for (let i = 0; i < this.width; i++) {
      this.maze[0][i] = 'wall';
      this.maze[this.height - 1][i] = 'wall';
    }
    for (let i = 0; i < this.height; i++) {
      this.maze[i][0] = 'wall';
      this.maze[i][this.width - 1] = 'wall';
    }
  }

  findRandomPathCell(maze: CellType[][]): Position {
    const pathCells: Position[] = [];
    
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        if (maze[y][x] === 'path') {
          pathCells.push({ x, y });
        }
      }
    }

    return pathCells[Math.floor(Math.random() * pathCells.length)];
  }

  findPathCellsAwayFrom(maze: CellType[][], pos: Position, minDistance: number): Position[] {
    const pathCells: Position[] = [];
    
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        if (maze[y][x] === 'path') {
          const distance = Math.abs(x - pos.x) + Math.abs(y - pos.y);
          if (distance >= minDistance) {
            pathCells.push({ x, y });
          }
        }
      }
    }

    return pathCells;
  }
}