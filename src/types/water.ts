export type WaterCategory = 'clothing' | 'food' | 'drinks' | 'goods';

export interface BreakdownStage {
  stage: string;
  percent: number;
  note: string;
}

export interface EcoSwap {
  name: string;
  liters: number;
  tip: string;
}

export interface WaterItem {
  id: string;
  name: string;
  category: WaterCategory;
  unit: string;
  defaultQty: number;
  stepQty: number;
  maxQty: number;
  totalLiters: number; // liters per unit
  greenWater: number;  // Yağmur suyu (Litre)
  blueWater: number;   // Yeraltı ve yüzey suyu (Litre)
  greyWater: number;   // Kirliliği arıtma suyu (Litre)
  iconName: string;
  emoji: string;
  description: string;
  shortWhy: string;
  breakdownStages: BreakdownStage[];
  ecoSwap?: EcoSwap;
  tag: string;
}

export interface BasketItem {
  item: WaterItem;
  quantity: number;
  addedAt: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  fact: string;
}

export interface WaterEstimateResult {
  itemName: string;
  totalLiters: number;
  greenWater: number;
  blueWater: number;
  greyWater: number;
  confidence: 'Yüksek' | 'Orta' | 'Tahmini';
  explanation: string;
  supplyChainKeyFactors: string[];
  recommendedEcoSwap: string;
  showerEquivalent: number;
}
