@@ .. @@
  const generateNewMaze = useCallback((level: number) => {
    const config = getConfigForLevel(level);
    const generator = new MazeGenerator(config.width, config.height);
    const maze = generator.generate();
    
-    const startPos = { x: 1, y: 1 };
-    const exitCells = generator.findPathCellsAwayFrom(maze, startPos, 10);
-    const exitPos = exitCells[Math.floor(Math.random() * exitCells.length)];
+    // Entry point is always at top-left corner
+    const startPos = { x: 1, y: 1 };
+    
+    // Exit point is always at bottom-right corner
+    const exitPos = { x: config.width - 2, y: config.height - 2 };
+    
+    // Ensure exit position is a path
+    maze[exitPos.y][exitPos.x] = 'path';
    
    const keys: Position[] = [];
    const traps: Position[] = [];
    const occupiedPositions = [startPos, exitPos];