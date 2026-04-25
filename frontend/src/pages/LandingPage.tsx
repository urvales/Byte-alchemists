import { useState } from 'react';
import { Search, Calendar, Users, ChevronDown, ArrowRight, Star, Zap, Globe, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EXPERIENCE_TYPES = ['Adventure', 'Cultural', 'Relaxation', 'Food & Cuisine', 'Business', 'Family'];

const FEATURES = [
  { icon: <Star className="h-5 w-5" />, title: 'Smart Discovery', description: 'Find hidden local gems, authentic dining, and off-the-beaten-path experiences powered by AI.', bg: '#E1F5EE', color: '#1D9E75' },
  { icon: <Shield className="h-5 w-5" />, title: 'Safety First', description: 'Real-time safety scores, emergency SOS, nearby clinics, and transparent medical pricing.', bg: '#FAECE7', color: '#D85A30' },
  { icon: <Globe className="h-5 w-5" />, title: 'AI Translation', description: 'Instantly translate menus, signs, and phrases in 48+ languages with cultural context.', bg: '#E6F1FB', color: '#185FA5' },
  { icon: <Zap className="h-5 w-5" />, title: 'Essential Services', description: 'Charging stations, ATMs, WiFi spots, and live transit — all in one place.', bg: '#FAEEDA', color: '#BA7517' },
];

const STATS = [
  { value: '2.4k+', label: 'Services Listed' },
  { value: '180+', label: 'Cities Covered' },
  { value: '48', label: 'Languages' },
  { value: '50k+', label: 'Happy Travelers' },
];

export default function LandingPage() {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('1');
  const [experience, setExperience] = useState('');
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 pb-20 pt-16"
        style={{ background: 'linear-gradient(135deg, #063d31 0%, #0f7a59 50%, #1D9E75 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-10" style={{ background: '#fff' }} />
        <div className="pointer-events-none absolute -left-10 bottom-10 h-48 w-48 rounded-full opacity-5" style={{ background: '#fff' }} />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 rounded-full opacity-5" style={{ background: '#a7f3d0' }} />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-300" />
              AI-powered smart travel platform
            </div>

            <h1
              className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Explore the world<br />
              <span style={{ color: '#a7f3d0' }}>with confidence</span>
            </h1>
            <p className="mx-auto mb-0 max-w-2xl text-base text-white/70 sm:text-lg">
              Your all-in-one travel companion for local discovery, real-time safety,
              menu translation, and essential services — wherever you are.
            </p>
          </div>

          {/* Search card */}
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
              <span className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Classic Search
              </span>
              <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: '#E1F5EE', color: '#085041' }}>
                AI-powered
              </span>
            </div>

            <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
              {/* Destination */}
              <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3.5 focus-within:bg-green-50/40 sm:border-b-0 sm:border-r lg:col-span-1">
                <Search className="h-4 w-4 flex-shrink-0 text-[#1D9E75]" />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Where</div>
                  <input
                    type="text"
                    placeholder="Destination city or country"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3.5 focus-within:bg-green-50/40 sm:border-b-0 sm:border-r lg:col-span-1">
                <Calendar className="h-4 w-4 flex-shrink-0 text-[#1D9E75]" />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">When</div>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3.5 focus-within:bg-green-50/40 sm:border-b-0 sm:border-r lg:col-span-1">
                <Users className="h-4 w-4 flex-shrink-0 text-[#1D9E75]" />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Travelers</div>
                  <select
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                    className="w-full cursor-pointer bg-transparent text-sm font-medium text-gray-800 outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={String(n)}>{n} {n === 1 ? 'traveler' : 'travelers'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3.5 focus-within:bg-green-50/40 sm:border-b-0 lg:col-span-1">
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Experience</div>
                  <div className="relative">
                    <select
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                      className="w-full cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-gray-800 outline-none"
                    >
                      <option value="">Any experience</option>
                      {EXPERIENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-5 py-4">
              <button
                onClick={handleSearch}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition hover:opacity-90 sm:w-auto sm:px-10"
                style={{ background: '#085041' }}
              >
                <Search className="h-4 w-4" />
                {isSignedIn ? 'Open Dashboard' : 'Create Itinerary'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="border-r border-gray-100 py-7 text-center last:border-r-0">
              <div className="text-2xl font-extrabold" style={{ fontFamily: "'Outfit', sans-serif", color: '#1D9E75' }}>{value}</div>
              <div className="mt-0.5 text-xs font-medium text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Everything a traveler needs
            </h2>
            <p className="mt-3 text-gray-500">One platform. Zero friction. Infinite exploration.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon, title, description, bg, color }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: bg, color }}
                >
                  {icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20" style={{ background: 'linear-gradient(135deg, #063d31 0%, #085041 100%)' }}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Ready to explore smarter?
          </h2>
          <p className="mb-8 text-white/70">
            Join thousands of travelers who use Roamwise to navigate the world with confidence.
          </p>
          <Link
            to={isSignedIn ? '/dashboard' : '/login'}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold transition hover:bg-gray-50"
            style={{ color: '#085041' }}
          >
            {isSignedIn ? 'Open Dashboard' : 'Start for Free'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
