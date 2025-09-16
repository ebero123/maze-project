const generateNewMaze = useCallback((level: number) => {
    const config = getConfigForLevel(level);
    const generator = new MazeGenerator(config.width, config.height);
    const maze = generator.generate();
    
    // Entry point is always at top-left corner
    const startPos = { x: 1, y: 1 };
    
    // Exit point is always at bottom-right corner
    const exitPos = { x: config.width - 2, y: config.height - 2 };
    
    // Ensure exit position is a path
    maze[exitPos.y][exitPos.x] = 'path';
    
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
    
    // Place traps only where alternative paths exist
    const validTrapPositions = generator.findValidTrapPositions(maze, keys, startPos, exitPos);
    const trapCount = Math.min(config.trapCount, validTrapPositions.length);
    
    for (let i = 0; i < trapCount; i++) {
      const randomIndex = Math.floor(Math.random() * validTrapPositions.length);
      const trapPos = validTrapPositions.splice(randomIndex, 1)[0];
      traps.push(trapPos);
    }