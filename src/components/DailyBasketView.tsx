import React, { useState } from 'react';
import { BasketItem } from '../types/water';
import { formatWaterLiters, calculateBasketTotals, calculateEquivalents } from '../utils/waterCalculations';
import { WaterGauge } from './WaterGauge';
import { useTheme } from '../context/ThemeContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Camera,
  Share2,
  Check,
} from 'lucide-react';

interface DailyBasketViewProps {
  basket: BasketItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearBasket: () => void;
  onGoToScanner: () => void;
}

export const DailyBasketView: React.FC<DailyBasketViewProps> = ({
  basket,
  onUpdateQuantity,
  onRemoveItem,
  onClearBasket,
  onGoToScanner,
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const totals = calculateBasketTotals(basket);
  const equiv = calculateEquivalents(totals.total);
  const dailyBenchmark = 4500;
  const isUnderBenchmark = totals.total > 0 && totals.total <= dailyBenchmark;

  const handleShare = () => {
    const text = `💧 Hidroİz ile hesapladığım bugünkü gizli su tüketimim: ${formatWaterLiters(totals.total)}!\n🚿 Bu miktar yaklaşık ${equiv.showers} kez duş almaya denk.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* Intro Header */}
      <div className={`rounded-2xl p-4 sm:p-5 border flex items-center justify-between transition-colors ${
        isDark ? 'bg-[#101A2E] border-[#1C2C47] shadow-md shadow-sky-950/20' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
            isDark ? 'bg-sky-950 text-sky-400 border border-sky-800/60' : 'bg-sky-50 text-sky-600'
          }`}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-sm sm:text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Bugünkü Su Sepetim
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Gün boyu tükettiğiniz gıda ve eşyaların toplam sanal su ayak izi
            </p>
          </div>
        </div>

        {basket.length > 0 && (
          <button
            type="button"
            onClick={onClearBasket}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isDark
                ? 'text-rose-400 hover:text-rose-300 bg-rose-950/50 hover:bg-rose-950 border border-rose-900/50'
                : 'text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sepeti Boşalt</span>
          </button>
        )}
      </div>

      {basket.length === 0 ? (
        <div className={`py-16 text-center space-y-4 rounded-2xl border p-6 transition-colors max-w-lg mx-auto ${
          isDark ? 'bg-[#101A2E] border-[#1C2C47] text-white' : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
        }`}>
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl border ${
            isDark ? 'bg-[#09101F] border-[#1C2C47]' : 'bg-sky-50 border-sky-100'
          }`}>
            💧
          </div>
          <div>
            <h3 className="text-base font-bold">
              Sepetiniz Henüz Boş
            </h3>
            <p className={`text-xs sm:text-sm max-w-sm mx-auto mt-1 leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Yediğiniz yemeklerin, kahvelerin veya eşyaların fotoğrafını çekin ya da doğrudan adını yazarak sepete ekleyin.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToScanner}
            className="h-11 px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-md shadow-sky-500/20 transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Fotoğraf Çek / AI ile Ekle</span>
          </button>
        </div>
      ) : (
        /* Responsive 2-Column Desktop Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Summary Card (Left on Desktop) */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
              isDark
                ? 'bg-[#101A2E] border-sky-500/30 text-white shadow-lg shadow-sky-950/30'
                : 'bg-sky-50/90 border-sky-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-sky-900'}`}>
                  Toplam Günlük Su İzi
                </span>
                {isUnderBenchmark && (
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Ortalamanın Altında
                  </span>
                )}
              </div>

              <div className={`text-3xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight ${
                isDark ? 'text-sky-400' : 'text-sky-950'
              }`}>
                {formatWaterLiters(totals.total)}
              </div>

              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                isDark
                  ? 'bg-[#09101F] border-[#1C2C47] text-slate-300'
                  : 'bg-white/90 border-sky-100 text-slate-600'
              }`}>
                <span>Türkiye Kişi Başı Ortalama:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ~4.500 L / gün
                </span>
              </div>

              {/* Gauge */}
              <WaterGauge
                totalLiters={totals.total}
                greenLiters={totals.green}
                blueLiters={totals.blue}
                greyLiters={totals.grey}
                showEquivalents={true}
              />

              <button
                type="button"
                onClick={handleShare}
                className={`w-full h-10 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  isDark
                    ? 'bg-[#13223E] hover:bg-[#1A2D50] border-[#1E3355] text-slate-100'
                    : 'bg-white border-sky-200 hover:bg-sky-50 text-sky-800 shadow-2xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Özet Panoya Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-sky-400" />
                    <span>Tüketim Özetimi Paylaş</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Items List (Right on Desktop) */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider px-1 ${
              isDark ? 'text-slate-400' : 'text-slate-700'
            }`}>
              Sepetteki Kalemler ({basket.length})
            </h4>

            <div className="space-y-2.5">
              {basket.map(({ item, quantity }) => {
                const itemTotal = item.totalLiters * quantity;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                      isDark
                        ? 'bg-[#101A2E] border-[#1C2C47] text-white shadow-xs'
                        : 'bg-white border-slate-200/80 shadow-xs text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-2xl sm:text-3xl select-none shrink-0">{item.emoji}</span>
                      <div className="truncate">
                        <h5 className="text-xs sm:text-sm font-bold truncate">
                          {item.name}
                        </h5>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                            {quantity} x {item.unit}
                          </span>
                          <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>·</span>
                          <span className="font-extrabold text-sky-400 font-['Outfit']">
                            {formatWaterLiters(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`flex items-center border rounded-xl p-0.5 ${
                        isDark ? 'bg-[#09101F] border-[#1C2C47]' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-colors ${
                            isDark
                              ? 'text-slate-400 hover:text-white hover:bg-[#13223E]'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                          }`}
                          title="Azalt"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs sm:text-sm font-bold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-colors ${
                            isDark
                              ? 'text-slate-400 hover:text-white hover:bg-[#13223E]'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                          }`}
                          title="Artır"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl transition-colors ${
                          isDark
                            ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-950/40'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
