import { BasketItem, WaterItem } from '../types/water';

export function formatWaterLiters(liters: number): string {
  if (liters >= 1000000) {
    const million = liters / 1000000;
    return `${million.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} milyon L`;
  }
  if (liters >= 10000) {
    return `${Math.round(liters).toLocaleString('tr-TR')} L`;
  }
  if (liters >= 100) {
    return `${Math.round(liters).toLocaleString('tr-TR')} L`;
  }
  return `${liters.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} L`;
}

export function formatCubicMeters(liters: number): string {
  const m3 = liters / 1000;
  return `${m3.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} m³`;
}

export interface Equivalents {
  showers: number;        // 1 duş ~ 80 litre
  drinkingYears: number;  // 1 insan yıllık içme suyu ~ 730 litre (2L/gün)
  damacana: number;       // 1 standart damacana ~ 19 litre
  poolPercent: number;    // 1 olimpik havuz ~ 2.500.000 litre
}

export function calculateEquivalents(liters: number): Equivalents {
  return {
    showers: Math.max(0, Math.round(liters / 80)),
    drinkingYears: Number((liters / 730).toFixed(1)),
    damacana: Math.max(0, Math.round(liters / 19)),
    poolPercent: Number(((liters / 2500000) * 100).toFixed(2))
  };
}

export interface WaterColorTotals {
  total: number;
  green: number;
  blue: number;
  grey: number;
  greenPercent: number;
  bluePercent: number;
  greyPercent: number;
}

export function calculateBasketTotals(basket: BasketItem[]): WaterColorTotals {
  let total = 0;
  let green = 0;
  let blue = 0;
  let grey = 0;

  for (const item of basket) {
    const qty = item.quantity;
    total += item.item.totalLiters * qty;
    green += item.item.greenWater * qty;
    blue += item.item.blueWater * qty;
    grey += item.item.greyWater * qty;
  }

  const greenPercent = total > 0 ? Math.round((green / total) * 100) : 0;
  const bluePercent = total > 0 ? Math.round((blue / total) * 100) : 0;
  const greyPercent = total > 0 ? Math.max(0, 100 - greenPercent - bluePercent) : 0;

  return {
    total,
    green,
    blue,
    grey,
    greenPercent,
    bluePercent,
    greyPercent
  };
}

export function getWaterImpactLevel(liters: number): {
  label: string;
  badgeColor: string;
  bgLight: string;
  textColor: string;
} {
  if (liters >= 10000) {
    return {
      label: 'Kritik Su Tüketimi',
      badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      bgLight: 'bg-rose-500',
      textColor: 'text-rose-400'
    };
  }
  if (liters >= 3000) {
    return {
      label: 'Yüksek Su Ayak İzi',
      badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      bgLight: 'bg-amber-500',
      textColor: 'text-amber-400'
    };
  }
  if (liters >= 1000) {
    return {
      label: 'Orta Seviye Tüketim',
      badgeColor: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
      bgLight: 'bg-sky-500',
      textColor: 'text-sky-400'
    };
  }
  return {
    label: 'Su Dostu / Düşük İz',
    badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    bgLight: 'bg-emerald-500',
    textColor: 'text-emerald-400'
  };
}
