// src/game/component/ui/ProgressBar.ts
import { Container, Graphics } from "pixi.js";

export interface ProgressBarConfig {
  width: number;
  height: number;
  x: number;
  y: number;
  backgroundColor?: number;
  fillColor?: number;
  borderRadius?: number;
}

export interface ProgressBarEvents {
  onAnimationComplete?: () => void;
  onProgress?: (progress: number) => void;
}

export class ProgressBar extends Container {
  private background!: Graphics;
  private fill!: Graphics;
  private config: ProgressBarConfig;
  private events: ProgressBarEvents;

  private currentProgress: number = 1.0;
  private animationId: number = 0;

  constructor(config: ProgressBarConfig, events: ProgressBarEvents = {}) {
    super();

    this.config = {
      backgroundColor: 0xd9d9d9,
      fillColor: 0x000000,
      borderRadius: 0,
      ...config,
    };

    this.events = events;

    this.createProgressBar();
    this.setPosition(config.x, config.y);
  }

  /**
   * ProgressBar UI 생성
   */
  private createProgressBar(): void {
    // 배경 생성
    this.background = new Graphics();
    this.background.rect(0, 0, this.config.width, this.config.height);
    this.background.fill(this.config.backgroundColor!);

    // 채우기 부분 생성
    this.fill = new Graphics();

    this.addChild(this.background, this.fill);

    // 초기 프로그레스 설정
    this.updateProgress(this.currentProgress);
  }

  /**
   * 프로그레스 업데이트 (0.0 ~ 1.0)
   */
  public updateProgress(progress: number, animate: boolean = false): void {
    const clampedProgress = Math.max(0, Math.min(1, progress));

    if (animate) {
      this.animateToProgress(clampedProgress);
    } else {
      this.setProgressImmediate(clampedProgress);
    }
  }

  /**
   * 즉시 프로그레스 변경
   */
  private setProgressImmediate(progress: number): void {
    this.currentProgress = progress;
    this.renderProgress();
    this.events.onProgress?.(progress);
  }

  /**
   * 애니메이션으로 프로그레스 변경
   */
  private animateToProgress(targetProgress: number): void {
    const startProgress = this.currentProgress;
    const progressDiff = targetProgress - startProgress;
    const duration = 300; // 300ms 애니메이션
    const startTime = Date.now();

    // 기존 애니메이션 취소
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);

      // easeOutQuad 애니메이션
      const easedT = 1 - (1 - t) * (1 - t);
      const currentProgress = startProgress + progressDiff * easedT;

      this.setProgressImmediate(currentProgress);

      if (t < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.events.onAnimationComplete?.();
      }
    };

    animate();
  }

  /**
   * 실제 그래픽 렌더링
   */
  private renderProgress(): void {
    this.fill.clear();

    const fillWidth = this.config.width * this.currentProgress;

    if (fillWidth > 0) {
      if (this.config.borderRadius && this.config.borderRadius > 0) {
        this.fill.roundRect(
          0,
          0,
          fillWidth,
          this.config.height,
          this.config.borderRadius
        );
      } else {
        this.fill.rect(0, 0, fillWidth, this.config.height);
      }
      this.fill.fill(this.config.fillColor!);
    }
  }

  /**
   * 위치 설정
   */
  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * 표시/숨기기
   */
  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  /**
   * 프로그레스 리셋
   */
  public reset(): void {
    this.updateProgress(1.0);
  }

  /**
   * 현재 프로그레스 값 반환
   */
  public getProgress(): number {
    return this.currentProgress;
  }

  /**
   * 스타일 업데이트
   */
  public updateStyle(newConfig: Partial<ProgressBarConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // 배경 다시 그리기
    this.background.clear();
    this.background.rect(0, 0, this.config.width, this.config.height);
    this.background.fill(this.config.backgroundColor!);

    // 프로그레스 다시 그리기
    this.renderProgress();
  }

  /**
   * 정리
   */
  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    super.destroy();
  }
}
