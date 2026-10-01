import React, { useState, useMemo } from 'react';
import { WATER_DATABASE, CATEGORY_INFO } from '../data/waterFootprintData';
import { WaterItem, BasketItem } from '../types/water';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { formatWaterLiters } from '../utils/waterCalculations';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';

interface CalculatorViewProps {
  basket: BasketItem[];
  onAddToBasket: (item: WaterItem, qty?: number) => void;
  onOpenBasket: () => void;
  onGoToAiPhoto?: () => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  basket,
  onAddToBasket,
  onOpenBasket,
  onGoToAiPhoto,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDetailItem, setActiveDetailItem] = useState<WaterItem | null>(null);

  const basketMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of basket) {
      map.set(item.item.id, item.quantity);
    }
    return map;
  }, [basket]);

  const totalBasketLiters = useMemo(() => {
    return basket.reduce((acc, curr) => acc + curr.item.totalLiters * curr.quantity, 0);
  }, [basket]);

  const filteredItems = useMemo(() => {
    return WATER_DATABASE.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.shortWhy.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Yemek, içecek veya giysi ara (köfte, kahve, tişört...)"
          className="w-full h-11 pl-10 pr-9 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 shadow-2xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-700 absolute right-1 top-1/2 -translate-y-1/2"
            aria-label="Aramayı temizle"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {Object.entries(CATEGORY_INFO).map(([key, cat]) => {
          const isActive = selectedCategory === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Items Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>{filteredItems.length} ürün listeleniyor</span>
        <span className="font-medium text-slate-600">Tekil porsiyon & tane</span>
      </div>

      {/* Product Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center space-y-2 bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm font-semibold text-slate-800">
            Aramanıza uygun ürün bulunamadı.
          </p>
          <p className="text-xs text-slate-500">
            Ürünün fotoğrafını çekerek anında analiz edebilirsiniz!
          </p>
          {onGoToAiPhoto && (
            <button
              onClick={onGoToAiPhoto}
              className="mt-2 px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
            >
              📸 Fotoğraf Çek
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              quantityInBasket={basketMap.get(item.id) || 0}
              onAdd={(itm) => onAddToBasket(itm, 1)}
              onOpenDetails={(itm) => setActiveDetailItem(itm)}
            />
          ))}
        </div>
      )}

      {/* Floating Bottom Basket Pill */}
      {basket.length > 0 && (
        <div className="sticky bottom-2 z-20 pt-2 pb-1">
          <button
            onClick={onOpenBasket}
            className="w-full h-12 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 flex items-center justify-between shadow-xl shadow-sky-600/25 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 fill-white" />
              <span>Bugünkü Tüketim Sepetim ({basket.length} kalem)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm font-mono">
                {formatWaterLiters(totalBasketLiters)}
              </span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Product Detail Modal Sheet */}
      <ProductDetailModal
        item={activeDetailItem}
        currentQuantity={activeDetailItem ? basketMap.get(activeDetailItem.id) || 0 : 0}
        onClose={() => setActiveDetailItem(null)}
        onAddWithQuantity={(itm, qty) => onAddToBasket(itm, qty)}
      />
    </div>
  );
};
