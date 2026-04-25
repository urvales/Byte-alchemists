import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';
import {
  getGems, getAlerts, getTransit, getSafety,
  createSearch,
  type Gem, type Alert, type TransitData, type SafetyData,
} from '../services/travelApi';

type Tab = 'discover' | 'essentials' | 'translate' | 'transit' | 'health';

const TABS: { id: Tab; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'essentials', label: 'Essentials' },
  { id: 'translate', label: 'Translate' },
  { id: 'transit', label: 'Transit' },
  { id: 'health', label: 'Health & Safety' },
];

const TRANSLATIONS: Record<string, string> = {
  'phở': 'Phở (Vietnamese noodle soup) — slow-cooked beef broth with rice noodles, herbs, and your choice of beef cuts. Rich, aromatic, and deeply satisfying. Price: ₹120–200.',
  'tako': 'Takoyaki (たこ焼き) — Japanese ball-shaped snacks made with wheat batter, diced octopus, tempura scraps, and green onion. Topped with mayo and bonito flakes.',
  'ramen': 'Ramen (ラーメン) — Japanese noodle soup with wheat noodles in a savory broth (shoyu, miso, or tonkotsu), toppings like chashu pork, egg, and nori.',
  'pad': "Pad Thai (ผัดไทย) — stir-fried rice noodles with eggs, tofu or shrimp, bean sprouts, peanuts. Thailand's iconic street food. Contains peanuts & shellfish.",
};

// ── Static fallbacks (used if API is unavailable) ─────────────────
const FALLBACK_GEMS: Gem[] = [
  { id: 'g1', icon: '🍜', name: "Mama Lai's Noodles", meta: '4.9 ★ · Cash only · Local fav', distance: '0.3 km', bg: '#E1F5EE', category: 'food' },
  { id: 'g2', icon: '🎭', name: 'Shadow Puppet Market', meta: '4.7 ★ · Evenings only', distance: '0.9 km', bg: '#EEEDFE', category: 'culture' },
  { id: 'g3', icon: '☕', name: 'Rooftop Heritage Café', meta: '4.8 ★ · Great views', distance: '1.2 km', bg: '#FAEEDA', category: 'food' },
];

const FALLBACK_ALERTS: Alert[] = [
  { id: 'a1', dot: '#BA7517', bg: '#FAEEDA', severity: 'warning', text: 'Night market at Temple Sq closes early tonight (9pm) due to rain forecast.', time: '15 min ago' },
  { id: 'a2', dot: '#1D9E75', bg: '#E1F5EE', severity: 'info', text: 'Free cultural tour departs Old Quarter at 6pm — 4 spots left.', time: '1 hr ago' },
  { id: 'a3', dot: '#185FA5', bg: '#E6F1FB', severity: 'info', text: 'Currency: USD/THB rate improved — best rate at Central Bank branch.', time: '2 hr ago' },
];

const FALLBACK_TRANSIT: TransitData = {
  routes: [
    { id: 't1', icon: '🚇', name: 'MRT Blue Line — Hua Lamphong', sub: 'Platform 2 · 3 stops away', time: '4 min', status: 'On time', color: '#1D9E75' },
    { id: 't2', icon: '🚌', name: 'Bus 15B — Old Town Route', sub: 'Stop A3 · AC bus', time: '12 min', status: 'Slight delay', color: '#BA7517' },
    { id: 't3', icon: '🛺', name: 'Tuk-tuk (Verified Operator)', sub: 'Licensed · Fixed rates', time: 'Now', status: 'Available', color: '#1D9E75' },
    { id: 't4', icon: '✈️', name: 'Airport Express — Suvarnabhumi', sub: 'Phaya Thai Stn · 28 min ride', time: 'Every 30m', status: 'Scheduled', color: '#9ca3af' },
  ],
  airportCosts: [
    { label: 'Airport Rail Link', value: '₹130 · 28 min', tier: 'low' },
    { label: 'Metered Taxi', value: '₹350–600 · 40–70 min', tier: 'medium' },
    { label: 'Grab / Bolt', value: '₹280–450 · 45 min', tier: 'medium' },
    { label: 'Private Transfer', value: '₹900+ · Fixed price', tier: 'high' },
  ],
};

