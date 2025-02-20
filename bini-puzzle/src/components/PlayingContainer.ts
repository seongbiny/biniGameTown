import { Application, Container, Graphics, Text } from "pixi.js";
import { GameState } from "../main";

function getInversionCount(arr: number[]): any {
  let invCount = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      // 0은 제외하고 계산
      if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
        invCount++;
      }
    }
  }
  return invCount;
}

function generateValidTiles(gridSize: number): any {
  while (true) {
    // 1부터 gridSize * girdSize - 1 까지의 숫자 생성
    let numbers = Array.from(
      { length: gridSize * gridSize - 1 },
      (_, i) => i + 1
    );

    // 숫자 배열을 랜덤으로 섞기
    numbers = numbers.sort(() => Math.random() - 0.5);

    numbers.push(0);

    const invCount = getInversionCount(numbers);

    // 역전 카운트가 짝수인 경우에만 사용
    if (invCount % 2 === 0) {
      // 2차원 배열로 변환
      const tiles: number[][] = [];
      for (let i = 0; i < gridSize; i++) {
        tiles[i] = numbers.slice(i * gridSize, (i + 1) * gridSize);
      }
      console.log("Generated valid puzzle with inversion count:", invCount);
      return tiles;
    }
    console.log("Rejected puzzle with inversion count:", invCount);
  }
}

