@@ .. @@
  generate(): CellType[][] {
    // Initialize maze with walls
    this.maze = Array(this.height).fill(null).map(() => 
      Array(this.width).fill('wall' as CellType)
    );

    // Create paths using recursive backtracking
    this.carvePassages(1, 1);
    
    // Add more branching paths
    this.addBranchingPaths();
    
    // Ensure borders are walls
    this.ensureBorders();

+    // Create entry and exit openings
+    this.createEntryAndExit();

    return this.maze;
  }

  private addBranchingPaths() {
    // Add additional connections to create more branching
    const attempts = Math.floor((this.width * this.height) / 20);
    
    for (let i = 0; i < attempts; i++) {
      const x = 1 + Math.floor(Math.random() * (this.width - 2));
      const y = 1 + Math.floor(Math.random() * (this.height - 2));
      
      // Only carve if it's a wall and would create a useful connection
      if (this.maze[y][x] === 'wall' && this.wouldCreateUsefulConnection(x, y)) {
        this.maze[y][x] = 'path';
      }
    }
  }

  private wouldCreateUsefulConnection(x: number, y: number): boolean {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let pathNeighbors = 0;
    
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      
      if (this.isValidCoordinate(nx, ny) && this.maze[ny][nx] === 'path') {
        pathNeighbors++;
      }
    }
    
    // Create connection if it would connect exactly 2 path segments
    return pathNeighbors === 2;
  }

  private isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
+  private createEntryAndExit() {
+    // Create entry at top-left area
+    this.maze[0][1] = 'path'; // Opening in top wall
+    this.maze[1][0] = 'path'; // Opening in left wall
+    
+    // Create exit at bottom-right area
+    this.maze[this.height - 1][this.width - 2] = 'path'; // Opening in bottom wall
+    this.maze[this.height - 2][this.width - 1] = 'path'; // Opening in right wall
+  }

  findValidTrapPositions(maze: CellType[][], keys: Position[], startPos: Position, exitPos: Position): Position[] {
    const validTrapPositions: Position[] = [];
    const occupiedPositions = [startPos, exitPos, ...keys];
    
    // Find all path cells that aren't occupied
    const pathCells: Position[] = [];
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        if (maze[y][x] === 'path' && 
            !occupiedPositions.some(pos => pos.x === x && pos.y === y)) {
          pathCells.push({ x, y });
        }
      }
    }
    
    // For each potential trap position, check if all keys remain reachable
    for (const trapPos of pathCells) {
      if (this.areAllKeysReachableWithTrap(maze, startPos, keys, trapPos)) {
        validTrapPositions.push(trapPos);
      }
    }
    
    return validTrapPositions;
  }

  private areAllKeysReachableWithTrap(maze: CellType[][], startPos: Position, keys: Position[], trapPos: Position): boolean {
    // Create a temporary maze with the trap as a wall
    const tempMaze = maze.map(row => [...row]);
    tempMaze[trapPos.y][trapPos.x] = 'wall';
    
    // Check if all keys are still reachable from start
    for (const key of keys) {
      if (!this.isReachable(tempMaze, startPos, key)) {
        return false;
      }
    }
    
    return true;
  }

  private isReachable(maze: CellType[][], start: Position, target: Position): boolean {
    const visited = new Set<string>();
    const queue = [start];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const key = `${current.x},${current.y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      if (current.x === target.x && current.y === target.y) {
        return true;
      }
      
      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dx, dy] of directions) {
        const nx = current.x + dx;
        const ny = current.y + dy;
        
        if (this.isValidCoordinate(nx, ny) && 
            maze[ny][nx] === 'path' && 
            !visited.has(`${nx},${ny}`)) {
          queue.push({ x: nx, y: ny });
        }
      }
    }
    
    return false;
  }
  private carvePassages(x: number, y
  }: number) {