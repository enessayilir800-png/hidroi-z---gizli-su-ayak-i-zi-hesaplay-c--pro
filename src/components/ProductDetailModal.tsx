import React, { useState } from 'react';
import { WaterItem } from '../types/water';
import { WaterGauge } from './WaterGauge';
import { formatWaterLiters } from '../utils/waterCalculations';
import { X, Sparkles, Plus, Minus, ArrowRight } from 'lucide-react';

interface ProductDetailModalProps {
  item: WaterItem | null;
  onClose: () => void;
  onAddWithQuantity: (item: WaterItem, quantity: number) => void;
  currentQuantity: number;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onAddWithQuantity,
  currentQuantity,
}) => {
  if (!item) return null;

  const [qty, setQty] = useState(currentQuantity > 0 ? currentQuantity : item.defaultQty);

  const totalCalculatedLiters = item.totalLiters * qty;
  const greenCalculated = item.greenWater * qty;
  const blueCalculated = item.blueWater * qty;
  const greyCalculated = item.greyWater * qty;

  const handleIncrement = () => {
    if (qty < item.maxQty) setQty(prev => prev + item.stepQty);
  };

  const handleDecrement = () => {
    if (qty > item.stepQty) setQty(prev => Math.max(item.stepQty, prev - item.stepQty));
  };

  const handleConfirm = () => {
    onAddWithQuantity(item, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-white border-t border-slate-200 rounded-t-3xl max-h-[85vh] flex flex-col z-10 shadow-2xl overflow-hidden">
        {/* Drag handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl select-none" role="img" aria-label={item.name}>
              {item.emoji}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {item.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Birim: {item.unit}</span>
                <span aria-hidden="true">·</span>
                <span className="text-sky-600 font-semibold">{item.tag}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1 text-slate-700">
          {/* Main Figure */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-center">
            <span className="text-xs text-sky-800 font-medium block mb-1">
              {qty} {item.unit} için Toplam Sanal Su Ayak İzi
            </span>
            <div className="text-3xl font-extrabold text-sky-700 tracking-tight font-['Outfit']">
              {formatWaterLiters(totalCalculatedLiters)}
            </div>
          </div>

          {/* Water Distribution Gauge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Su Rengi Dağılımı (Sanal Su)
            </h4>
            <WaterGauge
              totalLiters={totalCalculatedLiters}
              greenLiters={greenCalculated}
              blueLiters={blueCalculated}
              greyLiters={greyCalculated}
              showEquivalents={true}
            />
          </div>

          {/* Detailed Story */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Neden Bu Kadar Çok Su Harcanıyor?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              {item.description}
            </p>
          </div>

          {/* Supply Chain Stages */}
          {item.breakdownStages && item.breakdownStages.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tedarik Zinciri Aşamaları
              </h4>
              <div className="space-y-1.5">
                {item.breakdownStages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-800 block">
                        {stage.stage}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {stage.note}
                      </span>
                    </div>
                    <span className="tabular-nums font-mono text-sky-600 font-bold shrink-0">
                      %{stage.percent}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eco-Swap Recommendation */}
          {item.ecoSwap && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Akıllı Alternatif Tavsiyesi</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-950 font-semibold">
                <span>{item.ecoSwap.name}</span>
                <span className="text-emerald-700 font-mono font-bold">
                  {formatWaterLiters(item.ecoSwap.liters)}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800/90 leading-normal">
                {item.ecoSwap.tip}
              </p>
            </div>
          )}
        </div>

        {/* Sticky Bottom Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
            <button
              onClick={handleDecrement}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-lg active:scale-95 transition-all"
              aria-label="Miktarı azalt"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-xs font-extrabold text-slate-900 tabular-nums">
              {qty}
            </span>
            <button
              onClick={handleIncrement}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-lg active:scale-95 transition-all"
              aria-label="Miktarı artır"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add CTA */}
          <button
            onClick={handleConfirm}
            className="flex-1 min-h-[46px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 active:scale-[0.98] transition-all"
          >
            <span>{currentQuantity > 0 ? 'Sepeti Güncelle' : 'Sepete Ekle'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
