
import React from 'react';

const SideNav: React.FC = () => {
  const socials = [
    { name: 'X', color: 'bg-white/10', icon: '𝕏' },
    { name: 'IG', color: 'bg-pink-600/20', icon: '📸' },
    { name: 'FB', color: 'bg-blue-600/20', icon: '👤' },
    { name: 'WA', color: 'bg-emerald-600/20', icon: '💬' },
  ];

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1 pl-1">
      {socials.map((social) => (
        <button
          key={social.name}
          className={`w-10 h-10 ${social.color} border border-white/10 rounded-r-lg flex items-center justify-center hover:w-12 transition-all group backdrop-blur-md`}
          title={`Link ${social.name}`}
        >
          <span className="text-xs font-black text-white/50 group-hover:text-white">{social.icon}</span>
        </button>
      ))}
      <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-red-500/50 to-transparent mx-auto mt-2" />
    </div>
  );
};

export default SideNav;
