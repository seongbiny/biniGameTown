import { Application } from 'pixi.js';
import { GameState, GameStatus } from '../types';
import MainScene from '../components/scene/MainScene';
import SelectLevelScene from '../components/scene/SelectLevelScene';
import SelectArtistScene from '../components/scene/SelectArtistScene';
import SelectMemberScene from '../components/scene/SelectMemberScene';
import ReadyScene from '../components/scene/ReadyScene';
import PlayingScene from '../components/scene/PlayingScene';
import GameOverScene from '../components/scene/GameOverScene';
import { COLORS } from '../../config/constants';

// 현재 게임 상태를 저장하는 변수
let currentGameState: GameState = { status: GameStatus.MAIN };
let currentScene: any = null;

/**
 * 씬을 전환하는 함수
 * @param app PIXI 애플리케이션 인스턴스
 * @param newState 새로운 게임 상태
 * @returns 업데이트된 게임 상태
 */
export const switchScene = (
  app: Application,
  newState: GameState
): GameState => {
  // 현재 게임 상태 업데이트
  currentGameState = { ...currentGameState, ...newState };

  if (currentScene && currentScene.cleanup) {
    currentScene.cleanup();
  }

  // 기존 씬 제거
  app.stage.removeChildren();

  // 배경색 설정
  if (newState.status === GameStatus.READY) {
    app.renderer.background.color = COLORS.WHITE;
  } else {
    app.renderer.background.color = COLORS.PRIMARY;
  }

  // 새로운 씬 생성 및 렌더링
  switch (newState.status) {
    case GameStatus.MAIN:
      currentScene = new MainScene(app, (state) => switchScene(app, state));
      break;
    case GameStatus.SELECT_LEVEL:
      currentScene = new SelectLevelScene(app, (state) =>
        switchScene(app, state)
      );
      break;
    case GameStatus.SELECT_ARTIST:
      currentScene = new SelectArtistScene(
        app,
        (state) => switchScene(app, state),
        currentGameState
      );
      break;
    case GameStatus.SELECT_MEMBER:
      currentScene = new SelectMemberScene(
        app,
        (state) => switchScene(app, state),
        currentGameState
      );
      break;
    case GameStatus.READY:
      currentScene = new ReadyScene(
        app,
        (state) => switchScene(app, state),
        currentGameState
      );
      break;
    case GameStatus.PLAYING:
      currentScene = new PlayingScene(
        app,
        (state) => switchScene(app, state),
        currentGameState
      );
      break;
    case GameStatus.GAME_OVER:
      currentScene = new GameOverScene(
        app,
        (state) => switchScene(app, state),
        currentGameState
      );
      break;
  }

  return currentGameState;
};

/**
 * 현재 게임 상태를 반환하는 함수
 * @returns 현재 게임 상태
 */
export const getCurrentGameState = (): GameState => {
  return currentGameState;
};

/**
 * 초기 씬을 설정하는 함수
 * @param app PIXI 애플리케이션 인스턴스
 * @param initialState 초기 게임 상태 (기본값: MAIN)
 */
export const initializeScene = (
  app: Application,
  initialState: GameState = { status: GameStatus.MAIN }
): void => {
  switchScene(app, initialState);
};
