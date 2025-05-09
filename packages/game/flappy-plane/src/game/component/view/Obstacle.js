import { Container, Graphics, Sprite } from 'pixi.js';
import { DEFAULT_CONFIG } from '../../../config';
import { Bodies, Body } from 'matter-js';
import { GameController } from '../../core/GameController';
const { GAME_WIDTH, GAME_HEIGHT } = DEFAULT_CONFIG;
export class Obstacle extends Container {
    constructor() {
        super();
        Object.defineProperty(this, "topRock", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 상단 파이프
        Object.defineProperty(this, "bottomRock", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 하단 파이프
        Object.defineProperty(this, "debugGraphics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "positionX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // x 위치
        Object.defineProperty(this, "active", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        }); // 활성화 상태
        Object.defineProperty(this, "passed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "topBody", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "bottomBody", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.debugGraphics = new Graphics();
        this.debugGraphics.visible = false;
        this.topRock = Sprite.from('rockTop');
        this.topRock.anchor.set(0.5, 0);
        this.topRock.visible = false;
        this.bottomRock = Sprite.from('rockBottom');
        this.bottomRock.anchor.set(0.5, 1);
        this.bottomRock.visible = false;
        this.addChild(this.topRock, this.bottomRock, this.debugGraphics);
    }
    activate(gapSize) {
        this.active = true;
        this.passed = false; // 통과 상태 초기화
        this.positionX = GAME_WIDTH + 100; // 화면 오른쪽 바깥에 위치
        const availableHeight = GAME_HEIGHT - gapSize;
        const topRockRation = 0.3 + Math.random() * 0.4; // 30%~70% 랜덤 비율
        const topRockHeight = availableHeight * topRockRation; // 상단 파이프 높이
        const bottomRockHeight = availableHeight - topRockHeight; // 하단 파이프 높이
        this.topRock.y = 0; // 상단 파이프는 화면 상단에 위치
        this.topRock.height = topRockHeight;
        this.bottomRock.y = GAME_HEIGHT; // 하단 파이프는 화면 하단에 위치
        this.bottomRock.height = bottomRockHeight;
        this.topRock.visible = true;
        this.bottomRock.visible = true;
        this.x = this.positionX;
        this.createPhysicsBodies();
    }
    createPhysicsBodies() {
        const topWidth = this.topRock.width;
        const topHeight = this.topRock.height;
        // 꼭지점 위치를 width의 3/5 지점으로 조정
        const topPointX = topWidth * (2 / 3) - topWidth / 2;
        const topVertices = [
            { x: -topWidth / 2, y: 0 },
            { x: topWidth / 2, y: 0 },
            { x: topPointX, y: topHeight },
        ];
        const bottomWidth = this.bottomRock.width;
        const bottomHeight = this.bottomRock.height;
        // 꼭지점 위치를 width의 3/5 지점으로 조정
        const bottomPointX = bottomWidth * (2 / 3) - bottomWidth / 2;
        const bottomVertices = [
            { x: -bottomWidth / 2, y: 0 },
            { x: bottomWidth / 2, y: 0 },
            { x: bottomPointX, y: -bottomHeight },
        ];
        if (this.topBody)
            GameController.getInstance().removeBody(this.topBody);
        if (this.bottomBody)
            GameController.getInstance().removeBody(this.bottomBody);
        this.topBody = Bodies.fromVertices(this.positionX, this.topRock.y + topHeight / 3, // 중심점 위치 조정
        [topVertices], {
            isStatic: true, // 고정 바디
            label: 'obstacle-top',
            isSensor: true,
        }, true);
        this.bottomBody = Bodies.fromVertices(this.positionX, this.bottomRock.y - bottomHeight / 3, // 중심점 위치 조정
        [bottomVertices], {
            isStatic: true,
            label: 'obstacle-bottom',
            isSensor: true,
        }, true);
        const gameController = GameController.getInstance();
        gameController.addBody(this.topBody);
        gameController.addBody(this.bottomBody);
        this.updateDebugGraphics();
    }
    updateDebugGraphics() {
        this.debugGraphics.clear();
        if (this.topBody) {
            const topVertices = this.topBody.vertices;
            this.debugGraphics.setStrokeStyle({
                width: 2,
                color: 0xff0000,
                alpha: 0.8,
            });
            this.debugGraphics.fill({ color: 0xff0000, alpha: 0.2 });
            this.debugGraphics.moveTo(topVertices[0].x, topVertices[0].y);
            this.debugGraphics.moveTo(topVertices[0].x - this.x, topVertices[0].y - this.y);
            for (let i = 1; i < topVertices.length; i++) {
                this.debugGraphics.lineTo(topVertices[i].x - this.x, topVertices[i].y - this.y);
            }
            this.debugGraphics.lineTo(topVertices[0].x - this.x, topVertices[0].y - this.y);
            this.debugGraphics.fill();
        }
        if (this.bottomBody) {
            const bottomVertices = this.bottomBody.vertices;
            this.debugGraphics.setStrokeStyle({
                width: 2,
                color: 0x0000ff,
                alpha: 0.8,
            }); // 파란색 선
            this.debugGraphics.fill({ color: 0x0000ff, alpha: 0.2 }); // 반투명 파란색 채우기
            // 첫 번째 점으로 이동
            this.debugGraphics.moveTo(bottomVertices[0].x - this.x, bottomVertices[0].y - this.y);
            // 나머지 점들을 연결
            for (let i = 1; i < bottomVertices.length; i++) {
                this.debugGraphics.lineTo(bottomVertices[i].x - this.x, bottomVertices[i].y - this.y);
            }
            // 도형 닫기
            this.debugGraphics.lineTo(bottomVertices[0].x - this.x, bottomVertices[0].y - this.y);
            this.debugGraphics.fill();
        }
    }
    // 장애물 이동 로직
    update(speed, deltaTime) {
        if (!this.active)
            return;
        // 장애물의 x 위치를 왼쪽으로 업데이트
        this.positionX -= speed * deltaTime;
        this.x = this.positionX;
        // 물리 바디 위치도 함께 업데이트
        if (this.topBody) {
            Body.setPosition(this.topBody, {
                x: this.positionX,
                y: this.topBody.position.y,
            });
        }
        if (this.bottomBody) {
            Body.setPosition(this.bottomBody, {
                x: this.positionX,
                y: this.bottomBody.position.y,
            });
        }
        this.updateDebugGraphics();
    }
    deactivate() {
        this.active = false;
        this.passed = false;
        this.topRock.visible = false;
        this.bottomRock.visible = false;
        // 물리 바디 제거
        if (this.topBody) {
            GameController.getInstance().removeBody(this.topBody);
            this.topBody = null;
        }
        if (this.bottomBody) {
            GameController.getInstance().removeBody(this.bottomBody);
            this.bottomBody = null;
        }
        this.debugGraphics.clear();
    }
    isOffScreen() {
        return this.positionX < -100;
    }
    isActive() {
        return this.active;
    }
    isPassed() {
        return this.passed;
    }
    setPassed(value) {
        this.passed = value;
    }
    getCenterX() {
        return this.positionX;
    }
    getWidth() {
        return this.topRock.width;
    }
    setDebugGraphicsVisibility(visible) {
        this.debugGraphics.visible = visible;
    }
}
