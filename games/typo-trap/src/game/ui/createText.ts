import { Text, type TextStyleOptions } from 'pixi.js';

export function createText(content: string, style?: Partial<TextStyleOptions>): Text {
  const text = new Text({
    text: content,
    style: { fill: 0xffffff, fontSize: 24, fontFamily: 'Arial, sans-serif', ...style },
  });
  return text;
}
