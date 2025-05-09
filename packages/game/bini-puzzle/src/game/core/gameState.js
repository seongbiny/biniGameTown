import { generateSolutionArray, generateValidTiles } from './PuzzleGenerator';
import { isPuzzleComplete } from './puzzleLogic';
// 초기 상태 생성
export function createInitialState(gridSize) {
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
export function incrementMoves(state) {
    return { ...state, moves: state.moves + 1 };
}
export function incrementTime(state) {
    return { ...state, time: state.time + 1 };
}
export function setAnimating(state, isAnimating) {
    return { ...state, isAnimating };
}
// 퍼즐 상태 업데이트
export function updatePuzzleState(state, newPuzzle) {
    const isComplete = isPuzzleComplete(newPuzzle, state.solution);
    return { ...state, puzzle: newPuzzle, isComplete };
}
