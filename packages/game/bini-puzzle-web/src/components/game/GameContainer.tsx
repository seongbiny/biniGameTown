import React from "react";
import { useStageSize } from "../../hooks/useStageSize";

interface GameContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function GameContainer({
  children,
  className = "",
}: GameContainerProps) {
  const stageSize = useStageSize(450, 800);

  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-gray-100 ${className}`}
    >
      <div
        className="relative bg-white shadow-lg"
        style={{
          width: `${stageSize.width}px`,
          height: `${stageSize.height}px`,
          transform: `scale(${stageSize.scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
