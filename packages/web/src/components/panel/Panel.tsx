import { gamesById, type GameId } from "@/config/games";
import { useNavigate } from "react-router-dom";

interface PanelProps {
  selectedGame: GameId | null;
  isOpen: boolean;
}

const Panel = ({ selectedGame, isOpen }: PanelProps) => {
  const navigate = useNavigate();
  const game = selectedGame ? gamesById[selectedGame] : null;

  const handleGameClick = (gameName: GameId) => {
    navigate(`/game/${gameName}`);
  };

  return (
    <div
      data-testid="game-panel"
      className={`
      w-[627px] p-[16px] rounded-[32px] border border-[#4A5256] bg-[#1B1B1B]
      transform transition-transform duration-300 ease-out
      ${isOpen ? "translate-x-0" : "translate-x-full"}
    `}
      onClick={(e) => e.stopPropagation()}
    >
      {game && (
        <div className="flex h-full flex-col justify-between">
          <div>
            <img
              src={game.panelImage}
              alt={game.title}
              className="w-full h-[225px] mb-[24px] rounded-[24px]"
            />

            <div className="flex flex-col gap-[40px]">
              <div className="flex items-center gap-[8px]">
                <h2 className="text-[30px] text-white font-bold">
                  {game.title}
                </h2>
                <img
                  src={game.icon}
                  alt={`${game.title} icon`}
                  className="w-[48px] h-[48px]"
                />
              </div>

              <div className="flex flex-col gap-[16px]">
                <h3 className="text-[28px] text-[#ffffff] font-semibold">
                  About
                </h3>
                <p className="text-[14px] text-[#B3B3B3]">{game.description}</p>
              </div>
            </div>
          </div>

          <button
            className="w-full h-[100px] bg-[#99FF00] rounded-[24px] text-[#191C1E] text-[30px] font-semibold"
            onClick={() => handleGameClick(game.id)}
          >
            Start to Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Panel;
