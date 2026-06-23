import { Text, type TextStyleOptions } from 'pixi.js';

export function createText(content: string, style?: Partial<TextStyleOptions>): Text {
  return new Text({
    text: content,
    style: {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      ...style,
    },
  });
}