export default async function playingContainer(
  app: Application,
  switchState: (state: GameState) => void
) {
  const gridContainer = new Container();
  let moves = 0;
  let seconds = 0;

  const statusText = new Text("moves: 0 time: 0s", {
    fontSize: 24,
    fill: 0xffffff,
    fontWeight: "bold",
  });

  const title = new Text("bini-puzzle", {
    fontSize: 24,
    fill: 0xffffff,
    fontWeight: "bold",
  });

  const gridSize = 3;
  const cellSize = 100;
  const gridBorderWidth = 3;
  const cellBorderWidth = 1;
  const totalSize = gridSize * cellSize;

  statusText.anchor.set(0.5, 0);
  statusText.x = app.screen.width / 2;
  statusText.y = 40;

  title.anchor.set(0.5, 0);
  title.x = app.screen.width / 2;
  title.y = app.screen.height - 60;

  const timer = setInterval(() => {
    seconds++;
    updateStatusText();
  }, 1000);

  function updateStatusText() {
    statusText.text = `moves: ${moves} time: ${seconds}s`;
  }

  // 그리드를 화면 중앙에 배치
  gridContainer.x = (app.screen.width - totalSize) / 2;
  gridContainer.y = (app.screen.height - totalSize) / 2;

  const gridBorder = new Graphics()
    .setStrokeStyle({ width: gridBorderWidth, color: 0x000000 })
    .rect(0, 0, totalSize, totalSize)
    .stroke();

  gridContainer.addChild(gridBorder);

  let numbers = Array.from(
    { length: gridSize * gridSize - 1 },
    (_, i) => i + 1
  );
  numbers = numbers.sort(() => Math.random() - 0.5);
  numbers.push(0);

  const tiles = generateValidTiles(gridSize);
  // for (let i = 0; i < gridSize; i++) {
  //   tiles.push(numbers.slice(i * gridSize, (i + 1) * gridSize));
  // }
  let textTiles: Text[][] = []; // 화면에 표시되는 텍스트 객체 배열
  let selectedCell: { row: number; col: number } | null = null;

  for (let row = 0; row < gridSize; row++) {
    textTiles[row] = [];
    for (let col = 0; col < gridSize; col++) {
      const cellContainer = new Container();

      const block = new Graphics()
        .setFillStyle({ color: 0xffffff }) // 흰색 배경
        .setStrokeStyle({ width: cellBorderWidth, color: 0x000000 }) // 검은색 테두리
        .rect(0, 0, cellSize, cellSize)
        .fill()
        .stroke();

      block.eventMode = "static";
      block.cursor = "pointer";

      // const value = numbers[row * gridSize + col];
      const value = tiles[row][col];

      const text = new Text(value === 0 ? "" : value.toString(), {
        fontSize: 32,
        fill: 0x000000,
        fontWeight: "bold",
      });

      text.anchor.set(0.5);
      text.x = cellSize / 2;
      text.y = cellSize / 2;

      block.on("pointerdown", () => handleClick(row, col));

      cellContainer.addChild(block);
      cellContainer.addChild(text);

      cellContainer.x = col * cellSize;
      cellContainer.y = row * cellSize;

      gridContainer.addChild(cellContainer);
      textTiles[row][col] = text;
    }
  }

  app.stage.addChild(gridContainer);

  function handleClick(row: number, col: number) {
    const clickedValue = tiles[row][col];

    console.log(`Clicked: (${row}, ${col}) - ${clickedValue}`);

    if (selectedCell) {
      const { row: prevRow, col: prevCol } = selectedCell;
      const prevValue = tiles[prevRow][prevCol];

      console.log(`Selected: (${prevRow}, ${prevCol}) - ${prevValue}`);

      const rowDiff = Math.abs(row - prevRow);
      const colDiff = Math.abs(col - prevCol);
      const isAdjacent = rowDiff + colDiff === 1;

      // 1. 숫자 <-> 0 클릭 (인접하면 위치 교환)
      if (
        (prevValue !== 0 && clickedValue === 0 && isAdjacent) ||
        (prevValue === 0 && clickedValue !== 0 && isAdjacent)
      ) {
        console.log("Swapping positions!");

        [tiles[prevRow][prevCol], tiles[row][col]] = [
          tiles[row][col],
          tiles[prevRow][prevCol],
        ];

        updateGrid();
      }
      // 2. 숫자 <-> 숫자 클릭 (색상 변경, 위치 변경 X)
      else if (prevValue !== 0 && clickedValue !== 0) {
        textTiles[prevRow][prevCol].style.fill = 0x000000;
        textTiles[row][col].style.fill = 0xff0000;
        selectedCell = { row, col };
        return;
      }
      // 3. 숫자 <-> 0 클릭 (인접하지 않으면 색상 초기화)
      else if (prevValue !== 0 && clickedValue === 0 && !isAdjacent) {
        textTiles[prevRow][prevCol].style.fill = 0x000000;
        selectedCell = null;
      }

      // selectedCell = { row, col };
      selectedCell = null; // 클릭 후 선택 초기화
    } else if (clickedValue !== 0) {
      // 숫자 선택 (빨간색 표시)
      textTiles[row][col].style.fill = 0xff0000;
      selectedCell = { row, col };
    }
  }

  function updateGrid() {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const value = tiles[row][col];
        textTiles[row][col].text = value === 0 ? "" : value.toString();
        textTiles[row][col].style.fill = 0x000000;
      }
    }

    moves++;
    updateStatusText();

    // 정답 확인
    checkSolution();
  }

  function checkSolution() {
    const solution = Array.from({ length: gridSize * gridSize }, (_, i) =>
      i < gridSize * gridSize - 1 ? i + 1 : 0
    );

    const currentState = tiles.flat();

    const isCorrect = currentState.every(
      (value, index) => value === solution[index]
    );

    if (isCorrect) {
      clearInterval(timer);

      gridBorder.clear();
      gridBorder
        .setStrokeStyle({ width: gridBorderWidth, color: 0x00ff00 }) // 초록색
        .rect(0, 0, totalSize, totalSize)
        .stroke();

      console.log("Puzzle solved!");
      console.log(`Final time: ${seconds}s`);
      console.log(`Total moves: ${moves}`);
      console.log("Solution:", solution);
      console.log("Current state:", currentState);
    }
  }

  const cleanup = () => {
    clearInterval(timer);
  };

  app.stage.addChild(statusText);
  app.stage.addChild(title);

  return {
    container: gridContainer,
    cleanup,
  };
}
