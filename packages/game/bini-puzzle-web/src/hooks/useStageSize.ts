import { useState, useEffect } from "react";
import { calculateStageSize } from "../utils/calculateStageSize";

export const useStageSize = (
  baseWidth: number = 450,
  baseHeight: number = 800
) => {
  const [stageSize, setStageSize] = useState(() =>
    calculateStageSize(baseWidth, baseHeight)
  );

  useEffect(() => {
    const handleResize = () => {
      setStageSize(calculateStageSize(baseWidth, baseHeight));
    };

    window.addEventListener("resize", handleResize);

    // 초기 계산
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [baseWidth, baseHeight]);

  return stageSize;
};
