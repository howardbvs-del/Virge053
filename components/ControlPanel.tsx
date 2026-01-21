
import React, { useEffect, useState } from 'react';
import { AppStatus, IntelligenceReport } from '../types';

interface ControlPanelProps {
  status: AppStatus;
  onSOS: () => void;
  onCancel: () => void;
  onScan: () => void;
  onOpenMarketplace: () => void;
  report: IntelligenceReport | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ status, onSOS, onCancel, onScan, onOpenMarketplace, report }) => {
  const [countdown, setCountdown] = useState(5);
  const isSOS = status === AppStatus.SOS_ACTIVE;
  const isPending = status === AppStatus.SOS_PENDING;
  const isScanning = status === AppStatus.SCANNING;

  useEffect(() => {
    let timer: number;
    if (isPending) {
      setCountdown(5);
      timer = window.setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPending]);

  return (
    <div className="flex flex-col gap-3 w-full p-4 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-50">
      
      {/* Risk Assessment / Report Summary */}
      {(report) && !isSOS && !isPending && status !== AppStatus.DEBRIEFING && (
        <div className={`p-3 rounded-xl border mb-1 max-h-32 overflow-y-auto ${
          report.riskLevel === 'CRITICAL' ? 'border-red-600/50 bg-red-950/10' : 
          report.riskLevel === 'HIGH' ? 'border-orange-600/50 bg-orange-950/10' : 
          'border-slate-700 bg-slate-800/40'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] mono font-bold text-slate-400 uppercase tracking-widest">Tactical Report</span>
            <span className={`text-[10px] mono font-bold px-2 py-0.5 rounded ${
              report.riskLevel === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              {report.riskLevel}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-200 mb-2 leading-tight">{report.summary}</p>
        </div>
      )}

      {/* Main Action Area */}
      <div className="flex flex-col gap-2">
        {status === AppStatus.IDLE || status === AppStatus.SCANNING ? (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={onScan}
                disabled={isScanning}
                className={`flex-1 py-4 rounded-xl mono font-bold text-[10px] transition-all border ${
                  isScanning 
                    ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 active:scale-95 shadow-inner'
                }`}
              >
                {isScanning ? 'SCAN...' : 'SCAN'}
              </button>
              <button
                onClick={onOpenMarketplace}
                className="flex-1 py-4 rounded-xl mono font-bold text-[10px] bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-900/50 transition-all flex items-center justify-center gap-2"
              >
                <span>📦</span> SERVICES
              </button>
              <button
                onClick={onSOS}
                className="flex-[2] py-4 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 transition-all text-white font-black text-lg tracking-tighter shadow-xl shadow-red-900/40 flex items-center justify-center gap-3"
              >
                S.O.S
              </button>
            </div>
            <p className="text-[7px] mono text-red-500 font-bold text-center uppercase tracking-wider animate-pulse">
              Misuse is a criminal offense subject to legal fines.
            </p>
          </>
        ) : isPending ? (
          <button
            onClick={onCancel}
            className="w-full py-5 rounded-2xl bg-slate-950 border-2 border-red-600 text-white font-black transition-all flex flex-col items-center justify-center gap-1 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 h-full bg-red-600/20 transition-all duration-1000 ease-linear" style={{ width: `${(5 - countdown) * 20}%` }} />
            <span className="text-sm tracking-widest uppercase relative z-10">ABORT SOS BROADCAST</span>
            <span className="text-4xl font-black relative z-10">{countdown}</span>
            <span className="text-[10px] mono text-red-400 relative z-10 font-bold">ACCIDENTAL PRESS? CLICK TO CALL OFF</span>
          </button>
        ) : isSOS ? (
          <button
            onClick={onCancel}
            className="w-full py-5 rounded-2xl bg-slate-950 border border-slate-700 text-red-500 font-black tracking-widest hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl"
          >
            <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
            ABORT SOS ALERT
          </button>
        ) : status === AppStatus.DEBRIEFING ? (
          <div className="w-full py-5 rounded-2xl bg-slate-800/50 border border-slate-700 text-slate-400 font-bold text-center mono text-xs uppercase italic">
            Waiting for incident explanation...
          </div>
        ) : null}
      </div>

      <div className="flex justify-between px-2 text-[8px] mono text-slate-600 uppercase tracking-tighter font-bold">
        <span>ENCRYPTION: AES-256-GCM</span>
        <span>PEERS DETECTED: 142</span>
        <span>FINE_NOTICE: APPLICABLE</span>
      </div>
    </div>
  );
};

export default ControlPanel;
