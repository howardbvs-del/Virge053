
import React, { useEffect, useRef, useState } from 'react';

interface VideoFeedProps {
  stream: MediaStream | null;
  isRecording: boolean;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ stream, isRecording }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [bitrate, setBitrate] = useState('0.0');

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Simulate a fluctuating bitrate for tactical feel
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setBitrate((Math.random() * (4.5 - 3.2) + 3.2).toFixed(1));
    }, 1500);
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!stream) return null;

  return (
    <div className="absolute top-4 right-4 z-50 w-36 h-48 sm:w-48 sm:h-64 bg-slate-950 rounded-lg border-2 border-red-600 overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.3)] animate-in fade-in zoom-in duration-300">
      {/* Real-time Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover grayscale contrast-125 brightness-90 saturate-50"
      />
      
      {/* Digital Static Overlay (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      {/* HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2">
        {/* Top HUD Row */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 bg-red-600/90 px-1.5 py-0.5 rounded-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[9px] mono font-black text-white tracking-widest uppercase">Live Broadcast</span>
            </div>
            <div className="text-[7px] mono text-white/70 font-bold bg-black/40 px-1 rounded-sm w-fit mt-0.5">
              SOURCE: FRONT_CAM_01
            </div>
          </div>
          <div className="bg-black/60 px-1 rounded border border-white/20">
            <span className="text-[8px] mono text-white/80 font-bold">{bitrate} Mbps</span>
          </div>
        </div>
        
        {/* Center Target (Tactical) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40">
          <div className="relative w-8 h-8">
            <div className="absolute top-0 left-0 w-2 h-0.5 bg-red-500" />
            <div className="absolute top-0 left-0 w-0.5 h-2 bg-red-500" />
            <div className="absolute top-0 right-0 w-2 h-0.5 bg-red-500" />
            <div className="absolute top-0 right-0 w-0.5 h-2 bg-red-500" />
            <div className="absolute bottom-0 left-0 w-2 h-0.5 bg-red-500" />
            <div className="absolute bottom-0 left-0 w-0.5 h-2 bg-red-500" />
            <div className="absolute bottom-0 right-0 w-2 h-0.5 bg-red-500" />
            <div className="absolute bottom-0 right-0 w-0.5 h-2 bg-red-500" />
          </div>
        </div>

        {/* Bottom HUD Row */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-end bg-black/40 p-1 rounded backdrop-blur-sm border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-[8px] mono text-red-500 font-black animate-pulse uppercase">Recording...</span>
              <span className="text-[6px] mono text-white/40 tracking-tighter">ENCRYPTION: RSA-4096</span>
            </div>
            <div className="text-right">
              <div className="text-[7px] mono text-white/60 font-bold">PT: 00:0{Math.floor(Date.now()/1000) % 60}</div>
              <div className="text-[6px] mono text-white/30 uppercase">{new Date().toLocaleTimeString('en-GB', { hour12: false })}</div>
            </div>
          </div>
          {/* Progress bar simulation */}
          <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 animate-[progress_10s_linear_infinite]" style={{ width: '45%' }} />
          </div>
        </div>
      </div>

      {/* Tactical Scanning Scanline */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-4 w-full animate-[scan_3s_linear_infinite] pointer-events-none" />

      <style>{`
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default VideoFeed;
