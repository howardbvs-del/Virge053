
import React, { useState } from 'react';

interface DebriefModalProps {
  onSumbit: (reason: string) => void;
}

const DebriefModal: React.FC<DebriefModalProps> = ({ onSumbit }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 5) return;
    onSumbit(reason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
        
        <h2 className="text-xl font-black text-white tracking-tighter mb-2 uppercase">INCIDENT DEBRIEF</h2>
        <p className="text-[10px] mono text-slate-400 font-bold mb-4 leading-tight uppercase">
          SOS alert was called off. You are required by law to provide a brief explanation for this system trigger to avoid automatic penalty assessment.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            required
            autoFocus
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white font-bold text-sm placeholder:text-slate-700 focus:border-red-600 outline-none h-24 resize-none"
            placeholder="EX: TESTED BY MISTAKE / DEVICE FELL"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />

          <button
            type="submit"
            disabled={reason.trim().length < 5}
            className="w-full bg-slate-100 hover:bg-white text-black py-3 rounded-xl font-black text-sm tracking-widest disabled:opacity-30 transition-all uppercase"
          >
            Submit Explanation
          </button>
        </form>
        
        <p className="mt-4 text-[8px] mono text-slate-600 font-bold text-center uppercase">
          PROTOCOL_REF: ACC_CALL_OFF_LOG_77A
        </p>
      </div>
    </div>
  );
};

export default DebriefModal;
