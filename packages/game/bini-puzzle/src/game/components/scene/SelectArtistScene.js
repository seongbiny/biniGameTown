import { Text, Container, Assets, Sprite, Graphics, } from 'pixi.js';
import { GameStatus } from '../../types';
import { TitleTextStyle } from '../../styles/TextStyles';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../../../config/constants';
export default class SelectArtistScene {
    constructor(app, switchScene, gameState) {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "switchScene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gameState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sceneContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "njzAnimationState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "animationTicker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.app = app;
        this.switchScene = switchScene;
        this.gameState = gameState;
        this.sceneContainer = new Container();
        this.njzAnimationState = {
            isAnimation: false,
            targetSize: 0,
            speed: 0.1,
        };
        this.animationTicker = () => { };
        this.init();
    }
    async init() {
        const introText = new Text({
            text: '2.PLEASE\nSELECT THE\nARTIST',
            style: TitleTextStyle(32),
        });
        introText.anchor.set(0.5);
        introText.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 5);
        const blueCloudTexture = await Assets.load('assets/images/blueCloud.png');
        const blueCloudSprite = new Sprite(blueCloudTexture);
        blueCloudSprite.anchor.set(0.5, 0.99);
        blueCloudSprite.position.set(GAME_WIDTH / 2, GAME_HEIGHT);
        const cloudScale = GAME_WIDTH / blueCloudTexture.width;
        blueCloudSprite.scale.set(cloudScale);
        // 원들을 담을 컨테이너 생성
        const circlesContainer = new Container();
        // 아티스트 이미지 로드
        const njzTexture = await Assets.load('assets/images/njz.png');
        const meovvTexture = await Assets.load('assets/images/meovv.jpg');
        const aespaTexture = await Assets.load('assets/images/aespa.jpg');
        const blackpinkTexture = await Assets.load('assets/images/blackpink.jpeg');
        // 원 1: position(20, 295), 크기 160x160 - NJZ
        // 마스크용 원 (테두리 없이 채우기만)
        const circleMask1 = new Graphics()
            .fill({ color: COLORS.WHITE })
            .circle(0, 0, 95)
            .fill();
        // 테두리용 원 (채우기 없이 테두리만)
        const circle1 = new Graphics()
            .setStrokeStyle({ width: 3, color: COLORS.BLACK })
            .circle(0, 0, 95)
            .stroke();
        // NJZ 이미지 추가
        const njzSprite = new Sprite(njzTexture);
        njzSprite.anchor.set(0.5); // 이미지 중심점 설정
        const circle1Size = 190;
        njzSprite.width = circle1Size;
        njzSprite.height = circle1Size;
        this.njzAnimationState.targetSize = circle1Size;
        // 원 2: position(186, 398), 크기 130x130 - MEOVV
        // 마스크용 원 (테두리 없이 채우기만)
        const circleMask2 = new Graphics()
            .fill({ color: COLORS.BLACK, alpha: 0.5 })
            .circle(0, 0, 80) // 반지름 65 (지름 130)
            .fill();
        // 테두리용 원 (채우기 없이 테두리만)
        const circle2 = new Graphics()
            .fill({ color: COLORS.BLACK, alpha: 0.5 }) // 검은색 50% 투명도
            .setStrokeStyle({ width: 3, color: COLORS.BLACK })
            .circle(0, 0, 80)
            .fill()
            .stroke();
        // MEOVV 이미지 추가
        const meovvSprite = new Sprite(meovvTexture);
        meovvSprite.anchor.set(0.5);
        const circle2Size = 160;
        meovvSprite.width = circle2Size;
        meovvSprite.height = circle2Size;
        // 원 3: position(70, 519), 크기 140x140 - AESPA
        // 마스크용 원 (테두리 없이 채우기만)
        const circleMask3 = new Graphics()
            .fill({ color: COLORS.WHITE })
            .circle(0, 0, 85) // 반지름 70 (지름 140)
            .fill();
        // 테두리용 원 (채우기 없이 테두리만)
        const circle3 = new Graphics()
            .fill({ color: COLORS.BLACK, alpha: 0.5 }) // 검은색 50% 투명도
            .setStrokeStyle({ width: 3, color: COLORS.BLACK })
            .circle(0, 0, 85)
            .fill()
            .stroke();
        // AESPA 이미지 추가
        const aespaSprite = new Sprite(aespaTexture);
        aespaSprite.anchor.set(0.5);
        const circle3Size = 170;
        aespaSprite.width = circle3Size;
        aespaSprite.height = circle3Size;
        // 원 4: position(215, 624), 크기 130x130 - BLACKPINK
        // 마스크용 원 (테두리 없이 채우기만)
        const circleMask4 = new Graphics()
            .fill({ color: COLORS.WHITE })
            .circle(0, 0, 80) // 반지름 65 (지름 130)
            .fill();
        // 테두리용 원 (채우기 없이 테두리만)
        const circle4 = new Graphics()
            .fill({ color: COLORS.BLACK, alpha: 0.5 }) // 검은색 50% 투명도
            .setStrokeStyle({ width: 3, color: COLORS.BLACK })
            .circle(0, 0, 80)
            .fill()
            .stroke();
        // BLACKPINK 이미지 추가
        const blackpinkSprite = new Sprite(blackpinkTexture);
        blackpinkSprite.anchor.set(0.5);
        const circle4Size = 160;
        blackpinkSprite.width = circle4Size;
        blackpinkSprite.height = circle4Size;
        // 원들의 전체 영역 계산을 위한 값들
        const totalWidth = 300;
        const totalHeight = 450;
        // 원들의 상대 위치 조정 (0,0 기준)
        // NJZ (첫 번째 원)
        circleMask1.position.set(80, 80);
        circle1.position.set(80, 80);
        njzSprite.position.set(80, 80);
        // MEOVV (두 번째 원)
        circleMask2.position.set(246, 183);
        circle2.position.set(246, 183);
        meovvSprite.position.set(246, 183);
        // AESPA (세 번째 원)
        circleMask3.position.set(70, 304);
        circle3.position.set(70, 304);
        aespaSprite.position.set(70, 304);
        // BLACKPINK (네 번째 원)
        circleMask4.position.set(230, 420);
        circle4.position.set(230, 420);
        blackpinkSprite.position.set(230, 420);
        // 마스크 적용
        njzSprite.mask = circleMask1;
        meovvSprite.mask = circleMask2;
        aespaSprite.mask = circleMask3;
        blackpinkSprite.mask = circleMask4;
        this.animationTicker = (time) => {
            if (this.njzAnimationState.isAnimation) {
                const currentSize = njzSprite.width;
                const targetSize = this.njzAnimationState.targetSize;
                const speed = this.njzAnimationState.speed * time.deltaTime;
                if (Math.abs(currentSize - targetSize) > 0.5) {
                    njzSprite.width += (targetSize - currentSize) * speed;
                    njzSprite.height += (targetSize - currentSize) * speed;
                }
                else {
                    njzSprite.width = targetSize;
                    njzSprite.height = targetSize;
                    this.njzAnimationState.isAnimation = false;
                }
            }
        };
        // 애니메이션 틱커 추가
        this.app.ticker.add(this.animationTicker);
        circle1.eventMode = 'static';
        circle1.cursor = 'pointer';
        njzSprite.eventMode = 'static';
        njzSprite.cursor = 'pointer';
        const hoverScale = 1.2;
        const handlePointerOver = () => {
            this.njzAnimationState.isAnimation = true;
            this.njzAnimationState.targetSize = circle1Size * hoverScale;
        };
        const handlePointerOut = () => {
            this.njzAnimationState.isAnimation = true;
            this.njzAnimationState.targetSize = circle1Size;
        };
        const handleClick = () => {
            this.switchScene({
                status: GameStatus.SELECT_MEMBER,
                selectedArtist: 'njz',
                gridSize: this.gameState.gridSize,
            });
        };
        // 이벤트 리스너 등록
        circle1.on('pointerdown', handleClick);
        circle1.on('pointerover', handlePointerOver);
        circle1.on('pointerout', handlePointerOut);
        njzSprite.on('pointerdown', handleClick);
        njzSprite.on('pointerover', handlePointerOver);
        njzSprite.on('pointerout', handlePointerOut);
        // 다른 원들은 이벤트 모드 비활성화
        circle2.eventMode = 'none';
        meovvSprite.eventMode = 'none';
        circle3.eventMode = 'none';
        aespaSprite.eventMode = 'none';
        circle4.eventMode = 'none';
        blackpinkSprite.eventMode = 'none';
        // 원들을 컨테이너에 추가
        circlesContainer.addChild(circleMask1, njzSprite, circle1, circleMask2, meovvSprite, circle2, circleMask3, aespaSprite, circle3, circleMask4, blackpinkSprite, circle4);
        // 컨테이너 중앙 정렬
        circlesContainer.position.set((GAME_WIDTH - totalWidth) / 2, (GAME_HEIGHT - totalHeight) / 2 + 100 // 제목 텍스트 고려하여 약간 아래로 조정
        );
        // 씬 컨테이너에 요소들 추가
        this.sceneContainer.addChild(introText, blueCloudSprite, circlesContainer);
        this.app.stage.addChild(this.sceneContainer);
    }
    cleanup() {
        this.app.ticker.remove(this.animationTicker);
        this.sceneContainer.removeChildren();
    }
}
