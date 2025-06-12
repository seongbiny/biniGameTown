import { useEffect, useRef } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { Link } from "react-router-dom";

const artists = [
  { name: "NJZ", src: "/images/njz.png", size: 200 },
  { name: "MEOVV", src: "/images/meovv.jpg", size: 160 },
  { name: "AESPA", src: "/images/aespa.jpg", size: 180 },
  { name: "BLACKPINK", src: "/images/blackpink.jpeg", size: 160 },
];

export default function SelectArtistPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, []);

  return (
    <PageContainer>
      <div
        ref={scrollContainerRef}
        className="relative h-full flex flex-col overflow-y-auto"
        style={{
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE and Edge */,
        }}
      >
        <img
          src="/images/blueCloud.png"
          alt="Blue Cloud"
          className="absolute bottom-0 left-0 w-full z-0"
        />

        {/* 제목 */}
        <div className="flex justify-center text-center text-[32px]/[110%] mt-[48px] tracking-[12%] z-10">
          2.PLEASE
          <br />
          SELECT THE
          <br />
          ARTIST
        </div>

        {/* 아티스트 목록 */}
        <div className="flex-1 mt-[50px] z-10 px-10 pb-[50px]">
          <div className="flex flex-col">
            {artists.map((artist, index) => (
              <div
                key={artist.name}
                className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <Link
                  to="/game/member"
                  state={{ artist: artist }}
                  className="rounded-full border-2 border-black overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                  style={{
                    width: `${artist.size}px`,
                    height: `${artist.size}px`,
                  }}
                >
                  {/* 줌되는 이미지 */}
                  <img
                    src={artist.src}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
