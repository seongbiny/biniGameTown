import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";

export default function MainPage() {
  return (
    <PageContainer>
      <div className="w-full h-full bg-purple-600 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-8">THE BINI PUZZLE GAME</h1>
        <Link
          to="/game/level"
          className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          Get in Start
        </Link>
      </div>
    </PageContainer>
  );
}
