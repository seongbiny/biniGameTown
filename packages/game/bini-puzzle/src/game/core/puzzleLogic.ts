import { findEmptyCell, isAdjacent } from '../utils/GridUtils';

/**
 * 퍼즐이 완성되었는지 확인하는 함수
 * @param currentArr 현재 퍼즐 상태 (2차원 배열)
 * @param solutionArr 정답 배열 (1차원 배열)
 * @returns 퍼즐이 완성되었는지 여부
 */
export function isPuzzleComplete(
  currentArr: number[][],
  solutionArr: number[]
): boolean {
  const currentState = currentArr.flat();
  return currentState.every((value, index) => value === solutionArr[index]);
}

/**
 * 타일 클릭 처리 결과 타입
 */
export type TileClickResult = {
  canMove: boolean;
  emptyCell?: { row: number; col: number };
};

/**
 * 타일 클릭 처리 함수 - 핵심 게임 로직
 * @param row 클릭한 타일의 행
 * @param col 클릭한 타일의 열
 * @param currentArr 현재 퍼즐 상태
 * @param gridSize 그리드 크기
 * @returns 타일 클릭 처리 결과
 */
export function processTileClick(
  row: number,
  col: number,
  currentArr: number[][],
  gridSize: number
): TileClickResult {
  const clickedTile = currentArr[row][col];
  if (clickedTile === 0) {
    // 빈 칸 클릭 시 무시
    return { canMove: false };
  }

  const emptyCell = findEmptyCell(currentArr, gridSize); // 빈 칸 위치 찾기

  if (isAdjacent(row, col, emptyCell.row, emptyCell.col)) {
    // 인접한 타일이면 이동 가능
    return {
      canMove: true,
      emptyCell,
    };
  } else {
    // 인접하지 않은 타일이면 이동 불가
    return {
      canMove: false,
      emptyCell,
    };
  }
}

export function moveTilePure(
  puzzle: number[][],
  row: number,
  col: number,
  emptyRow: number,
  emptyCol: number
): number[][] {
  const newPuzzle = puzzle.map((row) => [...row]);
  // 원본 데이터가 변경되면, 함수의 동작을 추적하고 디버깅하는 것이 더 어려워질 수 있음

  // 타일 교환
  [newPuzzle[row][col], newPuzzle[emptyRow][emptyCol]] = [
    newPuzzle[emptyRow][emptyCol],
    newPuzzle[row][col],
  ];

  return newPuzzle;
}
