import { useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";

const members = [
  { name: "minji", src: "/images/minji.jpg" },
  { name: "hyein", src: "/images/hyein.jpg" },
  { name: "haerin", src: "/images/haerin.jpg" },
  { name: "daniel", src: "/images/daniel.jpg" },
  { name: "hani", src: "/images/hani.jpg" },
];

export default function SelectMemberPage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const handleMemberClick = (memberName: string) => {
    setSelectedMember(memberName);
  };

  return (
    <PageContainer>
      <div className="relative h-full flex flex-col">
        <div className="flex justify-center text-center text-[32px]/[110%] mt-[48px] tracking-[12%] z-10">
          3.PLEASE
          <br />
          SELECT THE
          <br />
          MEMBER
        </div>

        <div className="flex-1 flex justify-center items-center px-[20px] mt-[30px]">
          <div className="flex flex-wrap justify-center gap-[15px]">
            {members.map((member, index) => (
              <div key={member.name}>
                <img
                  src={member.src}
                  alt={member.name}
                  onClick={() => handleMemberClick(member.name)}
                  className={`w-[180px] h-[180px] rounded-[16px] border-2 object-cover cursor-pointer transition-all duration-300 ${
                    selectedMember === member.name
                      ? "border-[#ff7eb9] border-4 scale-105"
                      : "border-white hover:border-gray-300"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Game Start 버튼 - 멤버 선택 시에만 표시 */}
        {selectedMember && (
          <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 z-20">
            <div className="border-2 rounded-[12px] bg-[#ff7eb9]">
              <Link
                to="/game/start"
                state={{ selectedMember }}
                className="w-[185px] h-[60px] flex items-center justify-center text-[28px]"
              >
                Game Start!
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
