import React, { useState } from 'react';
import { BasketItem } from '../types/water';
import { formatWaterLiters, calculateBasketTotals, calculateEquivalents } from '../utils/waterCalculations';
import { WaterGauge } from './WaterGauge';
import { X, Trash2, Plus, Minus, Share2, Check, Sparkles, ShowerHead } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BasketSheetProps {
  isOpen: boolean;
  onClose: () => void;
  basket: BasketItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearBasket: () => void;
  isInlineView?: boolean;
}

export const BasketSheet: React.FC<BasketSheetProps> = ({
  isOpen,
  onClose,
  basket,
  onUpdateQuantity,
  onRemoveItem,
  onClearBasket,
  isInlineView = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen && !isInlineView) return null;

  const totals = calculateBasketTotals(basket);
  const equiv = calculateEquivalents(totals.total);
  const dailyBenchmark = 4500;
  const isUnderBenchmark = totals.total > 0 && totals.total <= dailyBenchmark;

  const handleShare = () => {
    const text = `💧 Hidroİz ile hesapladığım günlük sanal su tüketimim: ${formatWaterLiters(totals.total)}!\n🚿 Bu miktar yaklaşık ${equiv.showers} kez duş almaya denk.\nGıdaların ve giysilerin gizli su ayak izini keşfedin!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const content = (
    <div className="space-y-4">
      {basket.length === 0 ? (
        <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 mx-auto flex items-center justify-center text-3xl shadow-xs">
            💧
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Sepetinizde Henüz Ürün Yok
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Fotoğraf çekerek veya katalogdan yediğiniz/giydiğiniz şeyleri ekleyin, günlük toplam gizli su tüketiminizi görün.
          </p>
        </div>
      ) : (
        <>
          {/* Grand Total Summary Card */}
          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-800">
                Bugünkü Toplam Sanal Su
              </span>
              {isUnderBenchmark && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Ortalamanın Altında
                </span>
              )}
            </div>

            <div className="text-3xl font-extrabold text-sky-800 font-['Outfit'] tracking-tight">
              {formatWaterLiters(totals.total)}
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-sky-100 text-xs flex items-center justify-between text-slate-600">
              <span>Türkiye Günlük Ortalaması:</span>
              <span className="font-bold text-slate-900">~4.500 Litre / gün</span>
            </div>

            {/* Gauge */}
            <WaterGauge
              totalLiters={totals.total}
              greenLiters={totals.green}
              blueLiters={totals.blue}
              greyLiters={totals.grey}
              showEquivalents={true}
            />
          </div>

          {/* Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Eklenen Kalemler ({basket.length})
              </h4>
              <button
                onClick={onClearBasket}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sepeti Temizle</span>
              </button>
            </div>

            <div className="space-y-2">
              {basket.map((bItem) => {
                const itemTotal = bItem.item.totalLiters * bItem.quantity;
                return (
                  <div
                    key={bItem.item.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl select-none shrink-0" role="img" aria-label={bItem.item.name}>
                        {bItem.item.emoji}
                      </span>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {bItem.item.name}
                        </h5>
                        <div className="text-[11px] text-slate-500">
                          <span className="text-sky-700 font-bold font-mono">
                            {formatWaterLiters(itemTotal)}
                          </span>
                          {' · '}
                          <span>{bItem.quantity} x {bItem.item.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 shrink-0">
                      <button
                        onClick={() => {
                          if (bItem.quantity <= bItem.item.stepQty) {
                            onRemoveItem(bItem.item.id);
                          } else {
                            onUpdateQuantity(bItem.item.id, bItem.quantity - bItem.item.stepQty);
                          }
                        }}
                        className="min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-600 hover:text-slate-900 rounded"
                        aria-label="Azalt"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-extrabold text-slate-900 tabular-nums">
                        {bItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(bItem.item.id, bItem.quantity + bItem.item.stepQty)}
                        className="min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-600 hover:text-slate-900 rounded"
                        aria-label="Artır"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Share CTA */}
          <div className="pt-2">
            <button
              onClick={handleShare}
              className="w-full min-h-[46px] rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Özet Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-sky-600" />
                  <span>Sonucu Kopyala & Paylaş</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );

  // If used as an embedded screen tab
  if (isInlineView) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Bugünkü Su Sepetim
            </h2>
            <span className="text-xs text-slate-500">
              Günlük tükettiğin gıda ve kıyafetlerin toplamı
            </span>
          </div>
        </div>
        {content}
      </div>
    );
  }

  // If used as slide-up drawer
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white border-t border-slate-200 rounded-t-3xl max-h-[88vh] flex flex-col z-10 shadow-2xl overflow-hidden">
        {/* Drag handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Bugünkü Su Tüketimim
            </h2>
            <span className="text-xs text-slate-500">{basket.length} kalem ürün</span>
          </div>

          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-5 py-4 overflow-y-auto flex-1">
          {content}
        </div>
      </div>
    </div>
  );
};
