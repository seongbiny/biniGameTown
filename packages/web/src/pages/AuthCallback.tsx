import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('세션 가져오기 오류:', error);
          navigate('/sign-in');
          return;
        }

        if (session) {
          setSession(session);
          navigate('/main');
        } else {
          navigate('/sign-in');
        }
      } catch (err) {
        console.error('인증 콜백 처리 오류:', err);
        navigate('/sign-in');
      }
    };

    handleAuthCallback();
  }, [navigate, setSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
