import { TextStyle } from 'pixi.js';
import { COLORS } from '../../config/constants';

export const TitleTextStyle = (
  fontSize = 40,
  color = COLORS.WHITE
): TextStyle =>
  new TextStyle({
    fontFamily: 'Pixelify Sans',
    fontSize,
    lineHeight: fontSize,
    letterSpacing: fontSize * 0.12,
    fill: color,
    stroke: {
      color: COLORS.BLACK,
      width: 4,
    },
    align: 'center',
    dropShadow: {
      color: COLORS.BLACK,
      blur: 0,
      angle: Math.PI / 6,
      distance: 4,
      alpha: 1,
    },
  });

export const SubtitleTextStyle = (fontSize = 32): TextStyle =>
  new TextStyle({
    fontFamily: 'Pixelify Sans',
    fontSize,
    fill: COLORS.WHITE,
    stroke: {
      color: COLORS.BLACK,
      width: 5,
    },
    align: 'center',
  });

export const ButtonTextStyle = (
  fontSize = 28,
  color = COLORS.BLACK
): TextStyle =>
  new TextStyle({
    fontFamily: 'Pixelify Sans',
    fontSize,
    fill: color,
    align: 'center',
  });
