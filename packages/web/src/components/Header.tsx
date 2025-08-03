import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface Props {
  signIn?: boolean;
}

const Header = ({ signIn = false }: Props) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('로그아웃 오류:', error);
    }

    navigate('/signin');
  };

  return (
    <div className="flex justify-between items-center px-[20px] py-[24px]">
      <img src="/logo2.png" style={{ width: '105px', height: '24px' }} />

      {signIn && (
        <button
          className="group flex items-center gap-[8px] cursor-pointer"
          onClick={handleSignOut}
        >
          <div className="text-[14px] text-[#AEB7BC] group-hover:text-white">Sign out</div>
          <img
            src="/signout.svg"
            className="block h-6 w-6 group-hover:hidden"
            alt="Sign out icon"
          />
          <img
            src="/signout-white.svg"
            className="hidden h-6 w-6 group-hover:block"
            alt="Sign out icon hovered"
          />
        </button>
      )}
    </div>
  );
};

export default Header;
