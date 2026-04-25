import { MapPin, LogOut, LayoutDashboard, Compass } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isSignedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean).map(s => s![0]).join('').toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: '#1D9E75' }}>
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: '#085041' }}>
              Roamwise
            </span>
          </Link>
          <Link
            to="/experiences"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-[#1D9E75]"
          >
            <Compass className="h-4 w-4" />
            Experiences
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {!isSignedIn ? (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#1D9E75] hover:text-[#1D9E75]"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: '#1D9E75' }}
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-[#1D9E75]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: '#085041' }}
                title={user?.email}
              >
                {initials}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition hover:border-red-200 hover:text-red-500"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
