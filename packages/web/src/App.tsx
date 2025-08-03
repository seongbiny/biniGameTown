import { useEffect } from 'react';
import './App.css';
import { useAuthStore } from './stores/authStore';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import ProtectedRoute from './pages/ProtectedRoute';
import MainPage from './pages/MainPage';
import AuthCallback from './pages/AuthCallback';
import { supabase } from './lib/supabaseClient';
import RankingPage from './pages/RankingPage';
import SplashPage from './pages/SplashPage';

function App() {
  const { session, setSession } = useAuthStore();

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('세션 가져오기 오류:', error);
          return;
        }

        setSession(session);
      } catch (err) {
        console.error('세션 초기화 오류:', err);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setSession(session);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [setSession]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="App w-[393px] h-screen max-h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<SplashPage />} />

          <Route
            path="/sign-in"
            element={session ? <Navigate to="/main" replace /> : <SignInPage />}
          />

          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />

          <Route path="/ranking" element={<RankingPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
