import Header from '../components/Header';
import { supabase } from '../lib/supabaseClient';
import { useState } from 'react';

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Google 로그인 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex items-center justify-center flex-1">
        <div className="flex flex-col items-center text-center">
          <div className="gap-[8px]">
            <p className="text-[32px] text-white">Sign-in</p>
            <p className="text-[15px] text-[#AEB7BC]">Sign in easily with your google account</p>
          </div>
          <div className="mt-[40px]">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex items-center justify-center gap-[10px] rounded-[40px] px-[12px] py-[10px] border-[#AEB7BC] border-[1px] bg-[#222729] hover:cursor-pointer"
            >
              <img src="/Google.svg" alt="Google" className="w-[18px] h-[18px]" />
              <span className="text-[14px] text-[#E7EDF0]">
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
              </span>
            </button>
          </div>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};
export default SignInPage;
