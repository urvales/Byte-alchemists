import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, MapPin, Navigation, Sparkles, Globe, CheckCircle2, XCircle, MessageSquare, Languages, Info } from "lucide-react";
import {
  getGems,
  getAlerts,
  getTransit,
  getSafety,
  createSearch,
  type Gem,
  type Alert,
  type TransitData,
  type SafetyData,
} from "../services/travelApi";
import { CULTURE_DATA } from "../data/cultureData";

// Components
import ScanMenuModal from "../components/ScanMenuModal";
import SOSModal from "../components/SOSModal";
import SearchRefinementModal from "../components/SearchRefinementModal";
import ItineraryModal from "../components/ItineraryModal";

type Tab = "discover" | "essentials" | "translate" | "transit" | "health" | "culture";

const TABS: { id: Tab; label: string }[] = [
  { id: "discover", label: "Discover" },
  { id: "culture", label: "Culture & Etiquette" },
  { id: "translate", label: "Translate" },
  { id: "transit", label: "Transit" },
  { id: "essentials", label: "Essentials" },
  { id: "health", label: "Health & Safety" },
];

const TRANSLATIONS: Record<string, string> = {
  phở: "Phở (Vietnamese noodle soup) — slow-cooked beef broth with rice noodles, herbs. Price: ₹120–200.",
  tako: "Takoyaki (たこ焼き) — Japanese octopus balls with mayo and bonito flakes.",
  ramen:
    "Ramen (ラーメン) — Japanese wheat noodles in savory broth with toppings.",
  pad: "Pad Thai (ผัดไทย) — Iconic Thai stir-fried rice noodles. Contains peanuts.",
};

// ── Base Fallback Data ───────────────────────────────────────────
const BASE_TRANSIT: TransitData = {
  routes: [
    {
      id: "t1",
      icon: "🚇",
      name: "MRT Blue Line",
      sub: "Platform 2 · 3 stops away",
      time: "4 min",
      status: "On time",
      color: "#1D9E75",
    },
    {
      id: "t2",
      icon: "🚌",
      name: "Bus 15B",
      sub: "Stop A3 · AC bus",
      time: "12 min",
      status: "Slight delay",
      color: "#BA7517",
    },
    {
      id: "t3",
      icon: "🛺",
      name: "Tuk-tuk",
      sub: "Verified Operator",
      time: "Now",
      status: "Available",
      color: "#1D9E75",
    },
  ],
  airportCosts: [
    { label: "Airport Rail Link", value: "₹130 · 28 min", tier: "low" },
    { label: "Metered Taxi", value: "₹350–600 · 40–70 min", tier: "medium" },
  ],
};

const BASE_SAFETY: SafetyData = {
  score: 8.2,
  scamRisk: "Medium",
  nightSafety: "Good",
  breakdown: [
    { label: "Overall Safety", value: "8.2/10", pct: 82, color: "#1D9E75" },
    { label: "Scam Risk", value: "Medium", pct: 40, color: "#BA7517" },
  ],
  tips: [
    { icon: "💧", bold: "Avoid tap water", rest: "— use bottled only" },
    { icon: "🏥", bold: "Travel insurance", rest: "— BUPA accepted locally" },
  ],
  emergency: {
    hospital: { name: "BNH Hospital", distance: "1.1 km" },
    police: { distance: "0.8 km" },
    embassy: { distance: "3.2 km" },
  },
  medicalCosts: [
    { label: "GP Consultation", value: "₹300–600", tier: "low" },
    { label: "Emergency Room", value: "₹2k–5k", tier: "medium" },
  ],
};

