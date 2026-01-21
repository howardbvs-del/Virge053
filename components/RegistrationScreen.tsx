
import React, { useState } from 'react';
import { RegistrationData } from '../types';

interface RegistrationScreenProps {
  onComplete: (data: RegistrationData) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    email: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.idNumber || !formData.phone || !formData.email) {
      setError('ALL SECURITY FIELDS REQUIRED');
      return;
    }

    setError('');
    setIsVerifying(true);

    // Simulate high-stakes verification (RICA, ID Check, Email validation)
    setTimeout(() => {
      onComplete({
        ...formData,
        isRicaVerified: true
      });
      setIsVerifying(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background HUD elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(#f00 1px, transparent 1px), linear-gradient(90deg, #f00 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>
      
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
        <div className="scanline opacity-20" />
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tighter text-red-600 leading-none mb-2">IDENTITY ENROLLMENT</h1>
          <p className="text-[10px] mono text-slate-500 font-bold uppercase tracking-[0.2em]">Guardian Angel Protocol V.5.2</p>
        </header>

        {isVerifying ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
            <h2 className="text-white font-black text-xl mb-1">AUTHENTICATING...</h2>
            <div className="space-y-1 text-[10px] mono text-slate-500 font-bold uppercase">
              <p className="animate-pulse">Checking RICA Database...</p>
              <p className="animate-pulse delay-75">Validating National ID Registry...</p>
              <p className="animate-pulse delay-150">Scanning for Duplicate Cell Links...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] mono font-bold text-slate-500 uppercase">Legal Full Name</label>
              <input
                type="text"
                placeholder="EX: VIRGIL BARKER"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white font-bold placeholder:text-slate-700 focus:border-red-600 outline-none transition-colors"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] mono font-bold text-slate-500 uppercase">National ID Number (Verified)</label>
              <input
                type="text"
                placeholder="13-DIGIT UNIQUE IDENTIFIER"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white font-bold placeholder:text-slate-700 focus:border-red-600 outline-none transition-colors"
                value={formData.idNumber}
                onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] mono font-bold text-slate-500 uppercase">RICA Registered Phone</label>
              <input
                type="tel"
                placeholder="+27 (XX) XXX-XXXX"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white font-bold placeholder:text-slate-700 focus:border-red-600 outline-none transition-colors"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] mono font-bold text-slate-500 uppercase">Valid Security Email</label>
              <input
                type="email"
                placeholder="SECURE_ID@PROVIDER.COM"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white font-bold placeholder:text-slate-700 focus:border-red-600 outline-none transition-colors"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {error && <p className="text-red-500 text-[10px] mono font-bold text-center mt-2 animate-pulse">{error}</p>}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 active:scale-[0.98] transition-all text-white py-4 rounded-xl font-black text-lg tracking-tighter mt-4 shadow-xl shadow-red-900/20"
            >
              COMPLETE SECURE ENROLLMENT
            </button>

            <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-lg mt-6">
              <p className="text-[8px] mono text-red-500 text-center uppercase leading-tight font-black">
                LEGAL WARNING: By registering, you acknowledge that willful misuse of the SOS broadcast feature is a punishable criminal offense subject to statutory fines and civil liability. All alerts are logged with ID and RICA-verified metadata.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationScreen;
