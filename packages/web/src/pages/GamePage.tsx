import { gamesById } from "@/config/games";
import type { GameId } from "@/config/games";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

type GameResultMessage = {
  type: "BGT_GAME_RESULT";
  payload: {
    gameName: GameId;
    score: number;
    difficulty?: string | null;
  };
};

// gamesById를 단일 소스로 사용해 유효한 게임명 검증
const VALID_GAME_IDS = new Set(Object.keys(gamesById));

const isGameResultMessage = (data: unknown): data is GameResultMessage => {
  if (!data || typeof data !== "object") return false;

  const maybe = data as Record<string, unknown>;
  if (maybe.type !== "BGT_GAME_RESULT") return false;

  const payload = maybe.payload;
  if (!payload || typeof payload !== "object") return false;

  const { gameName, score, difficulty } = payload as Record<string, unknown>;

  const isValidGameName =
    typeof gameName === "string" && VALID_GAME_IDS.has(gameName);
  const isValidScore = typeof score === "number" && Number.isFinite(score);
  const isValidDifficulty =
    difficulty === undefined ||
    difficulty === null ||
    typeof difficulty === "string";

  return isValidGameName && isValidScore && isValidDifficulty;
};

const GamePage = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // gamesById에서 URL 자동 생성 — 새 게임 추가 시 config만 수정하면 됨
  const gameUrls = useMemo(() => {
    return Object.fromEntries(
      Object.values(gamesById).map((game) => [
        game.id,
        isDev ? `http://localhost:${game.devPort}` : `/game/${game.id}/`,
      ]),
    ) as Record<GameId, string>;
  }, [isDev]);

  useEffect(() => {
    if (!gameName || !(gameName in gameUrls)) {
      navigate("/main");
    }
  }, [gameName, navigate, gameUrls]);

  useEffect(() => {
    // 허용 origin도 gamesById에서 자동 생성
    const allowedOrigins = isDev
      ? new Set(
          Object.values(gamesById).map((g) => `http://localhost:${g.devPort}`),
        )
      : new Set([window.location.origin]);

    const onMessage = async (event: MessageEvent) => {
      if (!allowedOrigins.has(event.origin)) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (!isGameResultMessage(event.data)) return;

      const {
        gameName: reportedGameName,
        score,
        difficulty,
      } = event.data.payload;

      if (typeof gameName === "string" && gameName !== reportedGameName) return;

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("유저 조회 실패:", userError);
          return;
        }

        if (!user) {
          console.log("로그인 상태가 아니라 점수를 저장하지 않습니다.");
          return;
        }

        const { error: insertError } = await supabase.from("scores").insert({
          user_id: user.id,
          game_name: reportedGameName,
          score,
          difficulty: difficulty ?? null,
        });

        if (insertError) {
          console.error("scores 저장 실패:", insertError);
          return;
        }

        console.log("scores 저장 완료:", {
          reportedGameName,
          score,
          difficulty: difficulty ?? null,
        });
      } catch (e) {
        console.error("message 처리 중 예외:", e);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [gameName, isDev]);

  if (!gameName || !(gameName in gameUrls)) return null;

  return (
    <div className="relative w-full h-screen bg-black">
      <button
        onClick={() => navigate("/main")}
        className="absolute top-4 left-4 z-50 bg-white/80 hover:bg-white px-4 py-2 rounded-lg shadow-lg transition-all"
      >
        ← 뒤로가기
      </button>

      <iframe
        ref={iframeRef}
        src={gameUrls[gameName as GameId]}
        title={gameName}
        className="w-full h-full border-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        onLoad={() => console.log("iframe loaded")}
        onError={(e) => console.error("iframe error:", e)}
      />
    </div>
  );
};

export default GamePage;
