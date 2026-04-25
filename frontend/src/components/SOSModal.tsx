import { useState, useEffect } from 'react';
import { X, ShieldAlert, Phone, MapPin } from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
}

const CITY_NUMBERS: Record<string, any> = {
  'Bangkok': { police: '191', medical: '1669', fire: '199', tourist: '1155' },
  'Mumbai': { police: '100', medical: '102', fire: '101', women: '103' },
  'London': { police: '999', medical: '999', fire: '999', non_emergency: '101' },
};

export default function SOSModal({ isOpen, onClose, city }: SOSModalProps) {
  const [isActivating, setIsActivating] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  
  const numbers = CITY_NUMBERS[city] || CITY_NUMBERS['Bangkok'];

  useEffect(() => {
    let interval: any;
    if (isActivating && holdTime < 100) {
      interval = setInterval(() => setHoldTime(h => h + 5), 100);
    } else if (holdTime >= 100) {
      setIsActivating(false);
      setIsSent(true);
    } else {
      setHoldTime(0);
    }
    return () => clearInterval(interval);
  }, [isActivating, holdTime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-red-600/40 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button 
          onClick={() => { setIsActivating(false); setIsSent(false); setHoldTime(0); onClose(); }}
          className="absolute right-6 top-6 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSent ? (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl animate-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Emergency SOS</h2>
                <p className="text-sm text-gray-500">Contacting services in {city}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <button className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 group hover:bg-red-100 transition-colors">
                <div className="text-left">
                  <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Police</div>
                  <div className="text-xl font-black text-red-700">{numbers.police}</div>
                </div>
                <Phone className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              </button>
              <button className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 group hover:bg-emerald-100 transition-colors">
                <div className="text-left">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Medical</div>
                  <div className="text-xl font-black text-emerald-700">{numbers.medical}</div>
                </div>
                <Phone className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sm font-bold text-gray-900 mb-6">Hold to alert emergency contacts & show location to nearby help</p>
                <button 
                  onMouseDown={() => setIsActivating(true)}
                  onMouseUp={() => setIsActivating(false)}
                  onMouseLeave={() => setIsActivating(false)}
                  onTouchStart={() => setIsActivating(true)}
                  onTouchEnd={() => setIsActivating(false)}
                  className="w-32 h-32 rounded-full bg-red-600 shadow-xl shadow-red-200 flex items-center justify-center relative active:scale-95 transition-transform"
                >
                  {isActivating ? (
                    <div className="text-white text-center">
                      <div className="text-3xl font-black mb-1">{Math.ceil((100 - holdTime) / 20)}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider">Hold</div>
                    </div>
                  ) : (
                    <div className="text-white font-black text-2xl">SOS</div>
                  )}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle 
                      cx="64" cy="64" r="60" 
                      className="fill-none stroke-white/20 stroke-[8px]" 
                    />
                    <circle 
                      cx="64" cy="64" r="60" 
                      className="fill-none stroke-white stroke-[8px] transition-all"
                      style={{ strokeDasharray: 377, strokeDashoffset: 377 - (377 * holdTime) / 100 }}
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Alert Sent</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Your exact location and profile have been shared with local emergency services and nearby verified help.
            </p>
            
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4 text-left mb-8">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Live Location Locked</div>
                <div className="text-xs text-gray-600">Accuracy: within 5 meters</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors text-sm">
                Open Map
              </button>
              <button onClick={() => { setIsSent(false); onClose(); }} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
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
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
