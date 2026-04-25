import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { getMe } from '../services/travelApi';

interface Props {
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({ requireOnboarding = true }: Readonly<Props>) {
  const { isLoaded, isSignedIn, token } = useAuth();
  const { isComplete, complete } = useOnboarding();
  const [checking, setChecking] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !token) {
      setChecking(false);
      return;
    }

    if (isComplete()) {
      setOnboardingDone(true);
      setChecking(false);
      return;
    }

    getMe(token).then(res => {
      if (res.data.onboardingComplete) {
        complete(res.data.preferences);
        setOnboardingDone(true);
      }
    }).catch(() => {}).finally(() => setChecking(false));
  }, [isLoaded, isSignedIn, token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoaded || checking) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4" style={{ borderColor: '#1D9E75', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/login" replace />;

  if (!requireOnboarding && onboardingDone) return <Navigate to="/dashboard" replace />;
  if (requireOnboarding && !onboardingDone) return <Navigate to="/onboarding" replace />;

  return <Outlet />;
}
