import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Biniverse
        </Link>
        <nav className="flex gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'text-sm font-medium text-blue-600' : 'text-sm text-gray-600 hover:text-gray-900'
            }
          >
            홈
          </NavLink>
          <NavLink
            to="/games"
            className={({ isActive }) =>
              isActive ? 'text-sm font-medium text-blue-600' : 'text-sm text-gray-600 hover:text-gray-900'
            }
          >
            게임
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
