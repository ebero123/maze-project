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
    const baseStyle = "w-5 h-5 flex items-center justify-center text-xs font-bold transition-all duration-200";
    
+    // Special styling for entry point
+    if (x === 1 && y === 1) {
+      return `${baseStyle} bg-green-200 border-2 border-green-500`;
+    }
+    
+    // Special styling for maze openings (entry/exit in walls)
+    if ((x === 1 && y === 0) || (x === 0 && y === 1) || 
+        (x === maze[0].length - 2 && y === maze.length - 1) || 
+        (x === maze[0].length - 1 && y === maze.length - 2)) {
+      return `${baseStyle} bg-blue-100 border border-blue-300`;
+    }
+    
    switch (cellType) {
      case 'wall':
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
          return `${baseStyle} bg-red-100 border border-red-300`;
        }
        // Special styling for keys
        const keyAtPosition = keys.find(key => key.x === x && key.y === y);
        if (keyAtPosition) {
          return `${baseStyle} bg-yellow-100 border border-yellow-300`;
        }
        // Player position highlight
        if (playerPos.x === x && playerPos.y === y) {
          return `${baseStyle} bg-blue-100 border-2 border-blue-400 shadow-lg`;
        }
        return `${baseStyle} bg-gray-50 border border-gray-200`;
      default:
        return `${baseStyle} bg-gray-50 border border-gray-200`;
    }
  };