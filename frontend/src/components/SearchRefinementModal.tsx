import React, { useState } from 'react';
import { X, Calendar, Users, MapPin, Sparkles } from 'lucide-react';

interface SearchRefinementModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  onGenerate: (details: any) => void;
}

const EXPERIENCES = [
  { id: 'solo', label: 'Solo Traveler', icon: '🎒' },
  { id: 'foodie', label: 'Foodie Tour', icon: '🍜' },
  { id: 'romantic', label: 'Romantic Getaway', icon: '🥂' },
  { id: 'adventure', label: 'Adventure', icon: '🧗' },
  { id: 'family', label: 'Family Friendly', icon: '👨‍👩-👧‍👦' },
  { id: 'culture', label: 'Cultural Immersion', icon: '🏛️' },
];

export default function SearchRefinementModal({ isOpen, onClose, destination, onGenerate }: SearchRefinementModalProps) {
  const [dates, setDates] = useState(() => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  });
  const [guests, setGuests] = useState('1');
  const [selectedExp, setSelectedExp] = useState('solo');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      destination,
      dates,
      guests,
      experience: selectedExp
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Refine Your Trip</h2>
              <p className="text-sm text-gray-500">Customize your journey to {destination}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="date" 
                      required
                      value={dates.start}
                      onChange={e => setDates(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75] transition-all cursor-pointer" 
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="date" 
                      required
                      value={dates.end}
                      onChange={e => setDates(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75] transition-all cursor-pointer" 
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {['3 Days', '1 Week', '2 Weeks'].map(label => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const start = dates.start || new Date().toISOString().split('T')[0];
                      const d = new Date(start);
                      const days = label.includes('Week') ? (label.startsWith('1') ? 7 : 14) : 3;
                      d.setDate(d.getDate() + days);
                      setDates({ start, end: d.toISOString().split('T')[0] });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gray-50 text-[10px] font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-100 transition-all"
                  >
                    + {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                >
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preferred Experience</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EXPERIENCES.map(exp => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setSelectedExp(exp.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedExp === exp.id 
                        ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500 ring-offset-0' 
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="text-xl mb-1">{exp.icon}</div>
                    <div className={`text-[10px] font-bold ${selectedExp === exp.id ? 'text-indigo-700' : 'text-gray-500'}`}>
                      {exp.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
            >
              Generate Itinerary <Sparkles className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
