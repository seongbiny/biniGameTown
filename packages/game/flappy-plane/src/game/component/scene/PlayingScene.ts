import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { GameController } from '../../core/GameController';
import { Ground } from '../view/Ground';
import { ObstacleManager } from '../view/ObstacleManager';
import { Player } from '../view/Player';
import { Scene } from './Scene';
import { ScoreManager } from '../view/ScoreManager';

import { DEFAULT_CONFIG } from '../../../config';

import lottie from 'lottie-web';
import { getPassAnimationData } from '../../../assets/assetsPreload';

export class PlayingScene extends Scene {
  private player!: Player;
  private ground!: Ground;
  private obstacleManager!: ObstacleManager;
  private score: number = 0;

  private scoreContainer!: Container;
  private scoreBackground!: Graphics;
  private scoreLabel!: Text;
  private scoreValue!: Text;

  private hintContainer!: Container;
  private hintBackground!: Graphics;
  private hintText!: Text;
  private showDebugGraphics: boolean = false;

  private gameController: GameController;

  private scoreManager: ScoreManager;

  private animationContainer: HTMLDivElement | null = null;

  constructor(parent: Container) {
    super(parent);
    this.gameController = GameController.getInstance();
    this.scoreManager = ScoreManager.getInstance();
  }

  public initialize() {
    super.initialize();
    this.setupGameElements();
    this.setupScoreUI();
    this.setupScoreEvents();
    this.setupHintButton();

    setTimeout(() => {
      this.player.enableJumping();
    }, 500);

    this.gameController.startPhysics();

    this.on('postrender', this.update.bind(this));
  }

  private setupHintButton() {
    // HINT 버튼 컨테이너 생성
    this.hintContainer = new Container();
    this.addChild(this.hintContainer);

    // HINT 버튼 배경 생성
    this.hintBackground = new Graphics();
    this.hintBackground.fill({ color: 0xffd000 });
    this.hintBackground.stroke({ color: 0x2e343b, width: 3 });
    this.hintBackground.roundRect(0, 0, 100, 50, 8);
    this.hintBackground.fill();
    this.hintBackground.stroke();

    // 우측 상단에 위치 설정
    this.hintContainer.position.set(DEFAULT_CONFIG.GAME_WIDTH - 120, 40);
    this.hintContainer.addChild(this.hintBackground);

    // HINT 텍스트 스타일 설정
    const hintStyle = new TextStyle({
      fontFamily: 'Chicalo',
      fontSize: 30,
      fill: '#31383e',
      align: 'center',
    });

    // HINT 텍스트 생성 및 위치 설정
    this.hintText = new Text({ text: 'HINT', style: hintStyle });
    this.hintText.position.set(
      (this.hintBackground.width - this.hintText.width) / 2,
      (this.hintBackground.height - this.hintText.height) / 2
    );
    this.hintContainer.addChild(this.hintText);

    // 버튼 상호작용 설정
    this.hintContainer.eventMode = 'static';
    this.hintContainer.cursor = 'pointer';

    // 클릭 이벤트 설정
    this.hintContainer.on('pointerdown', (event) => {
      event.stopPropagation();
      if (this.player) this.player.isJumpBlocked = true;
      this.toggleDebugGraphics();
    });
    this.hintContainer.on('pointerup', () => {
      if (this.player) this.player.isJumpBlocked = false;
    });
    this.hintContainer.on('pointerupoutside', () => {
      if (this.player) this.player.isJumpBlocked = false;
    });
  }

  // 디버그 그래픽 토글 메서드 추가
  private toggleDebugGraphics() {
    this.showDebugGraphics = !this.showDebugGraphics;

    // ObstacleManager를 통해 모든 장애물의 디버그 그래픽 표시/숨김 설정
    if (this.obstacleManager) {
      this.obstacleManager.setDebugGraphicsVisibility(this.showDebugGraphics);
    }
  }

  private setupScoreEvents() {
    this.scoreManager.on('scoreChanged', (score: number) => {
      this.score = score;
      this.updateScoreDisplay();

      if (score % 5 === 0 && score > 0) {
        this.playLevelUpAnimation();
      }
    });

    if (this.obstacleManager) {
      this.obstacleManager.updateGapSize(this.score);
      this.obstacleManager.updateSpawnInterval(this.score);
    }
  }

