import { Assets } from "pixi.js";

const getBasePath = () => {
  const pathname = window.location.pathname;

  if (pathname.startsWith("/game/typo-trap")) {
    return "/game/typo-trap";
  }

  return "";
};

export async function assetsPreload() {
  const basePath = getBasePath();

  // typo-trap은 /images/ 경로 사용 (flappy-plane과 다름)
  Assets.addBundle("images", {
    king: `${basePath}/images/king.png`,
  });

  try {
    await Assets.loadBundle("images");
    console.log("✅ Typo-trap assets loaded successfully!");
  } catch (error) {
    console.error("❌ Typo-trap assets loading failed:", error);
    throw error;
  }
}
