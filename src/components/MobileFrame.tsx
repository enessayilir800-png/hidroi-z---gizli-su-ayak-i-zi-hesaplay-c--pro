import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface MobileFrameProps {
  children: React.ReactNode;
  isDeviceFrame: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isDeviceFrame }) => {
  const { isDark } = useTheme();

  // Web / Responsive Desktop Mode (Default and primary mode for Web)
  if (!isDeviceFrame) {
    return (
      <div className={`w-full min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-[#060B14] text-slate-100' : 'bg-[#F1F5F9] text-slate-900'
      }`}>
        <div className="w-full max-w-6xl mx-auto min-h-screen flex flex-col shadow-sm">
          {children}
        </div>
      </div>
    );
  }

  // Optional Smartphone Chassis Preview Mode
  return (
    <div className={`w-full min-h-screen flex items-center justify-center p-0 sm:p-6 overflow-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-b from-[#040810] via-[#08101E] to-[#040810]'
        : 'bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200'
    }`}>
      {/* Smartphone Outer Chassis */}
      <div className={`relative w-full max-w-[420px] h-[100dvh] sm:h-[860px] sm:rounded-[44px] sm:p-3 flex flex-col overflow-hidden transition-all duration-300 ${
        isDark
          ? 'bg-[#0B1426] sm:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(30,50,80,0.8),0_0_0_10px_#070D18]'
          : 'bg-white sm:shadow-[0_25px_70px_-15px_rgba(15,23,42,0.15),0_0_0_1px_rgba(203,213,225,0.8),0_0_0_10px_#e2e8f0]'
      }`}>
        {/* Screen Bezel & Content Area */}
        <div className={`w-full h-full sm:rounded-[36px] overflow-hidden flex flex-col relative border transition-colors duration-300 ${
          isDark
            ? 'bg-[#0A1122] border-[#16243D]'
            : 'bg-[#EEF4F9] border-slate-300/80'
        }`}>
          {children}

          {/* Home bar indicator for phone preview */}
          <div className={`w-full py-1.5 flex justify-center select-none shrink-0 pointer-events-none border-t transition-colors ${
            isDark
              ? 'bg-[#0A1122] border-[#16243D]'
              : 'bg-[#EEF4F9] border-slate-200'
          }`}>
            <div className={`w-32 h-1 rounded-full ${
              isDark ? 'bg-slate-700' : 'bg-slate-300'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};
