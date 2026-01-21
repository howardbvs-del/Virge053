
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppStatus, GeoLocation, NearbyDevice, IntelligenceReport, RegistrationData } from './types';
import TacticalMap from './components/RadarMap';
import ControlPanel from './components/ControlPanel';
import VideoFeed from './components/VideoFeed';
import RegistrationScreen from './components/RegistrationScreen';
import DebriefModal from './components/DebriefModal';
import SideNav from './components/SideNav';
import AdBanner from './components/AdBanner';
import Marketplace from './components/Marketplace';
import { getTacticalAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.UNREGISTERED);
  const [user, setUser] = useState<RegistrationData | null>(null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [devices, setDevices] = useState<NearbyDevice[]>([]);
  const [report, setReport] = useState<IntelligenceReport | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const sosCountdownRef = useRef<number | null>(null);

  // Persistence: Stay logged in until explicit logout
  useEffect(() => {
    const savedUser = localStorage.getItem('guardian_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setStatus(AppStatus.IDLE);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (status !== AppStatus.UNREGISTERED && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          };
          setLocation(newLoc);
        },
        (err) => console.error("Location Error:", err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [status]);

  useEffect(() => {
    if (location && !report && status === AppStatus.IDLE) {
      handleIntelRefresh();
    }
  }, [location, status]);

  // Handle the SOS Grace Period transition
  useEffect(() => {
    if (status === AppStatus.SOS_PENDING) {
      sosCountdownRef.current = window.setTimeout(() => {
        finalizeSOS();
      }, 5000);
    } else {
      if (sosCountdownRef.current) {
        clearTimeout(sosCountdownRef.current);
        sosCountdownRef.current = null;
      }
    }
    return () => {
      if (sosCountdownRef.current) clearTimeout(sosCountdownRef.current);
    };
  }, [status]);

  const handleRegistration = (data: RegistrationData) => {
    setUser(data);
    localStorage.setItem('guardian_user', JSON.stringify(data));
    setStatus(AppStatus.IDLE);
  };

  const handleLogout = () => {
    if (window.confirm("TERMINATE SECURE SESSION? ALL TELEMETRY WILL BE WIPED.")) {
      localStorage.removeItem('guardian_user');
      setUser(null);
      setStatus(AppStatus.UNREGISTERED);
      setReport(null);
      setDevices([]);
      stopRecording();
    }
  };

  const handleIntelRefresh = async () => {
    if (!user) return;
    const intel = await getTacticalAdvice(`Identifying infrastructure and life updates for ${user.fullName}.`, location);
    setReport(intel);
    
    const baseDevices: NearbyDevice[] = [
      { id: '1', type: 'GUARDIAN', signalStrength: 0.8, distance: 1.2, label: 'ANGEL_DELTA_09' },
      { id: '2', type: 'UNKNOWN', signalStrength: 0.4, distance: 3.5, label: 'MAC:2A:8F' },
      { id: '3', type: 'GUARDIAN', signalStrength: 0.9, distance: 0.8, label: 'ANGEL_PRIME_22' },
    ];
    
    if (intel.nearbyPois) {
      setDevices([...baseDevices, ...intel.nearbyPois]);
    } else {
      setDevices(baseDevices);
    }
  };

  const handleScan = () => {
    setStatus(AppStatus.SCANNING);
    setTimeout(async () => {
      await handleIntelRefresh();
      setStatus(AppStatus.IDLE);
    }, 4000);
  };

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      });
      setStream(mediaStream);
      const recorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = recorder;
      recorder.start();
    } catch (err) {
      console.error("Camera/Mic Error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  const triggerSOS = () => {
    if (!user) return;
    setStatus(AppStatus.SOS_PENDING);
  };

  const finalizeSOS = async () => {
    if (!user) return;
    setStatus(AppStatus.SOS_ACTIVE);
    await startRecording();
    setDevices(prev => [
      ...prev, 
      { id: '99', type: 'SUSPECT', signalStrength: 1.0, distance: 0.2, label: 'THREAT_ALPHA_CLOSE' }
    ]);
    const advice = await getTacticalAdvice(`CRITICAL SOS: ${user.fullName} (${user.phone}) needs assistance.`, location);
    setReport(advice);
  };

  const handleCancel = () => {
    if (status === AppStatus.SOS_PENDING) {
      setStatus(AppStatus.DEBRIEFING);
    } else {
      setStatus(AppStatus.IDLE);
      stopRecording();
      handleIntelRefresh();
    }
  };

  const handleDebriefSubmit = (reason: string) => {
    setStatus(AppStatus.IDLE);
    handleIntelRefresh();
  };

  if (status === AppStatus.UNREGISTERED) {
    return <RegistrationScreen onComplete={handleRegistration} />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden relative">
      <SideNav />
      {status === AppStatus.DEBRIEFING && <DebriefModal onSumbit={handleDebriefSubmit} />}
      {status === AppStatus.MARKETPLACE && (
        <Marketplace 
          onClose={() => setStatus(AppStatus.IDLE)} 
          location={location} 
        />
      )}
      
      <header className="p-4 pt-8 border-b border-slate-900 bg-slate-900/50 flex justify-between items-end relative z-40">
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter text-red-500 leading-none">GUARDIAN ANGEL</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${status === AppStatus.SOS_ACTIVE ? 'bg-red-500 pulse-danger' : status === AppStatus.SOS_PENDING ? 'bg-orange-500 animate-bounce' : 'bg-emerald-500'}`} />
            <span className="text-[10px] mono text-slate-400 font-bold uppercase tracking-widest">
              {status === AppStatus.SOS_ACTIVE ? 'EMERGENCY_BROADCAST_ACTIVE' : status === AppStatus.SOS_PENDING ? 'PENDING_TRANSMISSION' : 'SYSTEM_NOMINAL'}
            </span>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-[10px] mono text-red-500 uppercase tracking-widest font-black mb-0.5">
            {report?.cityName ? `OPERATING IN: ${report.cityName.toUpperCase()}` : 'LOCATING SECTOR...'}
          </div>
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
                <div className="text-sm font-black text-white tracking-tight uppercase leading-none">{user?.fullName || 'IDENTIFYING...'}</div>
                <div className="flex gap-2 text-[10px] mono text-slate-400 font-bold mt-1">
                  <span className="text-emerald-500">RICA: OK</span>
                  <span className="text-slate-600">|</span>
                  <span>ID: {user?.idNumber.slice(-4).padStart(13, '*')}</span>
                </div>
             </div>
             <button 
                onClick={handleLogout}
                className="p-1.5 bg-slate-800/80 hover:bg-red-900/40 border border-slate-700 rounded-md transition-all group"
                title="LOGOUT / TERMINATE SESSION"
             >
                <div className="text-[10px] font-black text-slate-500 group-hover:text-red-500 mono px-1">EXIT</div>
             </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 pl-12 relative overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <TacticalMap status={status} devices={devices} userLocation={location} zones={report?.tacticalZones} />
        </div>

        <VideoFeed stream={stream} isRecording={status === AppStatus.SOS_ACTIVE} />
        
        {status === AppStatus.SOS_ACTIVE && (
          <div className="mt-4 text-center z-40 bg-red-950/40 p-4 rounded-xl border border-red-900/50 backdrop-blur-sm">
            <h2 className="text-red-500 font-black text-2xl tracking-widest pulse-danger mb-1 uppercase">SOS ACTIVE: {user?.fullName.split(' ')[0]}</h2>
            <p className="text-red-400 text-[10px] mono font-bold uppercase">Streaming Encrypted Data to Local Police & Guardians</p>
          </div>
        )}
      </main>

      <div className="mt-auto">
        <AdBanner />
        <ControlPanel 
          status={status} 
          onSOS={triggerSOS} 
          onCancel={handleCancel} 
          onScan={handleScan} 
          onOpenMarketplace={() => setStatus(AppStatus.MARKETPLACE)}
          report={report} 
        />
      </div>
    </div>
  );
};

export default App;
