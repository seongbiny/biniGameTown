export const calculateStageSize = (width, height) => {
    const maxWidth = Math.min(window.innerWidth, width);
    const maxHeight = Math.min(window.innerHeight, height);
    const widthScale = maxWidth / width;
    const heightScale = maxHeight / height;
    let scale = heightScale;
    if (widthScale < heightScale) {
        scale = widthScale;
    }
    const calculatedWidth = width * scale;
    const calculatedHeight = height * scale;
    console.warn(`calculateStageSize : ${calculatedWidth}, ${calculatedHeight}, ${scale}`);
    return { width: calculatedWidth, height: calculatedHeight, scale: scale };
};
