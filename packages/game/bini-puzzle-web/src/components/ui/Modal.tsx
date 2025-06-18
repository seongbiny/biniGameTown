import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  content,
  buttonText = "확인",
  onButtonClick,
}: ModalProps) {
  // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose(); // 기본적으로는 모달 닫기
    }
  };

  return (
    <>
      {/* 모달 오버레이 (전체 화면을 덮는 어두운 배경) */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose} // 배경 클릭 시 모달 닫기
      >
        {/* Dim 처리된 배경 */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* 모달 내용 박스 */}
        <div
          className="relative bg-white rounded-[20px] p-8 mx-5 max-w-sm w-full shadow-2xl border-2 border-white"
          onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 닫히지 않도록
        >
          {/* 모달 제목 */}
          <h2 className="text-[24px] font-bold text-black mb-4 pr-8">
            {title}
          </h2>

          {/* 모달 내용 */}
          <div className="text-black text-base mb-6">
            {typeof content === "string" ? <p>{content}</p> : content}
          </div>

          {/* 버튼 */}
          <button
            onClick={handleButtonClick}
            className="w-full bg-[#FF7EB9] text-black py-3 rounded-xl text-[20px] font-bold border-2 border-black hover:bg-[#E665A3] transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </>
  );
}
