import { Assets, Container, Sprite, Text } from 'pixi.js';
import { GameStatus } from '../../types';
import { TitleTextStyle } from '../../styles/TextStyles';
import Button from '../view/Button';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../../../config/constants';
export default class SelectLevelScene {
    constructor(app, switchScene) {
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
        Object.defineProperty(this, "sceneContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentDifficulty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.app = app;
        this.switchScene = switchScene;
        this.sceneContainer = new Container();
        this.currentDifficulty = {
            text: 'NORMAL',
            color: COLORS.NORMAL,
            gridSize: 4,
        };
        this.init();
    }
    async init() {
        const introText = new Text({
            text: '1.PLEASE\nSELECT YOUR\nLEVEL',
            style: TitleTextStyle(32),
        });
        introText.anchor.set(0.5);
        introText.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 5);
        // 구름 이미지 로드 및 배치
        const cloudTexture = await Assets.load('assets/images/cloud.png');
        const cloudSprite = new Sprite(cloudTexture);
        // 구름 이미지를 화면 하단에 배치
        cloudSprite.anchor.set(0.5, 0.99); // x축 중앙, y축 하단 기준점
        cloudSprite.position.set(GAME_WIDTH / 2, GAME_HEIGHT); // 화면 하단 중앙에 위치
        // 필요에 따라 구름 크기 조정
        const cloudScale = GAME_WIDTH / cloudTexture.width; // 화면 너비에 맞게 조정
        cloudSprite.scale.set(cloudScale);
        // 난이도 이미지 로드
        const easyTexture = await Assets.load('assets/images/easy.png');
        const normalTexture = await Assets.load('assets/images/normal.png');
        const hardTexture = await Assets.load('assets/images/hard.png');
        // 난이도 이미지 스프라이트 생성
        const easySprite = new Sprite(easyTexture);
        const normalSprite = new Sprite(normalTexture);
        const hardSprite = new Sprite(hardTexture);
        // 모든 난이도 이미지 설정
        const difficultySprites = [easySprite, normalSprite, hardSprite];
        difficultySprites.forEach((sprite) => {
            sprite.anchor.set(0.5);
            sprite.position.set(GAME_WIDTH / 2, GAME_HEIGHT - cloudSprite.height * 0.96);
            sprite.visible = false;
        });
        normalSprite.visible = true; // 처음에는 'NORMAL' 난이도 표시
        const difficultyText = new Text({
            text: 'NORMAL',
            style: TitleTextStyle(52, COLORS.NORMAL),
        });
        difficultyText.anchor.set(0.5);
        difficultyText.position.set(GAME_WIDTH / 2, GAME_HEIGHT - cloudSprite.height * 0.65);
        const leftArrowTexture = await Assets.load('assets/images/left_arrow.png');
        const leftArrow = new Sprite(leftArrowTexture);
        leftArrow.anchor.set(0.5);
        leftArrow.width = 40;
        leftArrow.height = 40;
        leftArrow.position.set(20 + leftArrow.width / 2, difficultyText.y);
        const rightArrowTexture = await Assets.load('assets/images/right_arrow.png');
        const rightArrow = new Sprite(rightArrowTexture);
        rightArrow.anchor.set(0.5);
        rightArrow.width = 40;
        rightArrow.height = 40;
        rightArrow.position.set(GAME_WIDTH - 20 - rightArrow.width / 2, difficultyText.y);
        // 이미지에 클릭 이벤트 추가
        leftArrow.eventMode = 'static';
        leftArrow.cursor = 'pointer';
        rightArrow.eventMode = 'static';
        rightArrow.cursor = 'pointer';
        // 현재 난이도 인덱스 (0: EASY, 1: NORMAL, 2: HARD)
        let currentDifficultyIndex = 1; // 기본값은 NORMAL
        // 난이도 설정 배열
        const difficulties = [
            { text: 'EASY', color: COLORS.EASY, gridSize: 3 },
            { text: 'NORMAL', color: COLORS.NORMAL, gridSize: 4 },
            { text: 'HARD', color: COLORS.HARD, gridSize: 5 },
        ];
        // 난이도 변경 함수
        const changeDifficulty = (direction) => {
            // 새 인덱스 계산 (범위 내에서만)
            const newIndex = Math.max(0, Math.min(2, currentDifficultyIndex + direction));
            // 인덱스가 변경된 경우에만 업데이트
            if (newIndex !== currentDifficultyIndex) {
                currentDifficultyIndex = newIndex;
                // 난이도 업데이트
                this.currentDifficulty = difficulties[currentDifficultyIndex];
                // 텍스트 업데이트
                difficultyText.text = this.currentDifficulty.text;
                difficultyText.style.fill = this.currentDifficulty.color;
                // 이미지 업데이트
                difficultySprites.forEach((sprite, index) => {
                    sprite.visible = index === currentDifficultyIndex;
                });
                // 화살표 가시성 업데이트
                leftArrow.visible = currentDifficultyIndex > 0; // EASY가 아닐 때만 왼쪽 화살표 표시
                rightArrow.visible = currentDifficultyIndex < 2; // HARD가 아닐 때만 오른쪽 화살표 표시
            }
        };
        // 이벤트 핸들러 등록
        leftArrow.on('pointerdown', () => changeDifficulty(-1)); // 난이도 낮추기
        rightArrow.on('pointerdown', () => changeDifficulty(1)); // 난이도 높이기
        leftArrow.visible = true;
        rightArrow.visible = true;
        const buttonContainer = Button({
            width: 200,
            height: 50,
            text: 'Go to Next',
            fontSize: 28,
            fillColor: COLORS.SECONDARY,
            textColor: COLORS.BLACK,
            borderColor: COLORS.BLACK,
            borderWidth: 3,
            borderRadius: 10,
            onClick: () => this.switchScene({
                status: GameStatus.SELECT_ARTIST,
                gridSize: this.currentDifficulty.gridSize,
            }),
        });
        buttonContainer.position.set(GAME_WIDTH / 2 - 100, // 버튼 너비의 절반을 빼서 중앙 정렬
        GAME_HEIGHT - 55 - 50 // 화면 하단에서 55px 위, 버튼 높이 고려
        );
        // 컨테이너에 요소 추가 (순서대로 추가하여 레이어 순서 설정)
        this.sceneContainer.addChild(introText, cloudSprite, easySprite, normalSprite, hardSprite, difficultyText, leftArrow, rightArrow, buttonContainer);
        // 씬 컨테이너를 스테이지에 추가
        this.app.stage.addChild(this.sceneContainer);
    }
    cleanup() {
        this.sceneContainer.removeChildren();
    }
}
