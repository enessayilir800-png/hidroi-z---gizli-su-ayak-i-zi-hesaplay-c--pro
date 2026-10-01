import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const MobileStatusBar: React.FC = () => {
  const { isDark } = useTheme();
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold select-none shrink-0 z-30 backdrop-blur-md border-b transition-colors ${
      isDark
        ? 'bg-[#0A1122]/90 border-[#16243D] text-slate-300'
        : 'bg-[#EEF4F9]/90 border-slate-200 text-slate-700'
    }`}>
      <span className="tabular-nums font-mono text-[13px] font-bold">{time}</span>

      {/* Dynamic Island element */}
      <div className={`w-20 h-4 rounded-full flex items-center justify-center transition-colors ${
        isDark ? 'bg-[#060A13]' : 'bg-slate-900'
      }`}>
        <div className="w-2 h-2 rounded-full bg-sky-400"></div>
      </div>

      <div className="flex items-center gap-1.5">
        <Wifi className="w-3.5 h-3.5" />
        <span className="text-[10px] font-mono font-bold">5G</span>
        <Battery className="w-4 h-4 text-emerald-500" />
      </div>
    </div>
  );
};
