import React from 'react';
import { Droplet, ShoppingBag, Smartphone, Monitor, Moon, Sun, Camera, ArrowLeftRight } from 'lucide-react';
import { formatWaterLiters } from '../utils/waterCalculations';
import { useTheme } from '../context/ThemeContext';
import { NavTab } from './BottomNav';

interface TopHeaderProps {
  totalBasketLiters: number;
  basketCount: number;
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenBasket: () => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  totalBasketLiters,
  basketCount,
  activeTab,
  onChangeTab,
  onOpenBasket,
  isDeviceFrame,
  onToggleDeviceFrame,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`h-16 px-4 sm:px-6 border-b backdrop-blur-md flex items-center justify-between shrink-0 z-30 transition-colors duration-200 ${
      isDark
        ? 'bg-[#0A1122]/95 border-[#16243D] text-white'
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xs'
    }`}>
      {/* Brand Logo & Wordmark */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onChangeTab('photo')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/25">
          <Droplet className="w-5 h-5 fill-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-extrabold tracking-tight font-['Outfit'] leading-none">
              Hidroİz
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30">
              Web & Mobil
            </span>
          </div>
          <span className={`text-[11px] font-medium hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Gıda ve Eşyaların Gizli Su Ayak İzi
          </span>
        </div>
      </div>

      {/* Desktop Navigation Links (Visible on md+ screens) */}
      <nav className="hidden md:flex items-center gap-1 bg-[#101A2E]/60 p-1 rounded-xl border border-[#1C2C47]">
        <button
          type="button"
          onClick={() => onChangeTab('photo')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'photo'
              ? 'bg-sky-500 text-slate-950 shadow-xs'
              : isDark
                ? 'text-slate-300 hover:text-white hover:bg-[#16243D]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Fotoğraf & AI Analiz</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('basket')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'basket'
              ? 'bg-sky-500 text-slate-950 shadow-xs'
              : isDark
                ? 'text-slate-300 hover:text-white hover:bg-[#16243D]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Günlük Su Sepeti</span>
          {basketCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-sky-400 text-slate-950">
              {basketCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('compare')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'compare'
              ? 'bg-sky-500 text-slate-950 shadow-xs'
              : isDark
                ? 'text-slate-300 hover:text-white hover:bg-[#16243D]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Kıyaslama Simülatörü</span>
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Web / Phone Frame Preview Switcher */}
        <button
          type="button"
          onClick={onToggleDeviceFrame}
          title={isDeviceFrame ? 'Geniş Web Görünümüne Geç' : 'Mobil Telefon Çerçevesine Geç'}
          className={`h-9 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isDark
              ? 'text-slate-300 hover:text-white bg-[#101A2E] hover:bg-[#16243D] border-[#1C2C47]'
              : 'text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200'
          }`}
          aria-label="Cihaz görünümünü değiştir"
        >
          {isDeviceFrame ? (
            <>
              <Monitor className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline text-[11px]">Web Ekranı</span>
            </>
          ) : (
            <>
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline text-[11px]">Mobil Çerçeve</span>
            </>
          )}
        </button>

        {/* Theme Switcher Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors border ${
            isDark
              ? 'text-amber-300 hover:text-amber-200 bg-[#101A2E] hover:bg-[#16243D] border-[#1C2C47]'
              : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200'
          }`}
          aria-label="Tema Değiştir"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Live Basket Button */}
        <button
          type="button"
          onClick={() => onChangeTab('basket')}
          className={`min-h-[38px] px-3 py-1 rounded-xl active:scale-[0.98] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs border ${
            isDark
              ? 'bg-[#101A2E] hover:bg-[#16243D] border-[#1C2C47] text-slate-100'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
          }`}
          aria-label="Bugünkü su sepetini görüntüle"
        >
          <div className="relative">
            <ShoppingBag className={`w-4 h-4 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
            {basketCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-sky-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center ring-2 ring-[#0A1122]">
                {basketCount}
              </span>
            )}
          </div>
          <span className={`tabular-nums font-bold text-xs font-mono ${
            isDark ? 'text-sky-300' : 'text-sky-700'
          }`}>
            {totalBasketLiters > 0 ? formatWaterLiters(totalBasketLiters) : '0 L'}
          </span>
        </button>
      </div>
    </header>
  );
};
