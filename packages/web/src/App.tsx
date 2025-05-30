import "./App.css";

function App() {
  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold mb-8">비니 게임 타운</h1>
      <div className="flex justify-center gap-4">
        <a
          href="/game/bini-puzzle/"
          target="_self"
          className="w-36 h-24 bg-blue-100 border-2 border-blue-500 rounded-lg flex items-center justify-center text-lg font-semibold hover:bg-blue-200 transition"
        >
          bini-puzzle
        </a>
        <a
          href="/game/flappy-plane/"
          target="_self"
          className="w-36 h-24 bg-blue-100 border-2 border-blue-500 rounded-lg flex items-center justify-center text-lg font-semibold hover:bg-blue-200 transition"
        >
          flappy-plane
        </a>
        <a
          href="/game/typo-trap/"
          target="_self"
          className="w-36 h-24 bg-blue-100 border-2 border-blue-500 rounded-lg flex items-center justify-center text-lg font-semibold hover:bg-blue-200 transition"
        >
          typo-trap
        </a>
      </div>
    </div>
  );
}

export default App;
