import { Engine, Runner, Composite, Events, Body } from 'matter-js';
import { Player } from '../component/view/Player';
import { Ground } from '../component/view/Ground';
import { DEFAULT_CONFIG } from '../../config';
import { ObstacleManager } from '../component/view/ObstacleManager';
import { EventEmitter } from 'pixi.js';
import SceneController from './SceneController';
import { SceneType } from '../types';
import { ScoreManager } from '../component/view/ScoreManager';
import { SoundPlayer } from './SoundPlayer';

const { GAME_WIDTH } = DEFAULT_CONFIG;
export class GameController extends EventEmitter {
  private static instance: GameController;

  private engine: Engine;
  private runner: Runner;
  private isPhysicsStarted: boolean = false;
  private isGameOver: boolean = false;

  private player: Player | null = null;
  private ground: Ground | null = null;
  private obstacleManager: ObstacleManager | null = null;

  private scoreManager: ScoreManager;

  private soundPlayer: SoundPlayer;

  private constructor() {
    super();
    this.engine = Engine.create({
      gravity: { x: 0, y: 0.5 }, // 중력 설정
    });
    this.runner = Runner.create();

    this.scoreManager = ScoreManager.getInstance();
    this.soundPlayer = SoundPlayer.getInstance();

    this.setupCollisionEvents();
  }

  public static getInstance(): GameController {
    if (!GameController.instance) {
      GameController.instance = new GameController();
    }
    return GameController.instance;
  }

  // 플레이어 설정
  public setPlayer(player: Player): void {
    this.player = player;
  }

  // 땅 설정
  public setGround(ground: Ground): void {
    this.ground = ground;
  }

  // 장애물 매니저 설정
  public setObstacleManager(obstacleManager: ObstacleManager): void {
    this.obstacleManager = obstacleManager;
  }

  private setupCollisionEvents(): void {
    Events.on(this.engine, 'collisionStart', (event) => {
      if (this.isGameOver) return;

      const pairs = event.pairs;

      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];

        if (this.isPlayerGroundCollision(pair.bodyA, pair.bodyB)) {
          console.log('충돌: 플레이어와 지면');
          this.handleGameOver();
        }

        if (this.isPlayerObstacleCollision(pair.bodyA, pair.bodyB)) {
          console.log('충돌: 플레이어와 장애물');
          this.handleGameOver();
        }
      }
    });
  }

  private handleGameOver(): void {
    if (this.isGameOver) return;

    this.isGameOver = true;

    if (this.player) {
      this.player.die();
    }

    this.soundPlayer.play('gameover');

    const currentScore = this.scoreManager.getScore();
    this.emit('gameOver', currentScore);

    // 점수가 초기화되지 않고 유지된 상태로 GameOverScene 전환
    setTimeout(() => {
      this.stopPhysics();
      SceneController.getInstance().switchScene(SceneType.GAMEOVER);
    }, 2000);
  }

  public resetGame(): void {
    this.isGameOver = false;

    if (this.ground) {
      console.log('ground reset');
    }

    // 게임을 재시작할 때만 점수 초기화
    this.scoreManager.resetScore();

    this.resetPhysics();

    if (this.obstacleManager) {
      this.obstacleManager.reset();
    }
  }

  private resetPhysics(): void {
    if (this.isPhysicsStarted) {
      Runner.stop(this.runner);
      this.isPhysicsStarted = false;
    }

    // 물리 세계 초기화 - 기존 바디 모두 제거
    // Composite.sclear(this.engine.world);

    // 엔진 다시 생성
    this.engine = Engine.create({
      gravity: { x: 0, y: 0.5 },
    });

    // 러너 다시 생성
    this.runner = Runner.create();

    // 충돌 이벤트 다시 설정
    this.setupCollisionEvents();
  }

  // 플레이어와 지면 충돌 확인
  private isPlayerGroundCollision(bodyA: Body, bodyB: Body): boolean {
    return (
      (bodyA.label === 'player' && bodyB.label === 'ground') ||
      (bodyB.label === 'player' && bodyA.label === 'ground')
    );
  }

  // 플레이어와 장애물 충돌 확인
  private isPlayerObstacleCollision(bodyA: Body, bodyB: Body): boolean {
    return (
      (bodyA.label === 'player' &&
        (bodyB.label === 'obstacle-top' ||
          bodyB.label === 'obstacle-bottom')) ||
      (bodyB.label === 'player' &&
        (bodyA.label === 'obstacle-top' || bodyA.label === 'obstacle-bottom'))
    );
  }

  // 장애물 통과 확인
  public checkObstaclePassed(): void {
    if (!this.obstacleManager || this.isGameOver) return;

    const obstacles = this.obstacleManager.getObstacles();
    const playerX = GAME_WIDTH * 0.3; // 플레이어의 고정된 x 위치

    for (const obstacle of obstacles) {
      if (obstacle.isActive() && !obstacle.isPassed()) {
        // 통과 감지 지점을 장애물 좌측 가장자리로 설정 (파이프 중간이 아님)
        const passPoint =
          obstacle.getCenterX() - (obstacle.getWidth() / 2) * 0.5;

        if (playerX > passPoint) {
          this.soundPlayer.play('pass');
          obstacle.setPassed(true);
          this.scoreManager.incrementScore();
        }
      }
    }
  }

  public update(): void {
    this.checkObstaclePassed();
  }

  // 물리 시뮬레이션 시작
  public startPhysics(): void {
    if (!this.isPhysicsStarted) {
      Runner.run(this.runner, this.engine);
      this.isPhysicsStarted = true;
    }
  }

  // 물리 시뮬레이션 중지
  public stopPhysics(): void {
    if (this.isPhysicsStarted) {
      Runner.stop(this.runner);
      this.isPhysicsStarted = false;
    }
  }

  // 물리 바디 추가
  public addBody(body: Matter.Body): void {
    Composite.add(this.engine.world, body);
  }

  // 물리 바디 제거
  public removeBody(body: Matter.Body): void {
    Composite.remove(this.engine.world, body);
  }

  // 물리 엔진 인스턴스 반환
  public getEngine(): Engine {
    return this.engine;
  }
}
