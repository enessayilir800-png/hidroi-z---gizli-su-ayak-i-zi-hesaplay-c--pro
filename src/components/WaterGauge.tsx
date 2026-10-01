import React from 'react';
import { formatWaterLiters, calculateEquivalents } from '../utils/waterCalculations';
import { ShowerHead, Calendar, Package } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface WaterGaugeProps {
  totalLiters: number;
  greenLiters: number;
  blueLiters: number;
  greyLiters: number;
  showEquivalents?: boolean;
}

export const WaterGauge: React.FC<WaterGaugeProps> = ({
  totalLiters,
  greenLiters,
  blueLiters,
  greyLiters,
  showEquivalents = true,
}) => {
  const { isDark } = useTheme();
  const safeTotal = Math.max(1, totalLiters);
  const greenPct = Math.round((greenLiters / safeTotal) * 100);
  const bluePct = Math.round((blueLiters / safeTotal) * 100);
  const greyPct = Math.max(0, 100 - greenPct - bluePct);

  const equiv = calculateEquivalents(totalLiters);

  return (
    <div className="space-y-3">
      {/* Visual Multi-Segment Bar */}
      <div className="space-y-1.5">
        <div className={`h-3 w-full rounded-full overflow-hidden flex border shadow-inner ${
          isDark
            ? 'bg-[#09101F] border-[#1C2C47]'
            : 'bg-slate-100 border-slate-200'
        }`}>
          <div
            style={{ width: `${greenPct}%` }}
            className="h-full bg-emerald-500 transition-all duration-500"
            title={`Yeşil Su: %${greenPct}`}
          />
          <div
            style={{ width: `${bluePct}%` }}
            className="h-full bg-sky-400 transition-all duration-500"
            title={`Mavi Su: %${bluePct}`}
          />
          <div
            style={{ width: `${greyPct}%` }}
            className="h-full bg-slate-500 transition-all duration-500"
            title={`Gri Su: %${greyPct}`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-1 pt-1 text-[11px]">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Yeşil Su
              </span>
            </div>
            <span className={`text-[10px] tabular-nums pl-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              %{greenPct} (Yağmur)
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Mavi Su
              </span>
            </div>
            <span className={`text-[10px] tabular-nums pl-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              %{bluePct} (Sulama)
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Gri Su
              </span>
            </div>
            <span className={`text-[10px] tabular-nums pl-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              %{greyPct} (Arıtma)
            </span>
          </div>
        </div>
      </div>

      {/* Relatable Metric Equivalents */}
      {showEquivalents && totalLiters > 0 && (
        <div className={`grid grid-cols-3 gap-2 pt-2 border-t ${
          isDark ? 'border-[#1C2C47]' : 'border-slate-200/80'
        }`}>
          <div className={`p-2 rounded-xl flex flex-col items-center text-center border transition-colors ${
            isDark
              ? 'bg-[#09101F] border-[#1C2C47]'
              : 'bg-white border-slate-200/80'
          }`}>
            <ShowerHead className="w-4 h-4 text-sky-400 mb-1" />
            <span className={`text-sm font-extrabold tabular-nums font-['Outfit'] ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {equiv.showers.toLocaleString('tr-TR')}
            </span>
            <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              8 dk Duş
            </span>
          </div>

          <div className={`p-2 rounded-xl flex flex-col items-center text-center border transition-colors ${
            isDark
              ? 'bg-[#09101F] border-[#1C2C47]'
              : 'bg-white border-slate-200/80'
          }`}>
            <Calendar className="w-4 h-4 text-blue-400 mb-1" />
            <span className={`text-sm font-extrabold tabular-nums font-['Outfit'] ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {equiv.drinkingYears} yıl
            </span>
            <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              İçme Suyu
            </span>
          </div>

          <div className={`p-2 rounded-xl flex flex-col items-center text-center border transition-colors ${
            isDark
              ? 'bg-[#09101F] border-[#1C2C47]'
              : 'bg-white border-slate-200/80'
          }`}>
            <Package className="w-4 h-4 text-cyan-400 mb-1" />
            <span className={`text-sm font-extrabold tabular-nums font-['Outfit'] ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {equiv.damacana.toLocaleString('tr-TR')}
            </span>
            <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Damacana
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
