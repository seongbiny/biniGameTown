import { Container } from 'pixi.js';
import { Obstacle } from './Obstacle';

export class ObstacleManager extends Container {
  private obstacles: Obstacle[] = []; // 장애물 객체 배열
  private readonly POOL_SIZE: number = 3; // 장애물 풀 크기
  private currentSpeed: number = 10; // 장애물 이동 속도
  private currentGapSize: number = 200; // 장애물 사이 틈 크기
  private spawnTimer: number = 0; // 장애물 생성 타이머
  private spawnInterval: number = 160; // 장애물 생성 간격

  constructor() {
    super();
    this.initializePool();
  }

  // 장애물 풀 초기화
  private initializePool(): void {
    for (let i = 0; i < this.POOL_SIZE; i++) {
      const obstacle = new Obstacle();
      this.obstacles.push(obstacle);
      this.addChild(obstacle);
    }

    // 첫 번째 장애물 바로 활성화
    if (this.obstacles.length > 0) {
      this.obstacles[0].activate(this.currentGapSize);
    }
  }

  public update(deltaTime: number, score: number): void {
    this.spawnTimer += deltaTime;
    this.updateGapSize(score);
    this.updateSpawnInterval(score);
    this.updateSpeed(score);

    // 필요시 새 장애물 활성화
    this.activateObstacleIfNeeded();

    // 활성화된 장애물 업데이트
    this.updateActiveObstacles(deltaTime);
  }

  // SPAWN_INTERVAL 마다 장애물 활성화
  private activateObstacleIfNeeded(): void {
    // 비활성 상태인 장애물 찾기
    if (this.spawnTimer >= this.spawnInterval) {
      const inactiveObstacle = this.obstacles.find((obs) => !obs.isActive());

      if (inactiveObstacle) {
        inactiveObstacle.activate(this.currentGapSize);
        this.spawnTimer = 0;
      }
    }
  }

  // 활성 장애물 업데이트
  private updateActiveObstacles(deltaTime: number): void {
    // 화면 밖으로 나갔는지 확인하고 나갔다면 비활성화
    for (const obstacle of this.obstacles) {
      if (obstacle.isActive()) {
        obstacle.update(this.currentSpeed, deltaTime);

        if (obstacle.isOffScreen()) {
          obstacle.deactivate();
        }
      }
    }
  }

  public getObstacles(): Obstacle[] {
    return this.obstacles;
  }

  public reset(): void {
    for (const obstacle of this.obstacles) {
      obstacle.deactivate();
    }
    this.spawnTimer = 0;
    this.currentSpeed = 10;
    this.currentGapSize = 200;
    this.spawnInterval = 160;
  }

  public updateGapSize(score: number): void {
    if (score >= 20) {
      this.currentGapSize = 120;
    } else if (score >= 15) {
      this.currentGapSize = 140;
    } else if (score >= 10) {
      this.currentGapSize = 160;
    } else if (score >= 5) {
      this.currentGapSize = 180;
    } else {
      this.currentGapSize = 200;
    }
  }

  public updateSpawnInterval(score: number): void {
    if (score >= 20) {
      this.spawnInterval = 80;
    } else if (score >= 15) {
      this.spawnInterval = 100;
    } else if (score >= 10) {
      this.spawnInterval = 120;
    } else if (score >= 5) {
      this.spawnInterval = 140;
    } else {
      this.spawnInterval = 160;
    }
  }

  public updateSpeed(score: number): void {
    if (score >= 30) {
      const additionalSpeed = Math.floor((score - 20) / 10) * 0.5;
      this.currentSpeed = 2 + additionalSpeed;
      this.currentSpeed = Math.min(this.currentSpeed, 5);
    } else {
      this.currentSpeed = 2;
    }
  }

  public setDebugGraphicsVisibility(visible: boolean): void {
    // 모든 활성화된 장애물에 대해 디버그 그래픽 표시/숨김 설정
    for (const obstacle of this.obstacles) {
      obstacle.setDebugGraphicsVisibility(visible);
    }
  }
}