  private playLevelUpAnimation(): void {
    const passAnimationData = getPassAnimationData();
    if (!passAnimationData) return;

    if (this.animationContainer) {
      document.body.removeChild(this.animationContainer);
      this.animationContainer = null;
    }

    // 애니메이션 컨테이너 생성
    this.animationContainer = document.createElement('div');

    // 게임 캔버스의 위치와 크기 정보 가져오기
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.error('캔버스 요소를 찾을 수 없습니다.');
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();

    // 게임 화면의 중앙 좌표 계산
    const centerX = canvasRect.left + canvasRect.width / 2;
    const centerY = canvasRect.top + canvasRect.height / 2;

    // 애니메이션 컨테이너 스타일 설정
    this.animationContainer.style.position = 'absolute';
    this.animationContainer.style.left = `${centerX}px`;
    this.animationContainer.style.top = `${centerY}px`;
    this.animationContainer.style.transform = 'translate(-50%, -50%)';
    this.animationContainer.style.zIndex = '1000';
    this.animationContainer.style.pointerEvents = 'none';
    document.body.appendChild(this.animationContainer);

    const animation = lottie.loadAnimation({
      container: this.animationContainer,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: passAnimationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });

    // 애니메이션 완료 후 컨테이너 제거
    animation.addEventListener('complete', () => {
      if (this.animationContainer) {
        document.body.removeChild(this.animationContainer);
        this.animationContainer = null;
      }
    });

    // 창 크기 조정 시 애니메이션 위치 업데이트
    const updatePosition = () => {
      if (this.animationContainer) {
        const canvasRect = canvas.getBoundingClientRect();
        const centerX = canvasRect.left + canvasRect.width / 2;
        const centerY = canvasRect.top + canvasRect.height / 2;
        this.animationContainer.style.left = `${centerX}px`;
        this.animationContainer.style.top = `${centerY}px`;
      }
    };

    window.addEventListener('resize', updatePosition);
    animation.addEventListener('complete', () => {
      window.removeEventListener('resize', updatePosition);
    });
  }

  private setupGameElements() {
    this.obstacleManager = new ObstacleManager();
    this.addChild(this.obstacleManager);

    this.player = new Player();
    this.addChild(this.player);

    this.ground = new Ground();
    this.addChild(this.ground);

    this.gameController.setPlayer(this.player);
    this.gameController.setGround(this.ground);
    this.gameController.setObstacleManager(this.obstacleManager);

    this.gameController.on('scoreChanged', (score: number) => {
      this.score = score;
      this.updateScoreDisplay();
    });

    this.gameController.on('gameOver', (score: number) => {
      console.log('게임 오버, 최종 점수:', score);
    });
  }

  private setupScoreUI() {
    // 점수 UI 컨테이너 생성
    this.scoreContainer = new Container();
    this.addChild(this.scoreContainer);

    // 점수 배경 사각형 생성
    this.scoreBackground = new Graphics();

    this.scoreBackground.fill({ color: 0xffd000 });
    this.scoreBackground.stroke({ color: 0x2e343b, width: 3 });
    this.scoreBackground.roundRect(0, 0, 180, 56, 8);
    this.scoreBackground.fill();
    this.scoreBackground.stroke();

    this.scoreContainer.position.set(20, 40);
    this.scoreContainer.addChild(this.scoreBackground);

    const labelStyle = new TextStyle({
      fontFamily: 'Chicalo',
      fontSize: 36,
      fill: '#31383e',
      align: 'left',
    });

    this.scoreLabel = new Text({ text: 'SCORE', style: labelStyle });
    this.scoreLabel.position.set(10, 10);
    this.scoreContainer.addChild(this.scoreLabel);

    const valueStyle = new TextStyle({
      fontFamily: 'Chicalo',
      fontSize: 36,
      fill: '#ffffff',
      stroke: { color: '#31383e', width: 3 },
      align: 'left',
    });

    this.scoreValue = new Text({ text: '0', style: valueStyle });

    this.scoreValue.position.set(this.scoreLabel.width + 18, 10);
    this.scoreContainer.addChild(this.scoreValue);

    this.updateScoreDisplay();
  }

  private updateScoreDisplay() {
    this.scoreValue.text = this.score.toString();
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);

    if (this.obstacleManager) {
      this.obstacleManager.update(deltaTime, this.score);
    }

    if (this.player) {
      this.player.update(deltaTime);
    }

    if (this.ground) {
      this.ground.update(deltaTime);
    }

    this.gameController.update();
  }

  public reset(): void {
    this.scoreManager.resetScore();

    this.removeChildren();

    this.addCommonBackground();
    this.setupGameElements();
    this.setupScoreUI();
    this.setupScoreEvents();
    this.setupHintButton();

    setTimeout(() => {
      this.player.enableJumping();
    }, 500);

    this.gameController.startPhysics();
  }

  public pause(): void {
    super.pause();
    console.log('PlayingScene pause, 현재 점수:', this.scoreManager.getScore());

    this.gameController.stopPhysics();
  }
}
