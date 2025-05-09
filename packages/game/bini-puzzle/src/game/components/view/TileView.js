import { Container, Graphics, Text, Texture, Sprite, Assets } from 'pixi.js';
import { COLORS } from '../../../config/constants';
// 필요한 타일 이미지들을 미리 로드
export async function preloadTileAssets(gridSize) {
    const assets = [];
    for (let value = 1; value <= gridSize * gridSize - 1; value++) {
        assets.push(`assets/images/grid-${gridSize}-${value}.png`);
    }
    await Assets.load(assets); // 모든 이미지가 로드될 때까지 기다림
}
/**
 * 개별 타일 생성 함수
 */
export function createTile(value, gridSize, cellSize, onClick) {
    const cellContainer = new Container();
    let texture;
    if (value !== 0) {
        texture =
            Assets.get(`assets/images/grid-${gridSize}-${value}.png`) ||
                Texture.EMPTY;
    }
    else {
        texture = Texture.EMPTY;
    }
    const block = new Sprite(texture);
    block.width = cellSize;
    block.height = cellSize;
    block.eventMode = 'static';
    block.cursor = 'pointer';
    const mask = new Graphics()
        .fill({ color: COLORS.WHITE })
        .roundRect(0, 0, cellSize, cellSize, 10)
        .fill();
    block.mask = mask;
    block.on('pointerdown', onClick);
    const text = new Text({
        text: value === 0 ? '' : value.toString(),
        style: {
            fontSize: cellSize / 4,
            fill: COLORS.BACKGROUND,
            stroke: {
                color: COLORS.WHITE,
                width: 2,
            },
        },
    });
    text.anchor.set(0.5);
    text.position.set(cellSize / 5, cellSize / 5);
    cellContainer.addChild(block, text, mask);
    return cellContainer;
}
export function createTiles(puzzle, gridSize, cellSize, padding, onTileClick) {
    const tilesContainer = new Container();
    const tiles = [];
    for (let row = 0; row < gridSize; row++) {
        tiles[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const value = puzzle[row][col];
            const tileContainer = createTile(value, gridSize, cellSize, () => onTileClick(row, col));
            tileContainer.position.set(col * cellSize + padding, row * cellSize + padding);
            tilesContainer.addChild(tileContainer);
            tiles[row][col] = {
                container: tileContainer,
                text: tileContainer.getChildAt(1),
                background: tileContainer.getChildAt(0),
            };
        }
    }
    return { tilesContainer, tiles };
}
export function updateTilesUI(puzzle, tiles, cellSize) {
    const gridSize = puzzle.length;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const value = puzzle[row][col];
            const tile = tiles[row][col];
            // 텍스트 업데이트
            tile.text.text = value === 0 ? '' : value.toString();
            // Sprite 텍스처 업데이트
            if (value !== 0) {
                const texture = Assets.get(`assets/images/grid-${gridSize}-${value}.png`) ||
                    Texture.EMPTY;
                tile.background.texture = texture;
                tile.background.width = cellSize;
                tile.background.height = cellSize;
                tile.background.visible = true;
            }
            else {
                tile.background.visible = false;
            }
        }
    }
}
