@@ .. @@
    // Exit position (locked/unlocked based on keys)
    if (exitPos.x === x && exitPos.y === y) {
      return (
        <Target 
          className={`w-3 h-3 ${
            collectedKeys === totalKeys 
              ? 'text-green-600 animate-pulse' 
              : 'text-gray-400'
          }`} 
        />
      );
    }

    // Keys
    const keyAtPosition = keys.find(key => key.x === x && key.y === y);
    if (keyAtPosition) {
      return <Key className="w-2 h-2 text-yellow-500 animate-bounce" />;
    }

    // Traps
    const trapAtPosition = traps.find(trap => trap.x === x && trap.y === y);
    if (trapAtPosition) {
      return <Skull className="w-3 h-3 text-red-600" />;
    }

    return null;
  };

  const getCellStyle = (cellType: CellType, x: number, y: number) => {
    const baseStyle = "w-5 h-5 flex items-center justify-center text-xs font-bold transition-all duration-200 relative";
    
+    // Special styling for entry point
+    if (x === 1 && y === 1) {
+      return `${baseStyle} bg-green-200 border-2 border-green-500`;
+    }
+    
    switch (cellType) {
      case 'wall':
        // Special styling for maze openings (entry/exit in walls)
        if ((x === 1 && y === 0) || (x === 0 && y === 1) || 
            (x === maze[0].length - 2 && y === maze.length - 1) || 
            (x === maze[0].length - 1 && y === maze.length - 2)) {
          return `${baseStyle} bg-blue-200 border-2 border-blue-400`;
        }
        return `${baseStyle} bg-gray-800 border border-gray-700`;
      case 'path':
        // Special styling for exit
        if (exitPos.x === x && exitPos.y === y) {
          return `${baseStyle} ${
            collectedKeys === totalKeys 
              ? 'bg-green-100 border-2 border-green-400' 
              : 'bg-gray-100 border-2 border-gray-400'
          }`;
        }
        // Special styling for traps
        const trapAtPosition = traps.find(trap => trap.x === x && trap.y === y);
        if (trapAtPosition) {
          return `${baseStyle} bg-red-100 border-2 border-red-400 shadow-md`;
        }
        // Special styling for keys
        const keyAtPosition = keys.find(key => key.x === x && key.y === y);
        if (keyAtPosition) {
          return `${baseStyle} bg-yellow-100 border-2 border-yellow-400`;
        }
        // Player position highlight
        if (playerPos.x === x && playerPos.y === y) {
          return `${baseStyle} bg-blue-100 border-2 border-blue-400 shadow-lg`;
        }
        // Highlight path intersections and alternative routes
        if (isPathIntersection(x, y)) {
          return `${baseStyle} bg-green-50 border border-green-200`;
        }
        return `${baseStyle} bg-white border border-gray-200`;
      default:
        return `${baseStyle} bg-white border border-gray-200`;
    }
  };
  const isPathIntersection = (x: number, y: number) => {
    if (maze[y][x] !== 'path') return false;
    
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let pathConnections = 0;
    
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx >= 0 && nx < maze[0].length && ny >= 0 && ny < maze.length) {
        if (maze[ny][nx] === 'path') {
          pathConnections++;
        }
      }
    }
    
    // Highlight intersections (3+ connections) and important bends (2 connections near traps)
    if (pathConnections >= 3) return true;
    
    // Highlight paths near traps to show alternative routes
    if (pathConnections === 2) {
      return traps.some(trap => {
        const distance = Math.abs(trap.x - x) + Math.abs(trap.y - y);
        return distance <= 2;
      });
    }
    
    return false;
  };