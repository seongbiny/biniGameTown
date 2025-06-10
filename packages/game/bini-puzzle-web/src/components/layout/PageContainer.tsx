import React from "react";
import { useStageSize } from "../../hooks/useStageSize";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  const stageSize = useStageSize(450, 800);

  return (
    <div
      className={`bg-white shadow-lg overflow-hidden ${className}`}
      style={{
        width: `${stageSize.width}px`,
        height: `${stageSize.height}px`,
        transform: `scale(${stageSize.scale})`,
        transformOrigin: "center center",
        backgroundColor: "#61B1EC",
      }}
    >
      {children}
    </div>
  );
}
