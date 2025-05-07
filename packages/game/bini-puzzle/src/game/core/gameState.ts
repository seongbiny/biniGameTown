import { generateSolutionArray, generateValidTiles } from './PuzzleGenerator';
import { isPuzzleComplete } from './puzzleLogic';

export interface GameState {
  puzzle: number[][]; // 현재 퍼즐 상태
  solution: number[]; // 정답 배열
  moves: number; // 이동 횟수
  time: number; // 경과 시간
  isComplete: boolean; // 완성 여부
  isAnimating: boolean; // 애니메이션 진행 중 여부
}

// 초기 상태 생성
export function createInitialState(gridSize: number): GameState {
  return {
    puzzle: generateValidTiles(gridSize),
    solution: generateSolutionArray(gridSize),
    moves: 0,
    time: 0,
    isComplete: false,
    isAnimating: false,
  };
}

// 상태 업데이트 함수들
export function incrementMoves(state: GameState): GameState {
  return { ...state, moves: state.moves + 1 };
}

export function incrementTime(state: GameState): GameState {
  return { ...state, time: state.time + 1 };
}

export function setAnimating(
  state: GameState,
  isAnimating: boolean
): GameState {
  return { ...state, isAnimating };
}

// 퍼즐 상태 업데이트
export function updatePuzzleState(
  state: GameState,
  newPuzzle: number[][]
): GameState {
  const isComplete = isPuzzleComplete(newPuzzle, state.solution);
  return { ...state, puzzle: newPuzzle, isComplete };
}