const FALLBACK_SAFETY: SafetyData = {
  score: 8.2, scamRisk: 'Medium', nightSafety: 'Good',
  breakdown: [
    { label: 'Overall Safety', value: '8.2/10', pct: 82, color: '#1D9E75' },
    { label: 'Scam Risk', value: 'Medium', pct: 40, color: '#BA7517' },
    { label: 'Night Safety', value: 'Good', pct: 70, color: '#1D9E75' },
  ],
  tips: [
    { icon: '💧', bold: 'Avoid tap water', rest: '— use bottled only' },
    { icon: '🌡️', bold: 'Heat advisory', rest: '— 38°C today, stay hydrated' },
    { icon: '🦟', bold: 'Use insect repellent', rest: '— dengue season active' },
    { icon: '🏥', bold: 'Travel insurance', rest: '— BUPA accepted locally' },
    { icon: '🍽️', bold: 'Street food', rest: '— stick to busy stalls with high turnover' },
  ],
  emergency: { hospital: { name: 'BNH Hospital', distance: '1.1 km' }, police: { distance: '0.8 km' }, embassy: { distance: '3.2 km' } },
  medicalCosts: [
    { label: 'GP Consultation', value: '₹300–600', tier: 'low' },
    { label: 'Blood Test', value: '₹200–500', tier: 'low' },
    { label: 'X-Ray', value: '₹800–1,500', tier: 'medium' },
    { label: 'Emergency Room', value: '₹2k–5k', tier: 'medium' },
    { label: 'Ambulance', value: '₹500–1,200', tier: 'high' },
  ],
};

// ── Component ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [translateInput, setTranslateInput] = useState('');
  const [translateOutput, setTranslateOutput] = useState('');
  const [toast, setToast] = useState('');

  // API-backed state
  const [gems, setGems] = useState<Gem[]>(FALLBACK_GEMS);
  const [alerts, setAlerts] = useState<Alert[]>(FALLBACK_ALERTS);
  const [transit, setTransit] = useState<TransitData>(FALLBACK_TRANSIT);
  const [safety, setSafety] = useState<SafetyData>(FALLBACK_SAFETY);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  useEffect(() => {
    if (!token) return;
    Promise.allSettled([getGems(token), getAlerts(token)]).then(([g, a]) => {
      if (g.status === 'fulfilled') setGems(g.value.data);
      if (a.status === 'fulfilled') setAlerts(a.value.data);
    });
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (activeTab === 'transit') getTransit(token).then(r => setTransit(r.data)).catch(() => {});
    if (activeTab === 'health' || activeTab === 'essentials') getSafety(token).then(r => setSafety(r.data)).catch(() => {});
  }, [activeTab, token]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    showToast(`Searching for "${searchQuery}"…`);
    try {
      if (token) await createSearch(token, { destination: searchQuery });
    } catch { /* log only */ }
  };

  const handleTranslate = (val: string) => {
    setTranslateInput(val);
    const lower = val.toLowerCase();
    const match = Object.keys(TRANSLATIONS).find(k => lower.includes(k));
    if (match && val.length > 2) setTranslateOutput(TRANSLATIONS[match]);
    else if (val.length > 3) setTranslateOutput(`Searching food database for "${val}"… Ask me in chat for full translation.`);
    else setTranslateOutput('');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="relative mb-5 overflow-hidden rounded-2xl p-6 sm:p-8" style={{ background: '#1D9E75' }}>
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <div className="pointer-events-none absolute bottom-[-20px] left-[20%] h-32 w-32 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/60">
                Roamwise · Smart Travel Platform
              </p>
              <h1 className="mb-2 text-3xl font-bold leading-tight text-white sm:text-4xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Where do you want<br />to explore today?
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-white/80">
                Your AI travel companion for services, discovery, translation, and safety.
              </p>
            </div>
            {/* Stats row */}
            <div className="flex gap-3 lg:flex-shrink-0">
              {[['2.4k', 'Services'], ['180+', 'Cities'], ['48', 'Languages']].map(([num, lbl]) => (
                <div key={lbl} className="rounded-xl px-4 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <div className="text-xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{num}</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/70">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Search bar */}
          <div className="relative mt-5 flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm sm:max-w-lg">
            <Search className="h-4 w-4 flex-shrink-0 text-white/70" />
            <input
              type="text"
              placeholder="Search places, services, food nearby..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/55"
            />
            <button
              onClick={handleSearch}
              className="flex-shrink-0 rounded-xl px-4 py-1.5 text-xs font-semibold transition hover:opacity-90"
              style={{ background: '#fff', color: '#085041' }}
            >
              Explore ↗
            </button>
          </div>
        </div>

        {/* ── Tab bar ───────────────────────────────────────────── */}
        <div className="scrollbar-none mb-5 flex gap-2 overflow-x-auto pb-1">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-all"
              style={activeTab === id
                ? { background: '#1D9E75', color: '#fff', borderColor: '#1D9E75' }
                : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab content ───────────────────────────────────────── */}
        {activeTab === 'discover' && <DiscoverTab gems={gems} alerts={alerts} sendPrompt={showToast} />}
        {activeTab === 'essentials' && <EssentialsTab safety={safety} sendPrompt={showToast} />}
        {activeTab === 'translate' && (
          <TranslateTab input={translateInput} output={translateOutput} onInput={handleTranslate} sendPrompt={showToast} />
        )}
        {activeTab === 'transit' && <TransitTab data={transit} />}
        {activeTab === 'health' && <HealthTab safety={safety} sendPrompt={showToast} />}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 max-w-md -translate-x-1/2 rounded-xl px-5 py-3 text-sm text-white shadow-xl" style={{ background: '#085041' }}>
          {toast}
        </div>
      )}
    </div>
  );
}

