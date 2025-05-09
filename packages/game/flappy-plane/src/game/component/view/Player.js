import { Sprite } from 'pixi.js';
import { DEFAULT_CONFIG } from '../../../config';
import { Bodies, Body } from 'matter-js';
import { GameController } from '../../core/GameController';
const { GAME_WIDTH } = DEFAULT_CONFIG;
export class Player extends Sprite {
    constructor() {
        // Sprite 생성자에 텍스처 전달
        super(Sprite.from('plane').texture);
        // 플레이어 설정값
        Object.defineProperty(this, "JUMP_FORCE", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.03
        }); // 점프 힘 (음수 = 위로)
        Object.defineProperty(this, "ROTATION_SPEED", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.1
        }); // 회전 속도
        Object.defineProperty(this, "MAX_ROTATION", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.5
        }); // 최대 아래 회전 값
        Object.defineProperty(this, "MIN_ROTATION", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -0.5
        }); // 최대 위 회전 값
        Object.defineProperty(this, "MAX_UPWARD_VELOCITY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -10
        }); // 최대 위쪽 속도 제한
        Object.defineProperty(this, "isAlive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        }); // 생존 상태
        Object.defineProperty(this, "physicsBody", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "canJump", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isJumpBlocked", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.width = 62;
        this.height = 48;
        this.anchor.set(0.5);
        this.x = GAME_WIDTH * 0.3;
        this.y = 250;
        this.createPhysicsBody();
        this.setupEventListeners();
    }
    setupEventListeners() {
        document.addEventListener('pointerdown', () => {
            if (this.canJump && !this.isJumpBlocked)
                this.jump();
        });
        document.addEventListener('keydown', (event) => {
            if (this.canJump && !this.isJumpBlocked && event.code === 'Space') {
                this.jump();
            }
        });
        document.addEventListener('touchstart', (event) => {
            if (this.canJump && !this.isJumpBlocked) {
                event.preventDefault();
                this.jump();
            }
        });
    }
    createPhysicsBody() {
        // 원형 물리 바디 생성
        this.physicsBody = Bodies.circle(this.x, // x 위치
        this.y, // y 위치
        (this.width / 2) * 0.7, // 반지름 (시각적 크기보다 약간 작게)
        {
            label: 'player',
            restitution: 0.3, // 탄성
            friction: 0.1, // 마찰
            density: 0.001, // 밀도 (가볍게)
        });
        GameController.getInstance().addBody(this.physicsBody);
    }
    jump() {
        if (!this.isAlive)
            return;
        const currentVelocity = this.physicsBody.velocity.y;
        if (currentVelocity <= this.MAX_UPWARD_VELOCITY) {
            const reducedForce = this.JUMP_FORCE * 0.3;
            Body.applyForce(this.physicsBody, { x: this.physicsBody.position.x, y: this.physicsBody.position.y }, { x: 0, y: -reducedForce });
        }
        else {
            // 정상적인 점프 힘 적용
            Body.applyForce(this.physicsBody, { x: this.physicsBody.position.x, y: this.physicsBody.position.y }, { x: 0, y: -this.JUMP_FORCE } // y에 음수를 적용하여 위쪽 방향으로 힘 적용
            );
        }
        // 점프할 때 새가 위를 향하도록 회전
        this.rotation = this.MIN_ROTATION;
    }
    die() {
        this.isAlive = false;
        Body.setVelocity(this.physicsBody, { x: 0, y: 5 });
        Body.setAngularVelocity(this.physicsBody, 0.2);
    }
    // 게임 루프에서 매 프레임마다 호출될 업데이트 메서드
    update(deltaTime) {
        if (this.isAlive) {
            // 물리 바디의 위치와 속도를 스프라이트에 반영
            this.y = this.physicsBody.position.y;
            // x 위치는 항상 고정
            this.x = GAME_WIDTH * 0.3;
            Body.setPosition(this.physicsBody, {
                x: GAME_WIDTH * 0.3,
                y: this.physicsBody.position.y,
            });
            // 회전 효과 - 떨어질 때 새가 아래를 향하도록
            if (this.physicsBody.velocity.y > 0) {
                this.rotation += this.ROTATION_SPEED * deltaTime;
                if (this.rotation > this.MAX_ROTATION) {
                    this.rotation = this.MAX_ROTATION;
                }
            }
        }
        else {
            this.x = this.physicsBody.position.x;
            this.y = this.physicsBody.position.y;
            this.rotation = this.physicsBody.angle;
            Body.setVelocity(this.physicsBody, {
                x: this.physicsBody.velocity.x,
                y: this.physicsBody.velocity.y + 0.3 * deltaTime,
            });
            Body.setAngularVelocity(this.physicsBody, this.physicsBody.angularVelocity * 1.01);
        }
    }
    reset() {
        this.x = GAME_WIDTH * 0.3;
        this.y = 250;
        this.rotation = 0;
        this.isAlive = true;
        this.canJump = false;
        if (this.physicsBody) {
            Body.setPosition(this.physicsBody, {
                x: this.x,
                y: this.y,
            });
            Body.setVelocity(this.physicsBody, {
                x: 0,
                y: 0,
            });
        }
    }
    enableJumping() {
        this.canJump = true;
    }
}
