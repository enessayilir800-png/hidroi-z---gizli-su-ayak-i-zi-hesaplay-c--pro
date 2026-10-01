import React from 'react';
import { Camera, ShoppingBag, ArrowLeftRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type NavTab = 'photo' | 'basket' | 'compare';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  basketCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, basketCount }) => {
  const { isDark } = useTheme();

  const tabs: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'photo', label: 'Fotoğraf & Tara', icon: Camera },
    { id: 'basket', label: 'Günlük Sepet', icon: ShoppingBag, badge: basketCount },
    { id: 'compare', label: 'Karşılaştır', icon: ArrowLeftRight },
  ];

  return (
    <nav className={`h-16 border-t grid grid-cols-3 items-center shrink-0 z-30 select-none pb-safe backdrop-blur-md md:hidden transition-colors duration-200 ${
      isDark
        ? 'bg-[#0A1122]/95 border-[#16243D]'
        : 'bg-[#EEF4F9]/95 border-slate-200'
    }`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className="min-h-[48px] flex flex-col items-center justify-center relative transition-all group focus:outline-none"
            aria-label={tab.label}
          >
            <div
              className={`p-1.5 rounded-xl transition-all relative ${
                isActive
                  ? isDark
                    ? 'text-sky-300 bg-[#13223E] shadow-xs'
                    : 'text-sky-700 bg-white shadow-xs'
                  : isDark
                    ? 'text-slate-400 group-hover:text-slate-200'
                    : 'text-slate-500 group-hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform" />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 bg-sky-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center ring-2 ring-[#0A1122]">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] font-medium tracking-tight whitespace-nowrap transition-colors mt-0.5 ${
                isActive
                  ? isDark
                    ? 'text-sky-300 font-bold'
                    : 'text-sky-800 font-bold'
                  : isDark
                    ? 'text-slate-400'
                    : 'text-slate-600'
              }`}
            >
              {tab.label}
            </span>
            {isActive && (
              <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isDark ? 'bg-sky-400' : 'bg-sky-600'}`} />
            )}
          </button>
        );
      })}
    </nav>
  );
};
