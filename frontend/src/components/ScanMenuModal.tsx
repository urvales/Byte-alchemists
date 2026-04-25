import { useState, useEffect } from 'react';
import { X, Camera, Sparkles, Languages, Utensils, CheckCircle2 } from 'lucide-react';

interface ScanMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_RESULTS = [
  { thai: 'ต้มข่าไก่', english: 'Tom Kha Gai', price: '≈ ฿180', desc: 'Chicken in coconut soup with galangal, lemongrass, and mushrooms. Mild and creamy.' },
  { thai: 'ผัดไทย', english: 'Pad Thai', price: '≈ ฿150', desc: 'Stir-fried rice noodles with eggs, tofu, shrimp, and peanuts. Iconic Thai street food.' },
  { thai: 'ส้มตำ', english: 'Som Tam', price: '≈ ฿120', desc: 'Green papaya salad with a balance of sweet, sour, and spicy flavors. Refreshing.' },
];

export default function ScanMenuModal({ isOpen, onClose }: ScanMenuModalProps) {
  const [step, setStep] = useState<'camera' | 'scanning' | 'results'>('camera');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'scanning') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('results'), 500);
            return 100;
          }
          return p + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleCapture = () => setStep('scanning');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={() => { setStep('camera'); setProgress(0); onClose(); }}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'camera' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>AI Menu Scanner</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Snap a photo of any restaurant menu to instantly translate and explain local dishes.
            </p>
            <div className="aspect-[4/3] bg-gray-900 rounded-2xl mb-8 flex items-center justify-center relative group overflow-hidden border-4 border-gray-100">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500" />
              <button 
                onClick={handleCapture}
                className="relative z-10 w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-110 transition-transform bg-white/20 backdrop-blur-sm"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-xl" />
              </button>
            </div>
            <div className="flex justify-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-emerald-500" /> AI Vision</span>
              <span className="flex items-center gap-1.5"><Languages className="w-3 h-3 text-blue-500" /> Live Translation</span>
            </div>
          </div>
        )}

        {step === 'scanning' && (
          <div className="p-12 text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-50" />
              <div 
                className="absolute inset-0 rounded-full border-4 border-emerald-500 transition-all duration-100"
                style={{ clipPath: `polygon(50% 50%, -50% -50%, ${progress}% -50%, ${progress}% 150%, -50% 150%)` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Utensils className="w-10 h-10 text-emerald-500 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Menu...</h3>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-400 font-medium tracking-wide">
              {progress < 40 ? 'Detecting text...' : progress < 70 ? 'Translating ingredients...' : 'Generating dish details...'}
            </p>
          </div>
        )}

        {step === 'results' && (
          <div className="flex flex-col h-[70vh]">
            <div className="p-6 bg-emerald-600 text-white shrink-0">
              <div className="flex items-center gap-2 text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">
                <CheckCircle2 className="w-3 h-3" /> Analysis Complete
              </div>
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>Thai Cuisine Details</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {MOCK_RESULTS.map((res, idx) => (
                <div key={idx} className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-4 animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase mb-0.5">{res.thai}</div>
                      <h4 className="font-bold text-gray-900">{res.english}</h4>
                    </div>
                    <span className="text-xs font-black bg-white px-2 py-1 rounded-lg shadow-sm">{res.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{res.desc}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 shrink-0">
              <button 
                onClick={() => { setStep('camera'); setProgress(0); }}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors text-sm"
              >
                Scan Another Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
