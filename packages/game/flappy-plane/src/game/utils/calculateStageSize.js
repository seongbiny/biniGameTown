export const calculateStageSize = (width, height) => {
    const maxWidth = Math.min(window.innerWidth, width);
    const maxHeight = Math.min(window.innerHeight, height);
    const widthScale = maxWidth / width;
    const heightScale = maxHeight / height;
    const scale = Math.min(widthScale, heightScale);
    const calculatedWidth = width * scale;
    const calculatedHeight = height * scale;
    return { width: calculatedWidth, height: calculatedHeight, scale: scale };
};
