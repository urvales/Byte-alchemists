import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { saveOnboarding } from '../services/travelApi';

const PREFERENCES = [
  { id: 'transport', icon: '🚌', title: 'Easy Transport', description: 'Shuttle services, taxi access, near attractions or comfortable transport options.' },
  { id: 'room', icon: '🛏️', title: 'Room Comfort', description: 'Walk-in showers, pillow choices or accessible power outlets.' },
  { id: 'conveniences', icon: '🏪', title: 'Onsite Conveniences', description: 'Stores, medical services, or an ATM close by.' },
  { id: 'dining', icon: '🍽️', title: 'Dining Flexibility', description: 'Meal options for specific diet needs or cafes and restaurants nearby.' },
  { id: 'safety', icon: '🛡️', title: 'Safety & Support', description: 'Good lighting, a doctor on call, anti-slip flooring or walk-in shower.' },
  { id: 'assistance', icon: '🤝', title: 'Human Assistance', description: 'Friendly staff for luggage help, valet parking, or on-site assistance.' },
  { id: 'wellness', icon: '🧘', title: 'Wellness & Leisure', description: 'Access to spas, yoga sessions, or fitness facilities.' },
  { id: 'access', icon: '♿', title: 'Effortless Access', description: 'Fewer stairs, elevators, ramps, or buggy services for easy movement.' },
  { id: 'quiet', icon: '🔇', title: 'Quiet & Relaxing', description: 'Quiet areas, soundproof rooms, or adult-only spaces.' },
];

const MIN = 5;

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const { complete } = useOnboarding();
  const { token } = useAuth();
  const navigate = useNavigate();

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleContinue = async () => {
    const prefs = Array.from(selected);
    setSaving(true);
    try {
      if (token) await saveOnboarding(token, prefs);
    } catch {
      // proceed even if API fails — localStorage keeps the state
    } finally {
      complete(prefs);
      navigate('/dashboard');
    }
  };

  const canContinue = selected.size >= MIN;
  const remaining = Math.max(0, MIN - selected.size);
  const progressPct = Math.min(100, (selected.size / MIN) * 100);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">✈️</div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
            What matters most to you?
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Select at least{' '}
            <span className="font-semibold" style={{ color: '#1D9E75' }}>{MIN} preferences</span>
            {' '}to personalize your Roamwise experience.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%`, background: '#1D9E75' }} />
          </div>
          <span className="w-28 text-right text-xs font-medium text-gray-500">
            {selected.size} / {PREFERENCES.length} selected
          </span>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PREFERENCES.map(({ id, icon, title, description }) => {
            const on = selected.has(id);
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className="relative rounded-2xl border p-4 text-left transition-all duration-150 hover:shadow-md"
                style={{
                  borderColor: on ? '#1D9E75' : '#e5e7eb',
                  background: on ? '#E1F5EE' : '#fff',
                  outline: on ? '2px solid #1D9E75' : 'none',
                  outlineOffset: '-2px',
                }}
              >
                {on && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full" style={{ background: '#1D9E75' }}>
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="mb-2 text-2xl">{icon}</div>
                <div className="font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</div>
                <div className="mt-1 text-xs leading-relaxed text-gray-500">{description}</div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          {!canContinue && (
            <p className="text-sm text-gray-400">
              Select {remaining} more preference{remaining !== 1 ? 's' : ''} to continue
            </p>
          )}
          <button
            onClick={handleContinue}
            disabled={!canContinue || saving}
            className="w-full max-w-sm rounded-xl py-3.5 text-sm font-semibold text-white transition sm:w-auto sm:px-16"
            style={{ background: canContinue && !saving ? '#1D9E75' : '#d1d5db', cursor: canContinue && !saving ? 'pointer' : 'not-allowed' }}
          >
            {saving ? 'Saving…' : 'Start Exploring →'}
          </button>
        </div>
      </div>
    </div>
  );
}
