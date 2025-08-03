import { useAuthStore } from '../stores/authStore';
import Header from '../components/Header';

const MainPage = () => {
  const { session } = useAuthStore();

  return (
    <div>
      <Header signIn={!!session} />

      <div className="flex items-center justify-center mt-[87px] flex-col gap-[16px] px-[20px]">
        <div className="flex gap-[16px]">
          <a
            className="flex-1 hover:cursor-pointer overflow-hidden rounded-[16px]"
            href="/game/bini-puzzle/"
            target="_self"
          >
            <img
              src="/thebinipuzzlegame.png"
              alt="thebinipuzzlegame"
              className="w-full h-auto hover:scale-110 transition-all duration-300"
            />
          </a>
          <a
            className="flex-1 hover:cursor-pointer overflow-hidden rounded-[16px]"
            href="/game/flappy-plane/"
            target="_self"
          >
            <img
              src="/flappyplane.png"
              alt="flappyplane"
              className="w-full h-auto hover:scale-110 transition-all duration-300"
            />
          </a>
        </div>
        <div className="flex gap-[16px]">
          <a
            className="flex-1 hover:cursor-pointer overflow-hidden rounded-[16px]"
            href="/game/typo-trap/"
            target="_self"
          >
            <img
              src="/typotrap.png"
              alt="typotrap"
              className="w-full h-auto hover:scale-110 transition-all duration-300"
            />
          </a>
          <div className="flex-1 overflow-hidden rounded-[16px] border-[#4A5256] border-[1px]">
            <img src="/commingsoon.png" alt="commingsoon" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
