import React from 'react';
import { X, MapPin, Calendar, Clock, Coffee, Camera, Moon, CreditCard, ChevronRight } from 'lucide-react';

interface ItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: {
    destination: string;
    dates: { start: string; end: string };
    guests: string;
    experience: string;
  } | null;
}

const MOCK_ITINERARY = {
  days: [
    {
      day: 1,
      title: 'Arrival & Local Flavors',
      activities: [
        { time: '09:00', icon: <Coffee className="w-4 h-4" />, title: 'Welcome Breakfast', desc: 'Traditional local breakfast at a highly-rated neighborhood cafe.', cost: '₹200' },
        { time: '11:30', icon: <Camera className="w-4 h-4" />, title: 'City Landmark Tour', desc: 'Visit the iconic sights and get those perfect photos.', cost: 'Free' },
        { time: '18:00', icon: <Moon className="w-4 h-4" />, title: 'Night Market Explorer', desc: 'Guided street food tour through the vibrant evening markets.', cost: '₹500' },
      ]
    },
    {
      day: 2,
      title: 'Hidden Gems & Culture',
      activities: [
        { time: '10:00', icon: <MapPin className="w-4 h-4" />, title: 'Secret Temple Visit', desc: 'Explore a quiet, off-the-beaten-path temple known only to locals.', cost: '₹100' },
        { time: '14:00', icon: <ChevronRight className="w-4 h-4" />, title: 'Artisan Workshop', desc: 'Hands-on experience with local craftspeople.', cost: '₹800' },
        { time: '20:00', icon: <CreditCard className="w-4 h-4" />, title: 'Riverside Dinner', desc: 'Premium dining experience with a view of the city skyline.', cost: '₹1,500' },
      ]
    }
  ],
  tips: [
    'Always carry small change for street vendors.',
    'Comfortable walking shoes are a must for Day 1.',
    'Download the local transit app for easier movement.'
  ],
  totalCost: '≈ ₹3,100 per person'
};

export default function ItineraryModal({ isOpen, onClose, details }: ItineraryModalProps) {
  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col h-[85vh]">
          {/* Header */}
          <div className="p-8 bg-indigo-600 text-white shrink-0">
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3" /> AI-Generated Itinerary
            </div>
            <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {details.destination} Experience
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Calendar className="w-4 h-4" />
                {details.dates.start} — {details.dates.end}
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm uppercase font-bold text-[10px] tracking-wider">
                <Clock className="w-4 h-4" />
                {details.experience} Mode
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">
            {MOCK_ITINERARY.days.map((day) => (
              <div key={day.day} className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100">
                    {day.day}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>{day.title}</h3>
                </div>
                
                <div className="ml-5 border-l-2 border-dashed border-gray-100 pl-9 space-y-8">
                  {day.activities.map((act, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[45px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 shadow-sm" />
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-500">
                          <Clock className="w-3 h-3" /> {act.time}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md uppercase">{act.cost}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                        {act.title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{act.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2 italic">
                💡 Pro Tips for {details.destination}
              </h4>
              <ul className="space-y-2">
                {MOCK_ITINERARY.tips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Budget</div>
              <div className="text-lg font-black text-gray-900">{MOCK_ITINERARY.totalCost}</div>
            </div>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Book This Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
