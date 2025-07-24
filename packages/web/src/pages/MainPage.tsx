import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabaseClient';

const MainPage = () => {
  const { session } = useAuthStore();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold mb-8">비니 게임 타운</h1>

      {session && (
        <div className="mb-8">
          <p>환영합니다, {session.user.email}!</p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
      )}

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
};

export default MainPage;
