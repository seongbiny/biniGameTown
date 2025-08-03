import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './SplashPage.css';

const SplashPage = () => {
  const navigate = useNavigate();
  const { session } = useAuthStore();

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (session) {
        navigate('/main', { replace: true });
      } else {
        navigate('/sign-in', { replace: true });
      }
    }, 3000);

    return () => clearTimeout(timerId);
  }, [session, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <img src="/logo.png" alt="BINIVERSE Logo" className="splash-logo w-40 h-40" />
    </div>
  );
};

export default SplashPage;