/* ── DISCOVER ────────────────────────────────────────────────────── */
function DiscoverTab({ gems, alerts, sendPrompt }: { gems: Gem[]; alerts: Alert[]; sendPrompt: (m: string) => void }) {
  const SERVICES = [
    { icon: '⚡', name: 'Charging Spots', count: '12 nearby', bg: '#E1F5EE', prompt: 'Show me all charging stations near me with available ports and prices' },
    { icon: '🏥', name: 'Medical Help', count: '5 clinics', bg: '#FCEBEB', prompt: 'Find trusted medical clinics near me with transparent pricing' },
    { icon: '💱', name: 'ATM & FX', count: '8 options', bg: '#FAEEDA', prompt: 'Show ATMs and currency exchange spots nearby with live rates' },
    { icon: '📶', name: 'Free WiFi', count: '20+ spots', bg: '#E6F1FB', prompt: 'Find co-working spaces and cafes with strong WiFi nearby' },
  ];

  const QUICK = [
    { icon: '🍽️', label: 'Scan Menu', prompt: 'Translate this restaurant menu photo and explain the dishes' },
    { icon: '🆘', label: 'SOS Help', prompt: 'I need emergency help — show SOS options and nearest hospital' },
    { icon: '🗺️', label: 'Day Plan', prompt: 'Plan me a half-day authentic local experience itinerary' },
    { icon: '🤝', label: 'Etiquette', prompt: 'What local etiquette and customs should I know here?' },
    { icon: '🚕', label: 'Safe Ride', prompt: 'Find me a trusted taxi or rideshare with estimated cost' },
    { icon: '🎒', label: 'Pack Check', prompt: "What should I pack for tomorrow's weather and activities?" },
  ];

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Essential Services</p>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SERVICES.map(s => (
          <button key={s.name} onClick={() => sendPrompt(s.prompt)}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-center transition hover:border-[#1D9E75] hover:bg-[#E1F5EE]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: s.bg }}>{s.icon}</div>
            <div className="text-sm font-semibold text-gray-800">{s.name}</div>
            <div className="mt-0.5 text-xs text-gray-400">{s.count}</div>
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Local Hidden Gems
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#E1F5EE', color: '#085041' }}>Off-tourist</span>
          </div>
          {gems.map(g => (
            <div key={g.id} className="flex items-center gap-3 border-b border-gray-50 py-2.5 last:border-0">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl" style={{ background: g.bg }}>{g.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-gray-900">{g.name}</div>
                <div className="text-xs text-gray-400">{g.meta}</div>
              </div>
              <div className="text-xs font-semibold" style={{ color: '#1D9E75' }}>{g.distance}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Live Alerts
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#FAECE7', color: '#D85A30' }}>{alerts.length} new</span>
          </div>
          {alerts.map(a => (
            <div key={a.id} className="mb-2 flex gap-3 rounded-xl p-3 last:mb-0" style={{ background: a.bg }}>
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: a.dot }} />
              <div>
                <div className="text-sm leading-relaxed text-gray-800">{a.text}</div>
                <div className="mt-0.5 text-xs text-gray-500">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Quick Actions</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {QUICK.map(q => (
          <button key={q.label} onClick={() => sendPrompt(q.prompt)}
            className="rounded-xl border border-gray-100 bg-white py-4 text-center transition hover:border-[#1D9E75] hover:bg-[#E1F5EE]">
            <div className="text-2xl">{q.icon}</div>
            <div className="mt-1.5 text-xs font-medium text-gray-700">{q.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── ESSENTIALS ──────────────────────────────────────────────────── */
function EssentialsTab({ safety, sendPrompt }: { safety: SafetyData; sendPrompt: (m: string) => void }) {
  const PINS = [
    { name: 'Central Mall', dist: '0.4 km · 6 free', pct: 80, color: '#1D9E75' },
    { name: 'Main Library', dist: '0.7 km · 3 free', pct: 45, color: '#1D9E75' },
    { name: 'City Café', dist: '1.1 km · 1 free', pct: 15, color: '#BA7517' },
    { name: 'Bus Terminal', dist: '1.4 km · 8 free', pct: 90, color: '#1D9E75' },
  ];

  const costColor = (tier: string) => tier === 'low' ? '#1D9E75' : tier === 'medium' ? '#BA7517' : '#D85A30';

  return (
    <div>
      <button onClick={() => sendPrompt('I need emergency assistance — show nearest hospital, police, and emergency contacts')}
        className="mb-5 flex w-full items-center gap-4 rounded-2xl p-5 text-left transition hover:opacity-90"
        style={{ background: '#D85A30' }}>
        <span className="text-3xl">🚨</span>
        <div className="flex-1">
          <div className="font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Emergency SOS</div>
          <div className="text-sm text-white/80">
            Hospital {safety.emergency.hospital.distance} · Police {safety.emergency.police.distance} · Embassy {safety.emergency.embassy.distance}
          </div>
        </div>
        <span className="text-2xl text-white">›</span>
      </button>

      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Device Charging Stations
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#E1F5EE', color: '#085041' }}>Live</span>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#f9fafb' }}>
          <p className="mb-4 text-center text-xs text-gray-400">📍 Showing charging spots within 1.5 km</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PINS.map(p => (
              <div key={p.name} className="rounded-xl border border-gray-100 bg-white p-3 text-center">
                <div className="mx-auto mb-1 h-3 w-3 rounded-full" style={{ background: p.color }} />
                <div className="text-xs font-semibold text-gray-800">{p.name}</div>
                <div className="text-[11px] text-gray-400">{p.dist}</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Medical Costs
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#E6F1FB', color: '#185FA5' }}>Transparent</span>
          </div>
          {safety.medicalCosts.map(c => (
            <div key={c.label} className="flex justify-between border-b border-gray-50 py-2.5 text-sm last:border-0">
              <span className="text-gray-500">{c.label}</span>
              <span className="font-semibold" style={{ color: costColor(c.tier) }}>{c.value}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Safety Score
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#E1F5EE', color: '#085041' }}>Updated</span>
          </div>
          {safety.breakdown.map(s => (
            <div key={s.label} className="mb-4 last:mb-0">
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-gray-400">{s.label}</span>
                <span className="font-semibold" style={{ color: s.color }}>{s.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
          <button onClick={() => sendPrompt('Give me detailed safety tips and scam warnings for this area')}
            className="mt-4 w-full rounded-xl border border-gray-100 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            Full Safety Report ↗
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── TRANSLATE ───────────────────────────────────────────────────── */
function TranslateTab({ input, output, onInput, sendPrompt }: { input: string; output: string; onInput: (v: string) => void; sendPrompt: (m: string) => void }) {
  const MENU = [
    { thai: 'ต้มข่าไก่', english: 'Tom Kha Gai', price: '≈ ₹180', prompt: 'Explain Tom Kha Gai in detail — is it vegetarian-friendly?' },
    { thai: 'ผัดไทย', english: 'Pad Thai', price: '≈ ₹150', prompt: 'What is Pad Thai and does it have common allergens?' },
    { thai: 'ส้มตำ', english: 'Som Tam', price: '≈ ₹120', prompt: 'Describe Som Tam and its spice level' },
    { thai: 'ข้าวเหนียวมะม่วง', english: 'Mango Sticky Rice', price: '≈ ₹100', prompt: 'What is Mango Sticky Rice — dessert or main?' },
  ];

  const PHRASES = [
    { icon: '🙏', phrase: 'Khob khun krap / ka', meaning: 'Thank you (male / female)' },
    { icon: '📍', phrase: 'Yoo tee nai?', meaning: 'Where is it?' },
    { icon: '💰', phrase: 'Tao rai?', meaning: 'How much does it cost?' },
    { icon: '🚑', phrase: 'Chuay duay!', meaning: 'Help me!' },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-1 flex items-center gap-2 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Menu Translator
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#E6F1FB', color: '#185FA5' }}>AI-powered</span>
          </div>
          <p className="mb-3 text-xs text-gray-400">Type a dish name or phrase in any language</p>
          <input type="text" placeholder="e.g. Phở bò, たこ焼き, خبز..." value={input} onChange={e => onInput(e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#1D9E75]" />
          {output && (
            <div className="mt-3 rounded-xl p-4 text-sm leading-relaxed" style={{ background: '#E1F5EE', color: '#085041' }}>{output}</div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Survival Phrases</div>
          {PHRASES.map(p => (
            <div key={p.phrase} className="flex items-center gap-3 border-b border-gray-50 py-3 last:border-0">
              <span className="text-xl">{p.icon}</span>
              <div>
                <div className="text-sm font-medium text-gray-900">{p.phrase}</div>
                <div className="text-xs text-gray-400">{p.meaning}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Common Menu Phrases
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#E1F5EE', color: '#085041' }}>Thai</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {MENU.map(m => (
            <button key={m.english} onClick={() => sendPrompt(m.prompt)}
              className="flex justify-between rounded-xl p-4 text-left transition hover:opacity-80"
              style={{ background: '#f9fafb' }}>
              <div>
                <div className="text-base font-semibold text-gray-900">{m.thai}</div>
                <div className="text-xs text-gray-400">{m.english}</div>
              </div>
              <div className="text-sm font-semibold" style={{ color: '#1D9E75' }}>{m.price}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── TRANSIT ─────────────────────────────────────────────────────── */
function TransitTab({ data }: { data: TransitData }) {
  const tierColor = (t: string) => t === 'low' ? '#1D9E75' : t === 'medium' ? '#BA7517' : '#D85A30';

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Live Transit
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#E1F5EE', color: '#085041' }}>Real-time</span>
        </div>
        {data.routes.map(r => (
          <div key={r.id} className="flex items-center gap-3 border-b border-gray-50 py-3 last:border-0">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl" style={{ background: '#f9fafb' }}>{r.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-gray-900">{r.name}</div>
              <div className="text-xs text-gray-400">{r.sub}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold" style={{ color: r.color }}>{r.time}</div>
              <div className="text-xs" style={{ color: r.color }}>{r.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Cost Comparison
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#FAEEDA', color: '#BA7517' }}>To Airport</span>
        </div>
        {data.airportCosts.map(c => (
          <div key={c.label} className="flex justify-between border-b border-gray-50 py-2.5 text-sm last:border-0">
            <span className="text-gray-500">{c.label}</span>
            <span className="font-semibold" style={{ color: tierColor(c.tier) }}>{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── HEALTH ──────────────────────────────────────────────────────── */
function HealthTab({ safety, sendPrompt }: { safety: SafetyData; sendPrompt: (m: string) => void }) {
  const CLINICS = [
    { icon: '🏥', name: 'BNH Hospital', meta: '24hr · English staff · ★4.7', dist: '1.1 km', bg: '#FCEBEB' },
    { icon: '💊', name: 'Pharma Plus 24', meta: 'Open now · Pharmacist on call', dist: '0.6 km', bg: '#E6F1FB' },
    { icon: '🦷', name: 'Dental Express', meta: 'Walk-in · Low cost', dist: '1.8 km', bg: '#E1F5EE' },
  ];

  return (
    <div>
      <button onClick={() => sendPrompt('Emergency! I need immediate medical help — navigate to nearest clinic')}
        className="mb-5 flex w-full items-center gap-4 rounded-2xl p-5 text-left transition hover:opacity-90"
        style={{ background: '#D85A30' }}>
        <span className="text-3xl">🚨</span>
        <div className="flex-1">
          <div className="font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>One-tap Emergency Call</div>
          <div className="text-sm text-white/80">Tap to alert and navigate to nearest clinic</div>
        </div>
        <span className="text-2xl text-white">›</span>
      </button>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Nearby Clinics</div>
          {CLINICS.map(c => (
            <div key={c.name} className="flex items-center gap-3 border-b border-gray-50 py-2.5 last:border-0">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl" style={{ background: c.bg }}>{c.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-400">{c.meta}</div>
              </div>
              <div className="text-xs font-semibold" style={{ color: '#1D9E75' }}>{c.dist}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Health Tips
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#E1F5EE', color: '#085041' }}>Local</span>
          </div>
          <div className="space-y-3">
            {safety.tips.map(t => (
              <div key={t.bold} className="text-sm leading-relaxed text-gray-500">
                {t.icon}{' '}
                <span className="font-semibold text-gray-800">{t.bold}</span>{' '}
                {t.rest}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
