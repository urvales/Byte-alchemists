import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authLogin, authRegister } from '../services/travelApi';
import { useOnboarding } from '../hooks/useOnboarding';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { isComplete } = useOnboarding();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = mode === 'login'
        ? await authLogin(email, password)
        : await authRegister(email, password, firstName || undefined, lastName || undefined);
      login(res.data.token, res.data.user);
      navigate(isComplete() ? '/dashboard' : '/onboarding', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: '#1D9E75' }}>
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold" style={{ fontFamily: "'Outfit', sans-serif", color: '#085041' }}>Roamwise</h1>
              <p className="text-sm text-gray-400">Smart Travel Platform</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex rounded-xl border border-gray-100 bg-gray-50 p-1">
            {(['login', 'register'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 rounded-lg py-2 text-sm font-semibold transition-all"
                style={mode === m
                  ? { background: '#fff', color: '#085041', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                  : { color: '#9ca3af' }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Minimum 6 characters' : '••••••••'}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm text-gray-800 outline-none transition focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              style={{ background: '#1D9E75' }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-400">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="font-semibold hover:underline"
              style={{ color: '#1D9E75' }}
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          <Link to="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
