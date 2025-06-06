export const isAdjacent = (
  row1: number,
  col1: number,
  row2: number,
  col2: number
): boolean => {
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  return rowDiff + colDiff === 1;
};

export const findEmptyCell = (
  tiles: number[][],
  gridSize: number
): { row: number; col: number } => {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (tiles[row][col] === 0) {
        return { row, col };
      }
    }
  }
  return { row: gridSize - 1, col: gridSize - 1 };
};
