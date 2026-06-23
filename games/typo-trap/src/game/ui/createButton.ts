import { Container, Graphics, Text } from 'pixi.js';

interface ButtonOptions {
  width?: number;
  height?: number;
  color?: number;
  fontSize?: number;
}

export function createButton(
  label: string,
  onClick: () => void,
  options?: ButtonOptions
): Container {
  const { width = 200, height = 56, color = 0x4a90e2, fontSize = 22 } = options ?? {};

  const container = new Container();

  const bg = new Graphics();
  bg.roundRect(0, 0, width, height, 10);
  bg.fill(color);

  const text = new Text({
    text: label,
    style: { fill: 0xffffff, fontSize, fontFamily: 'Arial, sans-serif' },
  });
  text.anchor.set(0.5);
  text.x = width / 2;
  text.y = height / 2;

  container.addChild(bg, text);
  container.interactive = true;
  container.cursor = 'pointer';
  container.on('pointerdown', onClick);

  container.on('pointerenter', () => { bg.tint = 0xcccccc; });
  container.on('pointerleave', () => { bg.tint = 0xffffff; });

  return container;
}
