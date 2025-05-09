import { Engine, Runner, Composite, Events } from 'matter-js';
import { DEFAULT_CONFIG } from '../../config';
import { EventEmitter } from 'pixi.js';
import SceneController from './SceneController';
import { SceneType } from '../types';
import { ScoreManager } from '../component/view/ScoreManager';
import { SoundPlayer } from './SoundPlayer';
const { GAME_WIDTH } = DEFAULT_CONFIG;
export class GameController extends EventEmitter {
    constructor() {
        super();
        Object.defineProperty(this, "engine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "runner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isPhysicsStarted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isGameOver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "player", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "ground", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "obstacleManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "scoreManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "soundPlayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.engine = Engine.create({
            gravity: { x: 0, y: 0.5 }, // 중력 설정
        });
        this.runner = Runner.create();
        this.scoreManager = ScoreManager.getInstance();
        this.soundPlayer = SoundPlayer.getInstance();
        this.setupCollisionEvents();
    }
    static getInstance() {
        if (!GameController.instance) {
            GameController.instance = new GameController();
        }
        return GameController.instance;
    }
    // 플레이어 설정
    setPlayer(player) {
        this.player = player;
    }
    // 땅 설정
    setGround(ground) {
        this.ground = ground;
    }
    // 장애물 매니저 설정
    setObstacleManager(obstacleManager) {
        this.obstacleManager = obstacleManager;
    }
    setupCollisionEvents() {
        Events.on(this.engine, 'collisionStart', (event) => {
            if (this.isGameOver)
                return;
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
    handleGameOver() {
        if (this.isGameOver)
            return;
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
    resetGame() {
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
    resetPhysics() {
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
    isPlayerGroundCollision(bodyA, bodyB) {
        return ((bodyA.label === 'player' && bodyB.label === 'ground') ||
            (bodyB.label === 'player' && bodyA.label === 'ground'));
    }
    // 플레이어와 장애물 충돌 확인
    isPlayerObstacleCollision(bodyA, bodyB) {
        return ((bodyA.label === 'player' &&
            (bodyB.label === 'obstacle-top' ||
                bodyB.label === 'obstacle-bottom')) ||
            (bodyB.label === 'player' &&
                (bodyA.label === 'obstacle-top' || bodyA.label === 'obstacle-bottom')));
    }
    // 장애물 통과 확인
    checkObstaclePassed() {
        if (!this.obstacleManager || this.isGameOver)
            return;
        const obstacles = this.obstacleManager.getObstacles();
        const playerX = GAME_WIDTH * 0.3; // 플레이어의 고정된 x 위치
        for (const obstacle of obstacles) {
            if (obstacle.isActive() && !obstacle.isPassed()) {
                // 통과 감지 지점을 장애물 좌측 가장자리로 설정 (파이프 중간이 아님)
                const passPoint = obstacle.getCenterX() - (obstacle.getWidth() / 2) * 0.5;
                if (playerX > passPoint) {
                    this.soundPlayer.play('pass');
                    obstacle.setPassed(true);
                    this.scoreManager.incrementScore();
                }
            }
        }
    }
    update() {
        this.checkObstaclePassed();
    }
    // 물리 시뮬레이션 시작
    startPhysics() {
        if (!this.isPhysicsStarted) {
            Runner.run(this.runner, this.engine);
            this.isPhysicsStarted = true;
        }
    }
    // 물리 시뮬레이션 중지
    stopPhysics() {
        if (this.isPhysicsStarted) {
            Runner.stop(this.runner);
            this.isPhysicsStarted = false;
        }
    }
    // 물리 바디 추가
    addBody(body) {
        Composite.add(this.engine.world, body);
    }
    // 물리 바디 제거
    removeBody(body) {
        Composite.remove(this.engine.world, body);
    }
    // 물리 엔진 인스턴스 반환
    getEngine() {
        return this.engine;
    }
}
