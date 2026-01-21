
import React from 'react';

interface MarketplaceProps {
  onClose: () => void;
  location: { lat: number, lng: number } | null;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onClose, location }) => {
  const services = [
    { id: 'mrd', name: 'Mr D Food', cat: 'Logistical Support', icon: '🍱', price: 'R49', color: 'border-orange-500' },
    { id: 'uber', name: 'Uber Express', cat: 'Extraction', icon: '🚗', price: 'R85', color: 'border-white' },
    { id: 'bolt', name: 'Bolt Lite', cat: 'Extraction', icon: '🚕', price: 'R60', color: 'border-emerald-500' },
    { id: 'booking', name: 'Booking.com', cat: 'Lodging / Base', icon: '🏨', price: 'VARIES', color: 'border-blue-700' },
    { id: 'lift', name: 'Lift Air', cat: 'Aviation Link', icon: '✈️', price: 'R1200', color: 'border-blue-500' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300 overflow-y-auto">
      <header className="flex justify-between items-start mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">Strike Team Services</h2>
          <p className="text-[10px] mono text-slate-500 font-bold uppercase tracking-widest">In-App Logistics Interface</p>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white border border-slate-800">
          ✕
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 content-start pb-20">
        {services.map(service => (
          <div key={service.id} className={`p-4 rounded-2xl bg-slate-900/50 border-2 ${service.color}/20 hover:border-white/50 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden h-32`}>
             <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
               <span className="text-3xl">{service.icon}</span>
             </div>
             <div>
               <div className="text-[8px] mono font-bold text-slate-500 uppercase mb-1">{service.cat}</div>
               <div className="text-lg font-black text-white leading-tight">{service.name}</div>
             </div>
             <div className="mt-auto flex justify-between items-end">
                <span className="text-[10px] mono font-bold text-slate-300">ACTIVATE</span>
                <span className="text-sm font-black text-white">{service.price}</span>
             </div>
          </div>
        ))}
      </div>

      <footer className="mt-auto border-t border-slate-900 pt-6 shrink-0">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] mono font-black text-emerald-500 uppercase tracking-widest">GPS_SYNC_ACTIVE</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Services will deploy directly to {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}</p>
        </div>
        <button className="w-full bg-red-600 py-4 rounded-xl font-black text-white tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-900/30">
          AUTHORIZE LOGISTICAL OVERLAY
        </button>
      </footer>
    </div>
  );
};

export default Marketplace;
