import { Container, Texture, TilingSprite } from 'pixi.js';
import { DEFAULT_CONFIG } from '../../../config';
import { Bodies } from 'matter-js';
import { GameController } from '../../core/GameController';
const { GAME_WIDTH, GAME_HEIGHT } = DEFAULT_CONFIG;
export class Ground extends Container {
    constructor() {
        super();
        Object.defineProperty(this, "tilingGround", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tilingTop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "groundHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 70
        });
        Object.defineProperty(this, "topHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 70
        });
        Object.defineProperty(this, "scrollSpeed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 2
        }); // 기본 스크롤 속도 (픽셀/프레임)
        Object.defineProperty(this, "physicsBody", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "topPhysicsBody", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const groundTexture = Texture.from('groundBottom');
        this.tilingGround = new TilingSprite({
            texture: groundTexture,
            width: GAME_WIDTH,
            height: this.groundHeight,
        });
        this.tilingGround.anchor.set(0, 1);
        this.tilingGround.position.set(0, GAME_HEIGHT);
        const topTexture = Texture.from('groundTop');
        this.tilingTop = new TilingSprite({
            texture: topTexture,
            width: GAME_WIDTH,
            height: this.topHeight,
        });
        this.tilingTop.anchor.set(0, 0);
        this.tilingTop.position.set(0, 0);
        this.addChild(this.tilingGround, this.tilingTop);
        this.createPhysicsBody();
    }
    createPhysicsBody() {
        // 직사각형 정적 바디 생성
        this.physicsBody = Bodies.rectangle(GAME_WIDTH / 2, // x 중심점
        GAME_HEIGHT - this.groundHeight / 2, // y 중심점
        GAME_WIDTH, // 너비
        this.groundHeight, // 높이
        {
            isStatic: true, // 움직이지 않는 고정 바디
            label: 'ground',
            friction: 0.3,
        });
        this.topPhysicsBody = Bodies.rectangle(GAME_WIDTH / 2, // x 중심점
        this.topHeight / 2, // y 중심점
        GAME_WIDTH, // 너비
        this.topHeight, // 높이
        {
            isStatic: true,
            label: 'ceiling',
            friction: 0.3,
        });
        GameController.getInstance().addBody(this.physicsBody);
        GameController.getInstance().addBody(this.topPhysicsBody);
    }
    update(deltaTime) {
        this.tilingGround.tilePosition.x -= this.scrollSpeed * deltaTime;
        this.tilingTop.tilePosition.x -= this.scrollSpeed * deltaTime;
    }
    getTopY() {
        return GAME_HEIGHT - this.groundHeight;
    }
}
