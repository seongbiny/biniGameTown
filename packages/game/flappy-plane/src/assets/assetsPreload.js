import { Assets } from "pixi.js";
let passAnimationData = null;
export const getPassAnimationData = () => passAnimationData;
const getBasePath = () => {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/game/flappy-plane")) {
        return "/game/flappy-plane";
    }
    return "";
};
export async function assetsPreload() {
    const basePath = getBasePath();
    Assets.addBundle("images", {
        background: `${basePath}/assets/images/background.png`,
        ground: `${basePath}/assets/images/groundDirt.png`,
        plane: `${basePath}/assets/images/plane.png`,
        rockTop: `${basePath}/assets/images/rockTop.png`,
        rockBottom: `${basePath}/assets/images/rockBottom.png`,
        groundTop: `${basePath}/assets/images/groundTop.png`,
        groundBottom: `${basePath}/assets/images/groundBottom.png`,
    });
    try {
        await Assets.loadBundle("images");
        try {
            const response = await fetch(`${basePath}/assets/lottie/pass.json`);
            if (response.ok) {
                passAnimationData = await response.json();
            }
        }
        catch (error) {
            //
        }
    }
    catch (error) {
        console.error("필수 에셋 로드 실패:", error);
        throw error; // 필수 에셋(이미지)이 로드되지 않으면 게임을 시작할 수 없음
    }
}
