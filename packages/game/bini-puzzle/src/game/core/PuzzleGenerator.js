export const generateSolutionArray = (gridSize) => {
    const totalSize = gridSize * gridSize;
    const arr = new Array(totalSize);
    for (let i = 0; i < totalSize - 1; i++) {
        arr[i] = i + 1;
    }
    arr[totalSize - 1] = 0;
    return arr;
};
/**
 * 배열에서 역전 카운트를 계산하는 함수
 * 역전: 배열에서 i < j일 때 arr[i] > arr[j]인 경우의 수
 * @param arr 숫자 배열
 * @returns 역전 카운트
 */
export function getInversionCount(arr) {
    let invCount = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            // 0(빈 칸)은 역전 계산에서 제외
            if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
                invCount++;
            }
        }
    }
    return invCount;
}
/**
 * 퍼즐이 풀 수 있는지 확인하는 함수
 * - 역전 카운트가 짝수면 풀 수 있음
 */
export function isValidPuzzle(numbers) {
    return getInversionCount(numbers) % 2 === 0;
}
/**
 * 풀 수 없는 퍼즐을 풀 수 있는 퍼즐로 변환하는 함수
 * @param numbers 원본 숫자 배열
 * @param gridSize 그리드 크기
 * @returns 풀 수 있는 숫자 배열
 */
function makeValidPuzzle(numbers) {
    // 배열 복사본 생성 (원본 배열 변경 방지)
    const modifiedNumbers = [...numbers];
    // 첫 번째와 두 번째 숫자를 교환
    // 이는 항상 역전 카운트의 홀짝을 바꿔주므로 추가 검증 필요 없음
    [modifiedNumbers[0], modifiedNumbers[1]] = [
        modifiedNumbers[1],
        modifiedNumbers[0],
    ];
    return modifiedNumbers;
}
/**
 * 풀 수 있는 타일 배열을 생성하는 함수
 * @param gridSize 그리드 크기
 * @returns 2차원 타일 배열
 */
export function generateValidTiles(gridSize) {
    const solutionArr = generateSolutionArray(gridSize); // 정답 배열
    // 0을 제외한 숫자들을 랜덤하게 섞기
    const numbers = [...solutionArr.slice(0, -1)].sort(() => Math.random() - 0.5);
    numbers.push(0); // 빈 칸(0)은 항상 마지막에 추가
    // 퍼즐이 풀 수 있는지 검증
    const isValid = isValidPuzzle(numbers);
    // 퍼즐이 풀 수 없는 경우, 별도 함수를 호출하여 수정
    const validNumbers = isValid ? numbers : makeValidPuzzle(numbers);
    // 2D 배열로 변환
    const tiles = [];
    for (let i = 0; i < gridSize; i++) {
        tiles[i] = validNumbers.slice(i * gridSize, (i + 1) * gridSize);
    }
    return tiles;
}
// 생성, 유효 퍼즐 체크를 분리
