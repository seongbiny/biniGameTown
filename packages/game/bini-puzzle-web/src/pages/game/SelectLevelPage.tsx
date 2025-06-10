import { Link } from "react-router-dom";

export default function SelectLevelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-600">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-8">1. PLEASE SELECT YOUR LEVEL</h1>
        <div className="space-y-4">
          <div className="text-2xl">NORMAL</div>
          <Link
            to="/game/artist"
            className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Go to Next
          </Link>
        </div>
      </div>
    </div>
  );
}
