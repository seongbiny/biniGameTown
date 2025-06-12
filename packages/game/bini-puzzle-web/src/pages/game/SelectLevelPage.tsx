import { useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";

// 난이도 설정 타입
interface Difficulty {
  text: string;
  color: string;
  gridSize: number;
  image: string;
}

export default function SelectLevelPage() {
  // 난이도 설정 배열
  const difficulties: Difficulty[] = [
    {
      text: "EASY",
      color: "#10B981", // 초록색 (Tailwind green-500)
      gridSize: 3,
      image: "/images/easy.png",
    },
    {
      text: "NORMAL",
      color: "#F59E0B", // 노란색 (Tailwind yellow-500)
      gridSize: 4,
      image: "/images/normal.png",
    },
    {
      text: "HARD",
      color: "#EF4444", // 빨간색 (Tailwind red-500)
      gridSize: 5,
      image: "/images/hard.png",
    },
  ];

  // 현재 선택된 난이도 인덱스 (기본값: EASY)
  const [currentDifficultyIndex, setCurrentDifficultyIndex] = useState(0);

  // 현재 난이도 정보
  const currentDifficulty = difficulties[currentDifficultyIndex];

  // 난이도 변경 함수
  const changeDifficulty = (direction: number) => {
    const newIndex = Math.max(
      0,
      Math.min(2, currentDifficultyIndex + direction)
    );
    setCurrentDifficultyIndex(newIndex);
  };

  return (
    <PageContainer>
      <div className="relative h-full flex flex-col">
        {/* 배경 이미지 */}
        <img
          src="/images/cloud.png"
          alt="Bubble Background"
          className="absolute bottom-0 left-0 w-full"
        />

        {/* 제목 */}
        <div className="flex justify-center text-center text-[32px]/[110%] mt-[48px] tracking-[12%] z-10">
          1.PLEASE
          <br />
          SELECT YOUR
          <br />
          LEVEL
        </div>

        {/* 난이도 이미지 - 상단 여백과 함께 */}
        <div className="flex-1 flex justify-center items-center z-10">
          <img
            src={currentDifficulty.image}
            alt={`${currentDifficulty.text} Level`}
            className="object-contain"
          />
        </div>

        {/* 난이도 선택 영역 - 버튼 위 100px에 고정 */}
        <div className="flex items-center justify-center mb-[100px] z-10">
          <button
            onClick={() => changeDifficulty(-1)}
            disabled={currentDifficultyIndex === 0}
            className="disabled:opacity-50 transition-opacity"
          >
            <img
              src="/images/left_arrow.png"
              alt="previous difficulty"
              className="w-[40px] h-[40px]"
            />
          </button>

          <div
            className="text-[52px] font-bold text-center min-w-[200px] mx-[20px]"
            style={{ color: currentDifficulty.color }}
          >
            {currentDifficulty.text}
          </div>

          <button
            onClick={() => changeDifficulty(1)}
            disabled={currentDifficultyIndex === difficulties.length - 1}
            className="disabled:opacity-50 transition-opacity"
          >
            <img
              src="/images/right_arrow.png"
              alt="Next Difficulty"
              className="w-[40px] h-[40px]"
            />
          </button>
        </div>

        {/* Go to Next 버튼 */}
        <div className="flex justify-center pb-[50px] z-10">
          <div className="border-2 rounded-[12px] bg-[#ff7eb9]">
            <Link
              to="/game/artist"
              state={{ gridSize: currentDifficulty.gridSize }}
              className="w-[185px] h-[60px] flex items-center justify-center text-[28px]"
            >
              Go to Next
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
