
import React from 'react';

const AdBanner: React.FC = () => {
  const ads = [
    "SECURE YOUR HOME WITH GUARDIAN PRO: 20% OFF TODAY",
    "TACTICAL GEAR SOLUTIONS - ARMOR PLATES & DRONE RECON",
    "DOWNLOAD ANGEL DEFENSE FOR MAC/PC",
    "LOCAL SAFETY WORKSHOP AT CENTRAL MALL - 18:00 HRS",
    "UPGRADE TO ELITE FOR FASTER SOS RESPONSE TIMES"
  ];

  return (
    <div className="w-full bg-slate-950 border-t border-slate-900 h-6 overflow-hidden flex items-center relative z-40">
      <div className="whitespace-nowrap animate-marquee flex items-center">
        {ads.map((ad, i) => (
          <React.Fragment key={i}>
            <span className="text-[8px] mono font-bold text-slate-500 uppercase px-8">
              {ad}
            </span>
            <span className="text-red-900">•</span>
          </React.Fragment>
        ))}
        {/* Repeat for seamless loop */}
        {ads.map((ad, i) => (
          <React.Fragment key={`repeat-${i}`}>
            <span className="text-[8px] mono font-bold text-slate-500 uppercase px-8">
              {ad}
            </span>
            <span className="text-red-900">•</span>
          </React.Fragment>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdBanner;