// ── City-specific Mock Data ──────────────────────────────────────
// ── City-specific Mock Data ──────────────────────────────────────
const CITY_DATA: Record<string, any> = {
  Bangkok: {
    gems: [
      { id: "b1", icon: "🍜", name: "Mama Lai's", meta: "4.9 ★", distance: "0.3 km", bg: "#E1F5EE" },
      { id: "b2", icon: "🙏", name: "Wat Saket", meta: "4.7 ★", distance: "1.2 km", bg: "#FAEEDA" },
      { id: "b3", icon: "🍹", name: "Teens of Thailand", meta: "4.8 ★", distance: "0.8 km", bg: "#FCEBEB" },
      { id: "b4", icon: "🛍️", name: "Chatuchak Market", meta: "4.6 ★", distance: "4.5 km", bg: "#E6F1FB" },
    ],
    alerts: [
      { id: "ba1", text: "Rain forecast tonight.", time: "15m ago", bg: "#FAEEDA", dot: "#BA7517" },
      { id: "ba2", text: "BTS Sukhumvit Line delayed.", time: "1h ago", bg: "#FCEBEB", dot: "#D85A30" },
      { id: "ba3", text: "Night market opens early.", time: "2h ago", bg: "#E1F5EE", dot: "#1D9E75" },
    ],
    transit: BASE_TRANSIT,
    safety: BASE_SAFETY,
  },
  Mumbai: {
    gems: [
      { id: "m1", icon: "🍛", name: "Bademiya", meta: "4.8 ★", distance: "0.5 km", bg: "#FAEEDA" },
      { id: "m2", icon: "🌊", name: "Marine Drive", meta: "4.9 ★", distance: "2.1 km", bg: "#E6F1FB" },
      { id: "m3", icon: "☕", name: "Kyani & Co.", meta: "4.6 ★", distance: "1.5 km", bg: "#E1F5EE" },
    ],
    alerts: [
      { id: "ma1", text: "Train delayed 10m.", time: "5m ago", bg: "#E6F1FB", dot: "#185FA5" },
      { id: "ma2", text: "Heavy traffic at Bandra.", time: "30m ago", bg: "#FAEEDA", dot: "#BA7517" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 7.8 },
  },
  London: {
    gems: [
      { id: "l1", icon: "🥯", name: "Beigel Bake", meta: "4.9 ★", distance: "0.4 km", bg: "#FAEEDA" },
      { id: "l2", icon: "🖼️", name: "Tate Modern", meta: "4.8 ★", distance: "1.2 km", bg: "#E6F1FB" },
      { id: "l3", icon: "🍻", name: "The Churchill Arms", meta: "4.7 ★", distance: "2.5 km", bg: "#FCEBEB" },
    ],
    alerts: [
      { id: "la1", text: "Tube strike tomorrow.", time: "2h ago", bg: "#FAEEDA", dot: "#BA7517" },
      { id: "la2", text: "Central line delays.", time: "10m ago", bg: "#FCEBEB", dot: "#D85A30" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 8.5 },
  },
  Paris: {
    gems: [
      { id: "p1", icon: "🥐", name: "Du Pain et des Idées", meta: "4.9 ★", distance: "0.6 km", bg: "#FCEBEB" },
      { id: "p2", icon: "🎨", name: "Musée d'Orsay", meta: "4.8 ★", distance: "1.5 km", bg: "#E6F1FB" },
      { id: "p3", icon: "🍷", name: "Le Verre Volé", meta: "4.7 ★", distance: "2.0 km", bg: "#E1F5EE" },
    ],
    alerts: [
      { id: "pa1", text: "Museum pass sale today.", time: "1h ago", bg: "#E1F5EE", dot: "#1D9E75" },
      { id: "pa2", text: "Eiffel Tower tickets low.", time: "3h ago", bg: "#FAEEDA", dot: "#BA7517" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 8.1 },
  },
  Tokyo: {
    gems: [
      { id: "t1", icon: "🍣", name: "Tsukiji Outer Market", meta: "4.9 ★", distance: "0.2 km", bg: "#E6F1FB" },
      { id: "t2", icon: "⛩️", name: "Meiji Shrine", meta: "4.8 ★", distance: "3.1 km", bg: "#E1F5EE" },
      { id: "t3", icon: "🍜", name: "Ichiran Ramen", meta: "4.7 ★", distance: "1.0 km", bg: "#FAEEDA" },
    ],
    alerts: [
      { id: "ta1", text: "Sakura peak in 2 days.", time: "3h ago", bg: "#FCEBEB", dot: "#D85A30" },
      { id: "ta2", text: "Yamanote line clear.", time: "5m ago", bg: "#E1F5EE", dot: "#1D9E75" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 9.2 },
  },
  "New York": {
    gems: [
      { id: "ny1", icon: "🍕", name: "Joe's Pizza", meta: "4.8 ★", distance: "0.3 km", bg: "#FAEEDA" },
      { id: "ny2", icon: "🌳", name: "Central Park", meta: "4.9 ★", distance: "1.5 km", bg: "#E1F5EE" },
      { id: "ny3", icon: "🎭", name: "Broadway Tickets", meta: "4.7 ★", distance: "0.8 km", bg: "#E6F1FB" },
    ],
    alerts: [
      { id: "nya1", text: "Subway line G closed.", time: "10m ago", bg: "#FAEEDA", dot: "#BA7517" },
      { id: "nya2", text: "Times square crowded.", time: "1h ago", bg: "#FCEBEB", dot: "#D85A30" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 7.5 },
  },
  Dubai: {
    gems: [
      { id: "d1", icon: "🏙️", name: "Old Souk Gold", meta: "4.7 ★", distance: "1.5 km", bg: "#FAEEDA" },
      { id: "d2", icon: "🐪", name: "Desert Safari", meta: "4.8 ★", distance: "15.0 km", bg: "#E1F5EE" },
      { id: "d3", icon: "🌊", name: "Kite Beach", meta: "4.6 ★", distance: "4.2 km", bg: "#E6F1FB" },
    ],
    alerts: [
      { id: "da1", text: "Sandstorm warning.", time: "4h ago", bg: "#FAEEDA", dot: "#BA7517" },
      { id: "da2", text: "Burj Khalifa light show at 8pm.", time: "1h ago", bg: "#E6F1FB", dot: "#185FA5" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 8.8 },
  },
  Singapore: {
    gems: [
      { id: "s1", icon: "🍲", name: "Tian Tian Chicken Rice", meta: "4.9 ★", distance: "0.4 km", bg: "#E1F5EE" },
      { id: "s2", icon: "🌺", name: "Gardens by the Bay", meta: "4.8 ★", distance: "2.1 km", bg: "#E6F1FB" },
      { id: "s3", icon: "🛍️", name: "Orchard Road", meta: "4.7 ★", distance: "1.5 km", bg: "#FCEBEB" },
    ],
    alerts: [
      { id: "sa1", text: "Light show at 8pm.", time: "1h ago", bg: "#E6F1FB", dot: "#185FA5" },
      { id: "sa2", text: "Heavy rain expected at 4pm.", time: "30m ago", bg: "#FAEEDA", dot: "#BA7517" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 9.0 },
  },
  Rome: {
    gems: [
      { id: "r1", icon: "🍦", name: "Giolitti Gelato", meta: "4.8 ★", distance: "0.5 km", bg: "#FCEBEB" },
      { id: "r2", icon: "🏛️", name: "Pantheon", meta: "4.9 ★", distance: "1.2 km", bg: "#E6F1FB" },
      { id: "r3", icon: "🍝", name: "Trastevere Pasta", meta: "4.7 ★", distance: "2.5 km", bg: "#E1F5EE" },
    ],
    alerts: [
      { id: "ra1", text: "Colosseum queues 2h+.", time: "30m ago", bg: "#FAEEDA", dot: "#BA7517" },
      { id: "ra2", text: "Metro line A closed.", time: "1h ago", bg: "#FCEBEB", dot: "#D85A30" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 7.9 },
  },
  Sydney: {
    gems: [
      { id: "sy1", icon: "🌊", name: "Bondi Coastal Walk", meta: "4.9 ★", distance: "2.1 km", bg: "#E6F1FB" },
      { id: "sy2", icon: "🎭", name: "Sydney Opera House", meta: "4.8 ★", distance: "5.0 km", bg: "#E1F5EE" },
      { id: "sy3", icon: "🍷", name: "Hunter Valley Wine", meta: "4.7 ★", distance: "150 km", bg: "#FCEBEB" },
    ],
    alerts: [
      { id: "sya1", text: "Surf warning: High swell.", time: "1h ago", bg: "#E6F1FB", dot: "#185FA5" },
      { id: "sya2", text: "Ferry delays at Circular Quay.", time: "20m ago", bg: "#FAEEDA", dot: "#BA7517" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 8.6 },
  },
  Bali: {
    gems: [
      { id: "ba1", icon: "🌴", name: "Ubud Monkey Forest", meta: "4.8 ★", distance: "1.2 km", bg: "#E1F5EE" },
      { id: "ba2", icon: "🏄", name: "Uluwatu Surf Break", meta: "4.9 ★", distance: "5.5 km", bg: "#E6F1FB" },
      { id: "ba3", icon: "☕", name: "Kopi Luwak Farm", meta: "4.7 ★", distance: "3.0 km", bg: "#FAEEDA" },
    ],
    alerts: [
      { id: "baa1", text: "Traffic near Kuta.", time: "20m ago", bg: "#FAEEDA", dot: "#BA7517" },
      { id: "baa2", text: "High tide warning.", time: "2h ago", bg: "#FCEBEB", dot: "#D85A30" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 7.4 },
  },
  "Cape Town": {
    gems: [
      { id: "ct1", icon: "⛰️", name: "Table Mountain", meta: "4.9 ★", distance: "3.5 km", bg: "#E6F1FB" },
      { id: "ct2", icon: "🐧", name: "Boulders Beach", meta: "4.8 ★", distance: "12 km", bg: "#E1F5EE" },
      { id: "ct3", icon: "🍷", name: "Stellenbosch Vines", meta: "4.9 ★", distance: "45 km", bg: "#FCEBEB" },
    ],
    alerts: [
      { id: "cta1", text: "High winds expected.", time: "45m ago", bg: "#FAEEDA", dot: "#BA7517" },
      { id: "cta2", text: "Cableway closed today.", time: "1h ago", bg: "#FCEBEB", dot: "#D85A30" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 7.2 },
  },
  "Rio de Janeiro": {
    gems: [
      { id: "rj1", icon: "🏖️", name: "Copacabana Beach", meta: "4.7 ★", distance: "0.5 km", bg: "#FCEBEB" },
      { id: "rj2", icon: "🗽", name: "Christ the Redeemer", meta: "4.9 ★", distance: "4.2 km", bg: "#E6F1FB" },
      { id: "rj3", icon: "🥩", name: "Churrascaria Palace", meta: "4.8 ★", distance: "1.0 km", bg: "#E1F5EE" },
    ],
    alerts: [
      { id: "rja1", text: "Metro line 1 delay.", time: "15m ago", bg: "#FAEEDA", dot: "#BA7517" },
      { id: "rja2", text: "Carnival street blocked.", time: "3h ago", bg: "#E6F1FB", dot: "#185FA5" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 6.8 },
  },
  Amsterdam: {
    gems: [
      { id: "am1", icon: "🚲", name: "Vondelpark", meta: "4.9 ★", distance: "1.0 km", bg: "#E1F5EE" },
      { id: "am2", icon: "🖼️", name: "Van Gogh Museum", meta: "4.8 ★", distance: "1.5 km", bg: "#FCEBEB" },
      { id: "am3", icon: "🧀", name: "Cheese Museum", meta: "4.6 ★", distance: "0.8 km", bg: "#FAEEDA" },
    ],
    alerts: [
      { id: "ama1", text: "Museum square busy.", time: "10m ago", bg: "#E6F1FB", dot: "#185FA5" },
      { id: "ama2", text: "Tram 2 rerouted.", time: "1h ago", bg: "#FAEEDA", dot: "#BA7517" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 8.9 },
  },
  Seoul: {
    gems: [
      { id: "se1", icon: "🏯", name: "Gyeongbokgung Palace", meta: "4.8 ★", distance: "2.2 km", bg: "#FAEEDA" },
      { id: "se2", icon: "🥩", name: "Korean BBQ Alley", meta: "4.9 ★", distance: "1.0 km", bg: "#E1F5EE" },
      { id: "se3", icon: "🛍️", name: "Myeongdong Market", meta: "4.7 ★", distance: "3.5 km", bg: "#E6F1FB" },
    ],
    alerts: [
      { id: "sea1", text: "Fine dust warning.", time: "2h ago", bg: "#FCEBEB", dot: "#D85A30" },
      { id: "sea2", text: "Subway line 2 normal.", time: "5m ago", bg: "#E1F5EE", dot: "#1D9E75" },
    ],
    transit: BASE_TRANSIT,
    safety: { ...BASE_SAFETY, score: 9.1 },
  },
};

const GET_CITY_DATA = (city: string) => {
  const key = Object.keys(CITY_DATA).find(
    (k) => k.toLowerCase() === city.toLowerCase(),
  );
  return key ? CITY_DATA[key] : CITY_DATA["Bangkok"];
};

const SUGGESTIONS = Object.keys(CITY_DATA);

export default function DashboardPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [toast, setToast] = useState("");
  const [currentCity, setCurrentCity] = useState(() => {
    const saved = localStorage.getItem("lastSearchCity");
    if (saved && saved !== "[object Object]" && !saved.startsWith("{")) {
      return saved;
    }
    return "Bangkok";
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    const saved = localStorage.getItem("lastSearchCity");
    if (saved && saved !== "[object Object]" && !saved.startsWith("{")) {
      return saved;
    }
    return "";
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Modal states
  const [modals, setModals] = useState({
    scan: false,
    sos: false,
    refine: false,
    itinerary: false,
  });
  const [itineraryDetails, setItineraryDetails] = useState<any>(null);
  const [detailModal, setDetailModal] = useState<any>(null);
  const [searchDates, setSearchDates] = useState(() => {
    const saved = localStorage.getItem('lastSearchDates');
    return saved ? JSON.parse(saved) : null;
  });

  // API states
  const [gems, setGems] = useState<Gem[]>(() => GET_CITY_DATA(currentCity).gems);
  const [alerts, setAlerts] = useState<Alert[]>(() => GET_CITY_DATA(currentCity).alerts);
  const [transit, setTransit] = useState<TransitData>(BASE_TRANSIT);
  const [safety, setSafety] = useState<SafetyData>(BASE_SAFETY);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  const toggleModal = (key: keyof typeof modals, val: boolean) =>
    setModals((prev) => ({ ...prev, [key]: val }));

  useEffect(() => {
    // Only use geolocation if there's no searched city from the landing page
    const searchedCity = localStorage.getItem("lastSearchCity");
    if (searchedCity && searchedCity !== "[object Object]" && !searchedCity.startsWith("{")) {
      setCurrentCity(searchedCity);
      setSearchQuery(searchedCity);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        let city =
          pos.coords.latitude > 18 && pos.coords.latitude < 20
            ? "Mumbai"
            : "Bangkok";
        setCurrentCity(city);
        setSearchQuery(city);
        showToast(`Located in ${city}`);
      });
    }
  }, [showToast]);

  useEffect(() => {
    if (!token) return;
    // Make API calls for demo purposes, but use our rich frontend CITY_DATA
    Promise.allSettled([
      getGems(token, currentCity),
      getAlerts(token, currentCity),
    ]).then(() => {
      const data = GET_CITY_DATA(currentCity);
      setGems(data.gems);
      setAlerts(data.alerts);
    });
  }, [token, currentCity]);

  useEffect(() => {
    if (!token) return;
    if (activeTab === "transit") {
      getTransit(token, currentCity).finally(() => {
        setTransit(GET_CITY_DATA(currentCity).transit);
      });
    }
    if (activeTab === "health" || activeTab === "essentials") {
      getSafety(token, currentCity).finally(() => {
        setSafety(GET_CITY_DATA(currentCity).safety);
      });
    }
  }, [activeTab, token, currentCity]);

  const handleSearch = (cityOverride?: string) => {
    const city = cityOverride || searchQuery.trim();
    if (!city) return;

    // Update dashboard context to the searched city
    setCurrentCity(city);
    setSearchQuery(city);
    toggleModal("refine", true);
  };

  const generateItinerary = (details: any) => {
    setItineraryDetails(details);
    toggleModal("refine", false);
    toggleModal("itinerary", true);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
        />
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "discover" && (
          <DiscoverTab
            gems={gems}
            alerts={alerts}
            city={currentCity}
            onScan={() => toggleModal("scan", true)}
            onSOS={() => toggleModal("sos", true)}
            sendPrompt={showToast}
            onDetail={setDetailModal}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "essentials" && (
          <EssentialsTab
            safety={safety}
            onSOS={() => toggleModal("sos", true)}
          />
        )}
        {activeTab === "translate" && <TranslateTab city={currentCity} />}
        {activeTab === "transit" && <TransitTab data={transit} />}
        {activeTab === "health" && (
          <HealthTab safety={safety} onSOS={() => toggleModal("sos", true)} />
        )}
        {activeTab === "culture" && <CultureTab sendPrompt={showToast} />}
      </div>

      <ScanMenuModal
        isOpen={modals.scan}
        onClose={() => toggleModal("scan", false)}
      />
      <SOSModal
        isOpen={modals.sos}
        onClose={() => toggleModal("sos", false)}
        city={currentCity}
      />
      <SearchRefinementModal
        isOpen={modals.refine}
        onClose={() => toggleModal("refine", false)}
        destination={searchQuery}
        onGenerate={generateItinerary}
      />
      <ItineraryModal
        isOpen={modals.itinerary}
        onClose={() => toggleModal("itinerary", false)}
        details={itineraryDetails}
      />
      
      {detailModal && (
        <QuickDetailModal 
          type={detailModal} 
          city={currentCity} 
          onClose={() => setDetailModal(null)} 
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#085041] text-white px-5 py-3 rounded-xl shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function Hero({
  searchQuery,
  setSearchQuery,
  onSearch,
  showSuggestions,
  setShowSuggestions,
}: any) {
  return (
    <div className="relative mb-5 overflow-hidden rounded-2xl p-6 sm:p-8 bg-[#1D9E75] text-white">
      <h1 className="text-3xl font-bold mb-2">
        Where do you want
        <br />
        to explore today?
      </h1>
      <p className="text-sm opacity-80 mb-5">
        Your AI travel companion for services, discovery, and safety.
      </p>
      <div className="relative flex items-center gap-2 max-w-lg bg-white/15 p-2 rounded-2xl backdrop-blur-sm">
        <Search className="w-4 h-4 ml-2 opacity-60" />
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search destination city..."
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="w-full bg-transparent outline-none text-sm placeholder:text-white/60"
          />
          {showSuggestions && searchQuery.length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-2xl overflow-hidden z-[60] text-[#085041] border border-gray-100">
              {SUGGESTIONS.filter((s) =>
                s.toLowerCase().includes(searchQuery.toLowerCase()),
              ).map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent focus loss
                    onSearch(s);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 transition-colors border-b border-gray-50 last:border-0 flex items-center gap-2"
                >
                  <MapPin className="w-3 h-3 opacity-40" /> {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            onSearch();
            setShowSuggestions(false);
          }}
          className="bg-white text-[#085041] px-4 py-1.5 rounded-xl text-xs font-bold shrink-0"
        >
          Explore ↗
        </button>
      </div>
    </div>
  );
}

function TabBar({ activeTab, setActiveTab }: any) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${activeTab === t.id ? "bg-[#1D9E75] text-white border-[#1D9E75]" : "bg-white text-gray-500 border-gray-200"}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function DiscoverTab({ gems, alerts, city, onScan, onSOS, sendPrompt, onDetail, setActiveTab }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: "⚡", name: "Charging", count: "12 nearby", bg: "#E1F5EE" },
          { icon: "🏥", name: "Medical", count: "5 clinics", bg: "#FCEBEB" },
          { icon: "💱", name: "ATM & FX", count: "8 options", bg: "#FAEEDA" },
          { icon: "📶", name: "WiFi", count: "20+ spots", bg: "#E6F1FB" },
        ].map((s) => (
          <button
            key={s.name}
            onClick={() => onDetail(s.name.toLowerCase())}
            className="bg-white p-4 rounded-2xl border border-gray-100 text-center hover:bg-gray-50 transition-all"
          >
            <div
              className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-xl text-xl"
              style={{ background: s.bg }}
            >
              {s.icon}
            </div>
            <div className="text-sm font-bold text-gray-800">{s.name}</div>
            <div className="text-[10px] text-gray-400">{s.count}</div>
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            Local Hidden Gems{" "}
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
              Off-tourist
            </span>
          </h3>
          {gems.map((g: any) => (
            <div
              key={g.id}
              className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-xl text-xl"
                style={{ background: g.bg }}
              >
                {g.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{g.name}</div>
                <div className="text-[10px] text-gray-400">{g.meta}</div>
              </div>
              <div className="text-xs font-bold text-[#1D9E75]">
                {g.distance}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <h3 className="font-bold mb-4">
            Live Alerts{" "}
            <span className="ml-2 text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
              {alerts.length} new
            </span>
          </h3>
          {alerts.map((a: any) => (
            <div
              key={a.id}
              className="flex gap-3 p-3 rounded-xl mb-2 last:mb-0"
              style={{ background: a.bg }}
            >
              <div
                className="w-2 h-2 mt-1.5 rounded-full shrink-0"
                style={{ background: a.dot }}
              />
              <div>
                <div className="text-sm text-gray-800">{a.text}</div>
                <div className="text-[10px] text-gray-500">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { icon: "🍽️", label: "Scan Menu", act: onScan },
          { icon: "🆘", label: "SOS Help", act: onSOS },
          {
            icon: "🗺️",
            label: "Day Plan",
            act: () => onDetail("day plan"),
          },
          {
            icon: "🤝",
            label: "Etiquette",
            act: () => setActiveTab("culture"),
          },
          {
            icon: "🚕",
            label: "Safe Ride",
            act: () => onDetail("safe ride"),
          },
          {
            icon: "🎒",
            label: "Pack Check",
            act: () => onDetail("pack check"),
          },
        ].map((q) => (
          <button
            key={q.label}
            onClick={q.act}
            className="bg-white py-4 rounded-xl border border-gray-100 flex flex-col items-center hover:bg-emerald-50 hover:border-emerald-200 transition-all"
          >
            <span className="text-2xl">{q.icon}</span>
            <span className="text-[10px] font-bold mt-1.5 text-gray-600">
              {q.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EssentialsTab({ safety, onSOS }: any) {
  return (
    <div className="space-y-5">
      <button
        onClick={onSOS}
        className="w-full flex items-center gap-4 bg-[#D85A30] p-5 rounded-2xl text-white text-left"
      >
        <span className="text-3xl">🚨</span>
        <div className="flex-1 font-bold">
          Emergency SOS
          <div className="text-xs opacity-80 font-normal">
            Hospital {safety.emergency.hospital.distance} · Police{" "}
            {safety.emergency.police.distance}
          </div>
        </div>
        <span className="text-2xl">›</span>
      </button>
      <div className="bg-white p-5 rounded-2xl border border-gray-100">
        <h3 className="font-bold mb-4">
          Device Charging Stations{" "}
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
            Live
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl">
          {[
            { n: "Mall", d: "0.4km", p: 80 },
            { n: "Library", d: "0.7km", p: 45 },
            { n: "Cafe", d: "1.1km", p: 15 },
            { n: "Bus", d: "1.4km", p: 90 },
          ].map((p) => (
            <div
              key={p.n}
              className="bg-white p-3 rounded-xl border border-gray-100 text-center"
            >
              <div className="text-[10px] font-bold">{p.n}</div>
              <div className="text-[9px] text-gray-400">{p.d}</div>
              <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${p.p}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TranslateTab({ city }: any) {
  const [input, setInput] = useState("");
  const lang = city === "Mumbai" ? "Marathi" : "Thai";
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-gray-100">
        <h3 className="font-bold mb-1">
          Menu Translator{" "}
          <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full uppercase">
            AI
          </span>
        </h3>
        <p className="text-[10px] text-gray-400 mb-4">Type any dish name</p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Pad Thai, Vada Pav..."
          className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm outline-none focus:border-emerald-500"
        />
        {input.length > 2 && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl leading-relaxed">
            Analyzing "{input}"... Ask me in chat for details.
          </div>
        )}
      </div>
      <div className="bg-white p-5 rounded-2xl border border-gray-100">
        <h3 className="font-bold mb-4">
          Survival Phrases{" "}
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
            {lang}
          </span>
        </h3>
        {[
          { i: "🙏", p: "Khob khun", m: "Thank you" },
          { i: "📍", p: "Yoo tee nai?", m: "Where is it?" },
          { i: "💰", p: "Tao rai?", m: "How much?" },
        ].map((p) => (
          <div
            key={p.p}
            className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
          >
            <span className="text-xl">{p.i}</span>
            <div>
              <div className="text-sm font-bold">{p.p}</div>
              <div className="text-[10px] text-gray-400">{p.m}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransitTab({ data }: any) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-gray-100">
        <h3 className="font-bold mb-4">
          Live Transit{" "}
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
            Live
          </span>
        </h3>
        {data.routes.map((r: any) => (
          <div
            key={r.id}
            className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-xl">
              {r.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">{r.name}</div>
              <div className="text-[10px] text-gray-400">{r.sub}</div>
            </div>
            <div
              className="text-right font-bold text-xs"
              style={{ color: r.color }}
            >
              {r.time}
              <div className="text-[10px] font-normal">{r.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthTab({ safety, onSOS }: any) {
  return (
    <div className="space-y-5">
      <button
        onClick={onSOS}
        className="w-full flex items-center gap-4 bg-[#D85A30] p-5 rounded-2xl text-white text-left font-bold"
      >
        🚨 Emergency Medical Call<span className="text-2xl ml-auto">›</span>
      </button>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <h3 className="font-bold mb-4">Health Tips</h3>
          {safety.tips.map((t: any) => (
            <div key={t.bold} className="text-xs text-gray-500 mb-3">
              {t.icon} <span className="font-bold text-gray-800">{t.bold}</span>{" "}
              {t.rest}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function QuickDetailModal({ type, city, onClose }: any) {
  const data: Record<string, any> = {
    charging: { title: "Charging Stations", items: ["Siam Paragon (2nd Fl)", "IconSiam (B1)", "Terminal 21 (Food Court)"] },
    medical: { title: "Medical Centers", items: ["BNH Hospital (Open 24h)", "Bumrungrad (Intl Clinic)", "Samitivej Hospital"] },
    "atm & fx": { title: "ATM & Currency", items: ["SuperRich (Best Rates)", "SCB (Exchange Counter)", "Kasikorn ATM"] },
    wifi: { title: "WiFi Spots", items: ["AIS Super WiFi", "TrueMove Hub", "Starbucks Free WiFi"] },
    "day plan": { title: "Day Plan Helper", items: ["Morning: Market Tour", "Afternoon: River Cruise", "Evening: Rooftop Bar"] },
    "safe ride": { title: "Safe Ride Partners", items: ["Grab (Verified)", "Bolt (Budget)", "MuvMi (EV Tuk-tuk)"] },
    "pack check": { title: "Pack Checklist", items: ["Sunscreen (SPF 50+)", "Power Adapter (Type A/C)", "Light Cotton Clothing"] }
  };
  const content = data[type] || { title: "Details", items: ["No details available yet."] };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 bg-[#1D9E75] text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">{content.title} in {city}</h3>
          <button onClick={onClose}><Search className="w-5 h-5 rotate-45" /></button>
        </div>
        <div className="p-6 space-y-3">
          {content.items.map((it: string) => (
            <div key={it} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700">
              <Sparkles className="w-4 h-4 text-emerald-500" /> {it}
            </div>
          ))}
          <button onClick={onClose} className="w-full mt-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── CULTURE ─────────────────────────────────────────────────────── */
function CultureTab({ sendPrompt }: { sendPrompt: (m: string) => void }) {
  const [selectedLang, setSelectedLang] = useState("Thai");
  const [phraseSearch, setPhraseSearch] = useState("");
  const data = CULTURE_DATA[selectedLang];

  const filteredPhrases = data.phrases.map((cat: any) => ({
    ...cat,
    items: cat.items.filter((i: any) =>
      i.original.toLowerCase().includes(phraseSearch.toLowerCase()) ||
      i.translated.toLowerCase().includes(phraseSearch.toLowerCase())
    )
  })).filter((cat: any) => cat.items.length > 0);

  return (
    <div className="space-y-5">
      {/* Language Selector */}
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
        {Object.keys(CULTURE_DATA).map(lang => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className="flex flex-shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:border-[#1D9E75]"
            style={selectedLang === lang
              ? { background: "#1D9E75", color: "#fff", borderColor: "#1D9E75", boxShadow: "0 4px 12px rgba(29, 158, 117, 0.2)" }
              : { background: "#fff", color: "#374151", borderColor: "#e5e7eb" }
            }
          >
            <span className="text-lg">{CULTURE_DATA[lang].flag}</span>
            {lang}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Etiquette Dos & Donts */}
        <div className="lg:col-span-2 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 font-bold text-green-700" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <CheckCircle2 className="h-5 w-5" />
                Cultural Do's
              </div>
              <div className="space-y-4">
                {data.etiquette.dos.map((item: any) => (
                  <div key={item.title}>
                    <div className="text-sm font-bold text-gray-900">{item.title}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 font-bold text-red-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <XCircle className="h-5 w-5" />
                Cultural Don'ts
              </div>
              <div className="space-y-4">
                {data.etiquette.donts.map((item: any) => (
                  <div key={item.title}>
                    <div className="text-sm font-bold text-gray-900">{item.title}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Essentials / Nuances */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <Info className="h-5 w-5 text-[#1D9E75]" />
              Local Nuances
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {data.etiquette.essentials.map((item: any) => (
                <div key={item.title} className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <div className="text-sm font-bold text-gray-900">{item.title}</div>
                  <div className="mt-1 text-[11px] leading-relaxed text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Local Phrases */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <Languages className="h-5 w-5 text-[#1D9E75]" />
              Survival Phrases
            </div>
            <span className="rounded-full bg-[#E1F5EE] px-2 py-0.5 text-[10px] font-bold text-[#085041]">
              {selectedLang}
            </span>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search phrases..."
              value={phraseSearch}
              onChange={e => setPhraseSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2 pl-9 pr-4 text-xs outline-none focus:border-[#1D9E75]"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-none max-h-[500px]">
            {filteredPhrases.map((cat: any) => (
              <div key={cat.category}>
                <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">{cat.category}</div>
                <div className="space-y-3">
                  {cat.items.map((item: any) => (
                    <div key={item.original} className="group rounded-xl border border-transparent p-2 transition hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-bold text-gray-900">{item.original}</div>
                          <div className="text-xs text-gray-500">{item.translated}</div>
                        </div>
                        <button className="rounded-full bg-gray-100 p-1.5 opacity-0 transition group-hover:opacity-100 hover:bg-gray-200">
                          <MessageSquare className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>
                      <div className="mt-1 text-[10px] italic text-[#1D9E75]">"{item.pronunciation}"</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {filteredPhrases.length === 0 && (
              <div className="py-10 text-center text-xs text-gray-400">No phrases found for "{phraseSearch}"</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
