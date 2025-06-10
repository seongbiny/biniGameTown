import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-600">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-8">THE BINI PUZZLE GAME</h1>
        <Link
          to="/game/level"
          className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          Get in Start
        </Link>
      </div>
    </div>
  );
}
