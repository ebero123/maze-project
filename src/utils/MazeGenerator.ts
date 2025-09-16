@@ .. @@
  generate(): CellType[][] {
    // Initialize maze with walls
    this.maze = Array(this.height).fill(null).map(() => 
      Array(this.width).fill('wall' as CellType)
    );

    // Create paths using recursive backtracking
    this.carvePassages(1, 1);
    
    // Ensure borders are walls
    this.ensureBorders();

+    // Create entry and exit openings
+    this.createEntryAndExit();

    return this.maze;
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

  private carvePassages(x: number, y
  }: number) {