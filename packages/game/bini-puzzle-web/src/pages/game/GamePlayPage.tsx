import { Link } from "react-router-dom";

export default function GamePlayPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-600">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-8">2. PLEASE SELECT THE ARTIST</h1>
        <div className="space-y-4">
          <div className="text-2xl">NJZ (선택 가능)</div>
          <Link
            to="/game/member"
            className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Select Artist
          </Link>
        </div>
      </div>
    </div>
  );
}
