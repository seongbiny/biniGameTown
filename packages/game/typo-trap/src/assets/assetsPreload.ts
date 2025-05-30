import { Assets } from "pixi.js";

let animationData: any = null;

export const getAnimationData = () => animationData;

const getBasePath = () => {
  const pathname = window.location.pathname;

  if (pathname.startsWith("/game/typo-trap")) {
    return "/game/typo-trap";
  }

  return "";
};

export async function assetsPreload() {
  const basePath = getBasePath();

  Assets.addBundle("images", {
    king: `${basePath}/images/king.png`,
  });

  try {
    await Assets.loadBundle("images");

    try {
      const response = await fetch(`${basePath}/lottie/success.json`);
      if (response.ok) {
        animationData = await response.json();
      }
    } catch (error) {
      //
    }
    console.log("✅ Typo-trap assets loaded successfully!");
  } catch (error) {
    console.error("❌ Typo-trap assets loading failed:", error);
    throw error;
  }
}
