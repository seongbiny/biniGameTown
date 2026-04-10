import { useAuthStore } from "../stores/authStore";
import Header from "../components/header/Header";

import { useEffect, useState } from "react";
import Panel from "@/components/panel/Panel";
import { gamesById } from "@/config/games";
import type { GameId } from "@/config/games";

import { motion, LayoutGroup } from "framer-motion";
import { supabase } from "@bini-game-town/shared";

const MainPage = () => {
  const { session } = useAuthStore();

  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 크기 전환: flex-basis + transition
  const imageSizeClass = isOpen
    ? "basis-[189px] h-[189px]"
    : "basis-[441px] h-[441px]";
  const imageFadeClass = (gameId: GameId) =>
    selectedGame && selectedGame !== gameId ? "opacity-50" : "opacity-100";

  const handleGameSelect = (gameName: GameId) => {
    setSelectedGame(gameName);
    requestAnimationFrame(() => setIsOpen(true)); // 다음 프레임에 열기
  };

  const handleClose = () => {
    if (!selectedGame) return;
    setIsOpen(false); // 닫기 애니메이션 시작
    setTimeout(() => setSelectedGame(null), 300); // 전환 후 언마운트
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log("User ID:", data.user?.id);
    };
    fetchUser();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header isSignedIn={!!session} />

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1" onClick={handleClose}>
          <div className="px-[40px] pt-[56px]">
            <h1 className="text-[30px] text-[#F1F4F6] font-medium px-[8px] mb-[48px]">
              Games
            </h1>

            <LayoutGroup>
              <div className="flex flex-wrap gap-[24px]">
                {Object.values(gamesById).map((game) => (
                  <motion.img
                    key={game.id}
                    layout
                    src={game.logo}
                    alt={game.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameSelect(game.id);
                    }}
                    className={`
                      cursor-pointer transition-opacity hover:opacity-100
                      ${imageSizeClass}
                      ${imageFadeClass(game.id)}
                    `}
                  />
                ))}
              </div>
            </LayoutGroup>
          </div>
        </div>

        {selectedGame && <Panel selectedGame={selectedGame} isOpen={isOpen} />}
      </div>
    </div>
  );
};

export default MainPage;
