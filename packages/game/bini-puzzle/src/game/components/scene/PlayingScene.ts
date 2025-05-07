import { Application, Container, Graphics } from 'pixi.js';
import { GameState, GameStatus } from '../../types';

import { processTileClick, moveTilePure } from '../../core/puzzleLogic';
import { animateTileSwapUI, animateShake } from '../view/TileAnimations';
import {
  createInitialState,
  incrementMoves,
  incrementTime,
  setAnimating,
  updatePuzzleState,
} from '../../core/gameState';
import {
  createTiles,
  preloadTileAssets,
  updateTilesUI,
} from '../view/TileView';
import {
  createStatusDisplay,
  updateStatusDisplay,
} from '../view/StatusDisplay';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../../../config/constants';

export default class PlayingScene {
  private app: Application;
  private switchScene: (status: GameState) => void;
  private gameState: GameState;
  private sceneContainer: Container;
  private state: any;
  private tiles: any;
  private statusText: any;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    app: Application,
    switchScene: (status: GameState) => void,
    gameState: GameState
  ) {
    this.app = app;
    this.switchScene = switchScene;
    this.gameState = gameState;
    this.sceneContainer = new Container();
    this.init();
  }

  private async init() {
    const gridSize = this.gameState.gridSize || 3;

    await preloadTileAssets(gridSize);

    // 게임 상태 초기화
    this.state = createInitialState(gridSize);

    // 그리드 관련 변수
    const totalSize = 340;
    const padding = 10;
    const cellSize = (totalSize - 2 * padding) / gridSize;

    // 1. 그리드 배경 생성
    const gridBackground = new Graphics()
      .fill({ color: COLORS.BACKGROUND })
      .setStrokeStyle({ width: 5, color: COLORS.BLACK })
      .roundRect(0, 0, totalSize, totalSize, 16)
      .fill()
      .stroke();

    // 2. 타일 생성
    const { tilesContainer, tiles } = createTiles(
      this.state.puzzle,
      gridSize,
      cellSize,
      padding,
      (row, col) => this.handleTileClick(row, col)
    );
    this.tiles = tiles;

    // 3. 그리드 컨테이너 생성 및 배치
    const gridContainer = new Container();
    gridContainer.addChild(gridBackground, tilesContainer);
    gridContainer.position.set(
      GAME_WIDTH / 2 - totalSize / 2,
      GAME_HEIGHT / 2 - 50 - totalSize / 2
    );

    // 4. 상태 표시 생성
    this.statusText = createStatusDisplay(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 100,
      this.state
    );

    // 5. 씬 컨테이너에 추가
    this.sceneContainer.addChild(gridContainer, this.statusText);
    this.app.stage.addChild(this.sceneContainer);

    // 타이머 시작
    this.timer = setInterval(() => {
      this.state = incrementTime(this.state);
      updateStatusDisplay(this.statusText, this.state);
    }, 1000);
  }

  private handleTileClick(row: number, col: number): void {
    // 애니메이션 중이거나 퍼즐이 완성된 경우 무시
    if (this.state.isAnimating || this.state.isComplete) return;

    // 타일 이동 가능 여부 확인
    const result = processTileClick(
      row,
      col,
      this.state.puzzle,
      this.state.puzzle.length
    );

    if (result.canMove && result.emptyCell) {
      // 애니메이션 상태 설정
      this.state = setAnimating(this.state, true);

      // 인접한 타일이면 이동 애니메이션 실행
      const emptyCell = result.emptyCell;

      animateTileSwapUI(
        this.tiles[row][col].container,
        this.tiles[emptyCell.row][emptyCell.col].container,
        () => this.handleTileAnimationComplete(row, col, emptyCell),
        (isAnimating) => {
          this.state = setAnimating(this.state, isAnimating);
        }
      );
    } else if (result.emptyCell) {
      // 인접하지 않은 타일이면 떨림 애니메이션 실행
      animateShake(this.tiles[row][col].container, (isAnimating) => {
        this.state = setAnimating(this.state, isAnimating);
      });
    }
  }

  private handleTileAnimationComplete(
    row: number,
    col: number,
    emptyCell: { row: number; col: number }
  ): void {
    const newPuzzle = moveTilePure(
      this.state.puzzle,
      row,
      col,
      emptyCell.row,
      emptyCell.col
    );

    this.state = incrementMoves(this.state);
    this.state = updatePuzzleState(this.state, newPuzzle);

    updateTilesUI(
      this.state.puzzle,
      this.tiles,
      (340 - 20) / this.state.puzzle.length
    );
    updateStatusDisplay(this.statusText, this.state);

    if (this.state.isComplete) {
      this.handlePuzzleComplete();
    }
  }

  private handlePuzzleComplete(): void {
    if (this.timer) clearInterval(this.timer);

    updateStatusDisplay(this.statusText, this.state, true);

    setTimeout(() => {
      this.switchScene({
        status: GameStatus.GAME_OVER,
        gridSize: this.gameState.gridSize,
        selectedArtist: this.gameState.selectedArtist,
        selectedMember: this.gameState.selectedMember,
        moves: this.state.moves,
        time: this.state.time,
      });
    }, 2000);
  }

  public cleanup() {
    // 타이머 정리
    if (this.timer) clearInterval(this.timer);

    // 컨테이너 정리
    this.sceneContainer.removeChildren();
  }
}
