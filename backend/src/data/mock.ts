// All mock data for travel features — swap with real data sources when available

export const MOCK_SERVICES = {
  charging: [
    { id: 'c1', name: 'Central Mall', distance: '0.4 km', available: 6, total: 8, status: 'available', lat: 13.7565, lng: 100.5018 },
    { id: 'c2', name: 'Main Library', distance: '0.7 km', available: 3, total: 6, status: 'available', lat: 13.7570, lng: 100.5030 },
    { id: 'c3', name: 'City Café', distance: '1.1 km', available: 1, total: 4, status: 'low', lat: 13.7545, lng: 100.5005 },
    { id: 'c4', name: 'Bus Terminal', distance: '1.4 km', available: 8, total: 10, status: 'available', lat: 13.7580, lng: 100.5050 },
  ],
  medical: [
    { id: 'm1', name: 'BNH Hospital', distance: '1.1 km', hours: '24hr', englishStaff: true, rating: 4.7, type: 'hospital' },
    { id: 'm2', name: 'Pharma Plus 24', distance: '0.6 km', hours: '24hr', englishStaff: false, rating: 4.3, type: 'pharmacy' },
    { id: 'm3', name: 'Dental Express', distance: '1.8 km', hours: '8am–8pm', englishStaff: true, rating: 4.5, type: 'dental' },
    { id: 'm4', name: 'City Walk-in Clinic', distance: '0.9 km', hours: '7am–10pm', englishStaff: true, rating: 4.2, type: 'clinic' },
  ],
  atm: [
    { id: 'a1', name: 'Bangkok Bank ATM', distance: '0.2 km', networks: ['Visa', 'Mastercard'], fxAvailable: false },
    { id: 'a2', name: 'Central FX Exchange', distance: '0.5 km', networks: ['Visa', 'Mastercard', 'Amex'], fxAvailable: true, fxRates: { USD_THB: 36.2, EUR_THB: 38.9 } },
    { id: 'a3', name: 'Kasikorn Bank ATM', distance: '0.8 km', networks: ['Visa', 'Mastercard'], fxAvailable: false },
  ],
  wifi: [
    { id: 'w1', name: 'True Digital Park', distance: '0.3 km', type: 'coworking', speed: '500 Mbps', free: true },
    { id: 'w2', name: 'Starbucks Silom', distance: '0.6 km', type: 'cafe', speed: '100 Mbps', free: true, requiresPurchase: true },
    { id: 'w3', name: 'Hubba Ekkamai', distance: '1.2 km', type: 'coworking', speed: '1 Gbps', free: false, dailyRate: 250 },
    { id: 'w4', name: 'Dean & Deluca', distance: '0.9 km', type: 'cafe', speed: '50 Mbps', free: true, requiresPurchase: true },
  ],
};

export const MOCK_GEMS = [
  { id: 'g1', icon: '🍜', name: "Mama Lai's Noodles", meta: '4.9 ★ · Cash only · Local fav', distance: '0.3 km', bg: '#E1F5EE', category: 'food' },
  { id: 'g2', icon: '🎭', name: 'Shadow Puppet Market', meta: '4.7 ★ · Evenings only', distance: '0.9 km', bg: '#EEEDFE', category: 'culture' },
  { id: 'g3', icon: '☕', name: 'Rooftop Heritage Café', meta: '4.8 ★ · Great views', distance: '1.2 km', bg: '#FAEEDA', category: 'food' },
  { id: 'g4', icon: '🏛️', name: 'Talat Noi Community', meta: '4.6 ★ · Photography spot', distance: '1.5 km', bg: '#FCEBEB', category: 'culture' },
  { id: 'g5', icon: '🌿', name: 'Bangkrachao Green Lung', meta: '4.9 ★ · Cycling trails', distance: '3.2 km', bg: '#E1F5EE', category: 'nature' },
];

export const MOCK_ALERTS = [
  { id: 'al1', dot: '#BA7517', bg: '#FAEEDA', severity: 'warning', text: 'Night market at Temple Sq closes early tonight (9pm) due to rain forecast.', time: '15 min ago' },
  { id: 'al2', dot: '#1D9E75', bg: '#E1F5EE', severity: 'info', text: 'Free cultural tour departs Old Quarter at 6pm — 4 spots left.', time: '1 hr ago' },
  { id: 'al3', dot: '#185FA5', bg: '#E6F1FB', severity: 'info', text: 'Currency: USD/THB rate improved — best rate at Central Bank branch.', time: '2 hr ago' },
  { id: 'al4', dot: '#D85A30', bg: '#FAECE7', severity: 'danger', text: 'Road closure on Sukhumvit Soi 11 until 6pm today. Use alternate routes.', time: '3 hr ago' },
];

export const MOCK_TRANSIT = {
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

export const MOCK_SAFETY = {
  score: 8.2,
  scamRisk: 'Medium',
  nightSafety: 'Good',
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
  emergency: {
    hospital: { name: 'BNH Hospital', distance: '1.1 km' },
    police: { distance: '0.8 km' },
    embassy: { distance: '3.2 km' },
  },
};

export const MOCK_MEDICAL_COSTS = [
  { label: 'GP Consultation', value: '₹300–600', tier: 'low' },
  { label: 'Blood Test', value: '₹200–500', tier: 'low' },
  { label: 'X-Ray', value: '₹800–1,500', tier: 'medium' },
  { label: 'Emergency Room', value: '₹2k–5k', tier: 'medium' },
  { label: 'Ambulance', value: '₹500–1,200', tier: 'high' },
];
