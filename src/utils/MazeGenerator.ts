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
    const attempts = Math.floor((this.width * this.height) / 12);
    
    for (let i = 0; i < attempts; i++) {
      const x = 1 + Math.floor(Math.random() * (this.width - 2));
      const y = 1 + Math.floor(Math.random() * (this.height - 2));
      
      // Only carve if it's a wall and would create a useful connection
      if (this.maze[y][x] === 'wall' && this.wouldCreateUsefulConnection(x, y)) {
        this.maze[y][x] = 'path';
      }
    }
    
    // Add more loops and alternative routes
    this.createAlternativeRoutes();
  }

  private createAlternativeRoutes() {
    const attempts = Math.floor((this.width * this.height) / 15);
    
    for (let i = 0; i < attempts; i++) {
      const x = 2 + Math.floor(Math.random() * (this.width - 4));
      const y = 2 + Math.floor(Math.random() * (this.height - 4));
      
      if (this.maze[y][x] === 'wall' && this.wouldCreateAlternativeRoute(x, y)) {
        this.maze[y][x] = 'path';
      }
    }
  }

  private wouldCreateAlternativeRoute(x: number, y: number): boolean {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let pathNeighbors = 0;
    const pathPositions: Position[] = [];
    
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      
      if (this.isValidCoordinate(nx, ny) && this.maze[ny][nx] === 'path') {
        pathNeighbors++;
        pathPositions.push({ x: nx, y: ny });
      }
    }
    
    // Create route if it connects 2 or more path segments that aren't already connected
    if (pathNeighbors >= 2) {
      // Check if these path segments are already connected
      return !this.arePositionsConnected(pathPositions[0], pathPositions[1]);
    }
    
    return false;
  }

  private arePositionsConnected(pos1: Position, pos2: Position): boolean {
    const visited = new Set<string>();
    const queue = [pos1];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const key = `${current.x},${current.y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      if (current.x === pos2.x && current.y === pos2.y) {
        return true;
      }
      
      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dx, dy] of directions) {
        const nx = current.x + dx;
        const ny = current.y + dy;
        
        if (this.isValidCoordinate(nx, ny) && 
            this.maze[ny][nx] === 'path' && 
            !visited.has(`${nx},${ny}`)) {
          queue.push({ x: nx, y: ny });
        }
      }
    }
    
    return false;
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
    
    // Find all path cells that aren't occupied and have multiple connections
    const pathCells: Position[] = [];
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        if (maze[y][x] === 'path' && 
            !occupiedPositions.some(pos => pos.x === x && pos.y === y) &&
            this.hasMultipleConnections(maze, { x, y })) {
          pathCells.push({ x, y });
        }
      }
    }
    
    // For each potential trap position, check if all keys and exit remain reachable
    for (const trapPos of pathCells) {
      if (this.areAllTargetsReachableWithTrap(maze, startPos, [...keys, exitPos], trapPos)) {
        validTrapPositions.push(trapPos);
      }
    }
    
    return validTrapPositions;
  }

  private hasMultipleConnections(maze: CellType[][], pos: Position): boolean {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let pathConnections = 0;
    
    for (const [dx, dy] of directions) {
      const nx = pos.x + dx;
      const ny = pos.y + dy;
      
      if (this.isValidCoordinate(nx, ny) && maze[ny][nx] === 'path') {
        pathConnections++;
      }
    }
    
    // Only allow traps at intersections (3+ connections) or corridor bends (2 connections)
    return pathConnections >= 2;
  }
  private areAllTargetsReachableWithTrap(maze: CellType[][], startPos: Position, targets: Position[], trapPos: Position): boolean {
    // Create a temporary maze with the trap as a wall
    const tempMaze = maze.map(row => [...row]);
    tempMaze[trapPos.y][trapPos.x] = 'wall';
    
    // Check if all targets (keys + exit) are still reachable from start
    for (const target of targets) {
      if (!this.isReachable(tempMaze, startPos, target)) {
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
  private carvePassages(x: number, y: number) {
  }