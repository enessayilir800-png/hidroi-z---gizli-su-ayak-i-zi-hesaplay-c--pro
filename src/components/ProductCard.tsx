import React from 'react';
import { WaterItem } from '../types/water';
import { formatWaterLiters } from '../utils/waterCalculations';
import { Plus, Check, Info } from 'lucide-react';

interface ProductCardProps {
  item: WaterItem;
  quantityInBasket: number;
  onAdd: (item: WaterItem) => void;
  onOpenDetails: (item: WaterItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  quantityInBasket,
  onAdd,
  onOpenDetails,
}) => {
  return (
    <div className="bg-white hover:border-sky-300 border border-slate-200 rounded-2xl p-3.5 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
      {/* Top row: Emoji, Name, Info button */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none shrink-0" role="img" aria-label={item.name}>
              {item.emoji}
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight line-clamp-1">
                {item.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span className="font-medium text-slate-600">{item.unit}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-sky-600 font-semibold">{item.tag}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenDetails(item)}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
            title="Detaylı Su Analizi"
            aria-label={`${item.name} detaylarını gör`}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Short explanation */}
        <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
          {item.shortWhy}
        </p>
      </div>

      {/* Bottom row: Water amount & Add button */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
            Gizli Su (Tekil)
          </span>
          <span className="text-base font-extrabold text-slate-900 tabular-nums tracking-tight font-['Outfit']">
            {formatWaterLiters(item.totalLiters)}
          </span>
        </div>

        <button
          onClick={() => onAdd(item)}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
            quantityInBasket > 0
              ? 'bg-sky-100 text-sky-800 border border-sky-300 hover:bg-sky-200'
              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20'
          }`}
          aria-label={`${item.name} sepete ekle`}
        >
          {quantityInBasket > 0 ? (
            <>
              <Check className="w-3.5 h-3.5 text-sky-700" />
              <span>Sepette ({quantityInBasket})</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Ekle</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
