// src/game/components/ui/Button.ts
import { Container, Graphics, Text } from 'pixi.js';
import { COLORS } from '../../../config/constants';
import { ButtonTextStyle } from '../../styles/TextStyles';

interface ButtonOptions {
  width?: number;
  height?: number;
  text: string;
  fontSize?: number;
  fillColor?: number;
  textColor?: number;
  borderColor?: number;
  borderWidth?: number;
  borderRadius?: number;
  onClick?: () => void;
}

export default function Button(options: ButtonOptions): Container {
  const {
    width = 200,
    height = 50,
    text,
    fontSize = 28,
    fillColor = COLORS.SECONDARY,
    textColor = COLORS.BLACK,
    borderColor = COLORS.BLACK,
    borderWidth = 3,
    borderRadius = 10,
    onClick,
  } = options;

  const buttonContainer = new Container();

  const buttonBackground = new Graphics()
    .fill({ color: fillColor })
    .setStrokeStyle({ width: borderWidth, color: borderColor })
    .roundRect(0, 0, width, height, borderRadius)
    .fill()
    .stroke();

  const buttonText = new Text({
    text,
    style: ButtonTextStyle(fontSize, textColor),
  });

  buttonText.anchor.set(0.5);
  buttonText.position.set(width / 2, height / 2);

  buttonContainer.addChild(buttonBackground, buttonText);

  if (onClick) {
    buttonBackground.eventMode = 'static';
    buttonBackground.cursor = 'pointer';
    buttonBackground.on('pointerdown', onClick);
  }

  return buttonContainer;
}
