import React, { useState } from 'react';
import { WATER_DATABASE } from '../data/waterFootprintData';
import { COMPARE_PRESETS, ComparePreset } from '../data/quizzesAndTips';
import { formatWaterLiters, calculateEquivalents } from '../utils/waterCalculations';
import { ArrowLeftRight, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const CompareView: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedPresetId, setSelectedPresetId] = useState<string>(COMPARE_PRESETS[0].id);

  // Custom selection state
  const [itemAId, setItemAId] = useState<string>(COMPARE_PRESETS[0].itemAId);
  const [itemBId, setItemBId] = useState<string>(COMPARE_PRESETS[0].itemBId);

  const itemA = WATER_DATABASE.find(i => i.id === itemAId) || WATER_DATABASE[0];
  const itemB = WATER_DATABASE.find(i => i.id === itemBId) || WATER_DATABASE[1];

  const totalA = itemA.totalLiters;
  const totalB = itemB.totalLiters;

  const maxLiters = Math.max(totalA, totalB, 1);
  const pctA = Math.round((totalA / maxLiters) * 100);
  const pctB = Math.round((totalB / maxLiters) * 100);

  const diffLiters = Math.abs(totalA - totalB);
  const higherItem = totalA > totalB ? itemA : itemB;
  const lowerItem = totalA > totalB ? itemB : itemA;

  const savingsPct = higherItem.totalLiters > 0
    ? Math.round((diffLiters / higherItem.totalLiters) * 100)
    : 0;

  const equivDiff = calculateEquivalents(diffLiters);

  const handleSelectPreset = (preset: ComparePreset) => {
    setSelectedPresetId(preset.id);
    setItemAId(preset.itemAId);
    setItemBId(preset.itemBId);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 max-w-4xl mx-auto w-full">
      {/* Intro */}
      <div className={`rounded-2xl p-4 sm:p-5 border transition-colors ${
        isDark ? 'bg-[#101A2E] border-[#1C2C47] shadow-md shadow-sky-950/20' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
            isDark ? 'bg-sky-950 text-sky-400 border border-sky-800/60' : 'bg-sky-50 text-sky-600'
          }`}>
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-sm sm:text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Gizli Su Karşılaştırma & Değişim Simülatörü
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Gıdalar ve giysiler arasındaki sanal su farkını kıyaslayın, tasarruf potansiyelini keşfedin
            </p>
          </div>
        </div>
      </div>

      {/* Popular Comparison Presets */}
      <div className="space-y-2">
        <span className={`text-[11px] font-bold uppercase tracking-wider block px-1 ${
          isDark ? 'text-slate-400' : 'text-slate-700'
        }`}>
          Önerilen Kıyaslamalar
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {COMPARE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all shrink-0 active:scale-95 border ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-sm shadow-sky-500/20'
                    : isDark
                      ? 'bg-[#101A2E] text-slate-300 hover:bg-[#13223E] border-[#1C2C47]'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/80 shadow-2xs'
                }`}
              >
                {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Item Dropdown Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={`space-y-1.5 p-3.5 rounded-2xl border transition-colors ${
          isDark ? 'bg-[#101A2E] border-[#1C2C47]' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          <label className={`text-[11px] font-bold uppercase tracking-wider block ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            1. Ürün
          </label>
          <select
            value={itemAId}
            onChange={(e) => {
              setItemAId(e.target.value);
              setSelectedPresetId('custom');
            }}
            className={`w-full h-10 px-2.5 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none ${
              isDark
                ? 'bg-[#09101F] border-[#1E3355] text-white focus:border-sky-400'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
            }`}
          >
            {WATER_DATABASE.map((item) => (
              <option key={item.id} value={item.id}>
                {item.emoji} {item.name} ({item.unit})
              </option>
            ))}
          </select>
        </div>

        <div className={`space-y-1.5 p-3.5 rounded-2xl border transition-colors ${
          isDark ? 'bg-[#101A2E] border-[#1C2C47]' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          <label className={`text-[11px] font-bold uppercase tracking-wider block ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            2. Ürün
          </label>
          <select
            value={itemBId}
            onChange={(e) => {
              setItemBId(e.target.value);
              setSelectedPresetId('custom');
            }}
            className={`w-full h-10 px-2.5 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none ${
              isDark
                ? 'bg-[#09101F] border-[#1E3355] text-white focus:border-sky-400'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
            }`}
          >
            {WATER_DATABASE.map((item) => (
              <option key={item.id} value={item.id}>
                {item.emoji} {item.name} ({item.unit})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Item A Card */}
        <div className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition-colors ${
          isDark ? 'bg-[#101A2E] border-[#1C2C47] text-white' : 'bg-white border-slate-200 shadow-xs text-slate-900'
        }`}>
          <div className="space-y-1.5 text-center">
            <span className="text-4xl select-none inline-block mb-1">{itemA.emoji}</span>
            <h3 className="text-sm sm:text-base font-bold line-clamp-1">{itemA.name}</h3>
            <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Birim: {itemA.unit}
            </span>
          </div>

          <div className="space-y-2 text-center">
            <span className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] block ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {formatWaterLiters(totalA)}
            </span>
            <div className={`h-2.5 w-full rounded-full overflow-hidden ${
              isDark ? 'bg-[#09101F]' : 'bg-slate-100'
            }`}>
              <div
                style={{ width: `${pctA}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  totalA > totalB ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
            </div>
            <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {totalA > totalB ? 'Yüksek su tüketimi' : 'Düşük su tüketimi'}
            </span>
          </div>
        </div>

        {/* Item B Card */}
        <div className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition-colors ${
          isDark ? 'bg-[#101A2E] border-[#1C2C47] text-white' : 'bg-white border-slate-200 shadow-xs text-slate-900'
        }`}>
          <div className="space-y-1.5 text-center">
            <span className="text-4xl select-none inline-block mb-1">{itemB.emoji}</span>
            <h3 className="text-sm sm:text-base font-bold line-clamp-1">{itemB.name}</h3>
            <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Birim: {itemB.unit}
            </span>
          </div>

          <div className="space-y-2 text-center">
            <span className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] block ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {formatWaterLiters(totalB)}
            </span>
            <div className={`h-2.5 w-full rounded-full overflow-hidden ${
              isDark ? 'bg-[#09101F]' : 'bg-slate-100'
            }`}>
              <div
                style={{ width: `${pctB}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  totalB > totalA ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
            </div>
            <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {totalB > totalA ? 'Yüksek su tüketimi' : 'Düşük su tüketimi'}
            </span>
          </div>
        </div>
      </div>

      {/* Difference & Savings Card */}
      {diffLiters > 0 ? (
        <div className={`p-5 rounded-2xl border space-y-3.5 transition-colors ${
          isDark
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200 shadow-md shadow-emerald-950/20'
            : 'bg-emerald-50/90 border-emerald-200/90 text-emerald-900 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Akıllı Değişim ile Kurtarılacak Su Miktarı</span>
          </div>

          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black font-['Outfit'] text-emerald-400">
              {formatWaterLiters(diffLiters)}
            </span>
            <span className="text-sm font-bold text-emerald-300">
              (%{savingsPct} daha az su)
            </span>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold">{higherItem.name}</span> yerine{' '}
            <span className="font-bold">{lowerItem.name}</span> tercih ederek tek bir öğün veya giyside{' '}
            <span className="font-bold">{formatWaterLiters(diffLiters)}</span> su tasarrufu sağlayabilirsiniz.
          </p>

          <div className={`pt-3 border-t flex items-center justify-between text-xs sm:text-sm ${
            isDark ? 'border-emerald-800/50 text-emerald-300' : 'border-emerald-200/70 text-emerald-800'
          }`}>
            <span>🚿 Tasarruf Eşdeğeri:</span>
            <span className="font-bold">~{equivDiff.showers} kez duş almaya denk</span>
          </div>
        </div>
      ) : (
        <div className={`p-5 rounded-2xl border text-center text-xs sm:text-sm ${
          isDark ? 'bg-[#101A2E] border-[#1C2C47] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          Her iki ürünün de tekil sanal su ayak izi eşittir.
        </div>
      )}
    </div>
  );
};
