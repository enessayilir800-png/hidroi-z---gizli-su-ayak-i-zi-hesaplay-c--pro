import React, { useState, useRef } from 'react';
import { estimateVirtualWater, ImageInput } from '../services/aiEstimator';
import { processImageForAi } from '../utils/imageUtils';
import { WaterEstimateResult, WaterItem } from '../types/water';
import { WATER_DATABASE } from '../data/waterFootprintData';
import { WaterGauge } from './WaterGauge';
import { formatWaterLiters } from '../utils/waterCalculations';
import { useTheme } from '../context/ThemeContext';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Plus,
  Check,
  X,
  Search,
  ShowerHead,
  Lightbulb,
  ScanLine,
  RefreshCw,
  Send,
  HelpCircle,
  Package,
  Calendar,
  Layers
} from 'lucide-react';

interface PhotoScannerViewProps {
  onAddToBasket: (item: WaterItem, qty?: number) => void;
  onOpenBasket: () => void;
}

const POPULAR_ITEMS = [
  { id: 'coffee-cup', name: 'Kahve', emoji: '☕', unit: '1 fincan', liters: 140 },
  { id: 'burger', name: 'Burger', emoji: '🍔', unit: '1 adet', liters: 2100 },
  { id: 'beef-steak', name: 'Dana Eti', emoji: '🥩', unit: '1 porsiyon', liters: 2310 },
  { id: 'chicken-portion', name: 'Tavuk', emoji: '🍗', unit: '1 porsiyon', liters: 650 },
  { id: 'cheese-slice', name: 'Kaşar Peyniri', emoji: '🧀', unit: '1 dilim', liters: 152 },
  { id: 'egg', name: 'Yumurta', emoji: '🥚', unit: '1 adet', liters: 196 },
  { id: 'bread-slice', name: 'Ekmek', emoji: '🍞', unit: '1 dilim', liters: 40 },
  { id: 'jeans', name: 'Kot Pantolon', emoji: '👖', unit: '1 adet', liters: 7800 },
  { id: 'tshirt', name: 'Tişört', emoji: '👕', unit: '1 adet', liters: 2200 },
  { id: 'sneakers', name: 'Spor Ayakkabı', emoji: '👟', unit: '1 çift', liters: 3800 },
  { id: 'smartphone', name: 'Akıllı Telefon', emoji: '📱', unit: '1 cihaz', liters: 12760 },
  { id: 'a4-paper', name: 'A4 Kağıt', emoji: '📄', unit: '1 yaprak', liters: 10 }
];

export const PhotoScannerView: React.FC<PhotoScannerViewProps> = ({
  onAddToBasket,
  onOpenBasket,
}) => {
  const { isDark } = useTheme();

  const [selectedImage, setSelectedImage] = useState<{
    dataUrl: string;
    base64Data: string;
    mimeType: string;
    name?: string;
  } | null>(null);

  const [textPrompt, setTextPrompt] = useState('');
  const [hintText, setHintText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Fotoğraf Taranıyor & Hesaplanıyor...');
  const [result, setResult] = useState<WaterEstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Search & quick selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<WaterItem | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload with auto-compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setLoadingMessage('Görsel optimize ediliyor...');
      const processed = await processImageForAi(file, 1024, 0.85);

      setSelectedImage({
        dataUrl: processed.dataUrl,
        base64Data: processed.base64Data,
        mimeType: processed.mimeType,
        name: processed.name
      });
      setError(null);
      setSelectedCatalogItem(null);
    } catch (err: any) {
      setError(err?.message || 'Görsel işlenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  // Analyze photo or prompt
  const handleAnalyze = async (overridePrompt?: string) => {
    const queryToUse = overridePrompt !== undefined ? overridePrompt : (textPrompt.trim() || hintText.trim());

    if (!selectedImage && !queryToUse) {
      setError('Lütfen analiz edilecek bir fotoğraf seçin veya yiyecek/kıyafet adını yazın.');
      return;
    }

    setLoading(true);
    setLoadingMessage(selectedImage ? 'Fotoğraf analiz ediliyor & hesaplanıyor...' : 'Yapay zeka su ayak izini hesaplıyor...');
    setError(null);
    setAddedSuccess(false);

    try {
      const imagePayload: ImageInput | undefined = selectedImage ? {
        data: selectedImage.base64Data,
        mimeType: selectedImage.mimeType
      } : undefined;

      const data = await estimateVirtualWater(queryToUse || undefined, imagePayload, queryToUse || undefined);
      setResult(data);
      setSelectedCatalogItem(null);
    } catch (err: any) {
      setError(err?.message || 'Analiz sırasında bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResultToBasket = () => {
    if (!result) return;

    const customItem: WaterItem = {
      id: `ai-${Date.now()}`,
      name: result.itemName,
      category: 'food',
      unit: '1 tekil adet/porsiyon',
      defaultQty: 1,
      stepQty: 1,
      maxQty: 10,
      totalLiters: result.totalLiters,
      greenWater: result.greenWater,
      blueWater: result.blueWater,
      greyWater: result.greyWater,
      iconName: 'Camera',
      emoji: '✨',
      tag: 'Yapay Zeka Analizi',
      shortWhy: result.explanation.slice(0, 110) + '...',
      description: result.explanation,
      breakdownStages: result.supplyChainKeyFactors.map((factor, idx) => ({
        stage: factor,
        percent: idx === 0 ? 65 : idx === 1 ? 23 : 12,
        note: 'Tedarik zinciri analizi'
      })),
      ecoSwap: {
        name: result.recommendedEcoSwap,
        liters: Math.round(result.totalLiters * 0.4),
        tip: 'Önerilen tasarruflu alternatif'
      }
    };

    onAddToBasket(customItem, 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleSelectQuickItem = (id: string) => {
    const item = WATER_DATABASE.find(i => i.id === id);
    if (item) {
      setSelectedCatalogItem(item);
      setResult(null);
      setSelectedImage(null);
    }
  };

  const filteredCatalog = WATER_DATABASE.filter(item => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.shortWhy.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hero 2-Column Responsive Section on Desktop (lg:grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: AI Scanner & Direct Text Search */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`rounded-2xl p-4 sm:p-5 border transition-colors duration-200 space-y-4 ${
            isDark
              ? 'bg-[#101A2E] border-[#1C2C47] shadow-lg shadow-sky-950/20'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  isDark ? 'bg-sky-950 text-sky-400 border border-sky-800/60' : 'bg-sky-50 text-sky-600'
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className={`text-sm sm:text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Yapay Zeka Su Ayak İzi Dedektifi
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Fotoğraf çekin, yükleyin veya doğrudan yemeğin/giysinin adını yazın
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Text Prompt Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAnalyze();
              }}
              className="space-y-2"
            >
              <label className={`text-[11px] font-bold uppercase tracking-wider block ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Yapay Zekaya Doğrudan Sor
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  placeholder="Örn: 1 porsiyon mantı, keten ceket, latte, avokado..."
                  className={`w-full h-11 pl-3.5 pr-28 rounded-xl border text-xs sm:text-sm font-medium transition-all focus:outline-none ${
                    isDark
                      ? 'bg-[#09101F] border-[#1E3355] text-white placeholder-slate-500 focus:border-sky-400'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                  }`}
                />
                <button
                  type="submit"
                  disabled={loading || (!textPrompt.trim() && !selectedImage)}
                  className="absolute right-1.5 h-8 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Sor</span>
                </button>
              </div>
            </form>

            {/* Photo Scanner Section */}
            <div className="pt-2 border-t border-slate-200/50 dark:border-[#1C2C47] space-y-3">
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                veya Fotoğraf İle Tara
              </span>

              {!selectedImage ? (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="h-16 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-slate-950 flex flex-col items-center justify-center gap-1 transition-all shadow-md shadow-sky-500/20 font-bold text-xs"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Kamera ile Çek</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`h-16 rounded-xl active:scale-[0.98] border flex flex-col items-center justify-center gap-1 transition-all font-semibold text-xs ${
                        isDark
                          ? 'bg-[#13223E] hover:bg-[#1A2D50] border-[#1E3355] text-slate-200'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <ImageIcon className={`w-5 h-5 ${isDark ? 'text-sky-400' : 'text-slate-600'}`} />
                      <span>Galeriden Seç</span>
                    </button>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`py-5 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all text-center px-3 ${
                      isDark
                        ? 'border-[#1E3355] hover:border-sky-400 hover:bg-[#13223E]/40 text-slate-300'
                        : 'border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 text-slate-700'
                    }`}
                  >
                    <ScanLine className={`w-7 h-7 mb-1.5 ${isDark ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className="text-xs sm:text-sm font-semibold">
                      Fotoğrafı buraya sürükleyin veya dosya seçin
                    </span>
                    <span className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                      JPG, PNG veya WEBP (Otomatik optimize edilir)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className={`relative rounded-xl overflow-hidden border max-h-64 flex items-center justify-center ${
                    isDark ? 'bg-[#09101F] border-[#1E3355]' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <img
                      src={selectedImage.dataUrl}
                      alt="Taranan ürün"
                      className="w-full h-full object-contain max-h-64"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setResult(null);
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 bg-slate-950/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                      title="Fotoğrafı Kaldır"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={hintText}
                      onChange={(e) => setHintText(e.target.value)}
                      placeholder="İsteğe bağlı görsel ipucu (Örn: Izgara köfte, Pamuklu tişört)"
                      className={`w-full h-10 px-3 rounded-xl border text-xs transition-all focus:outline-none ${
                        isDark
                          ? 'bg-[#09101F] border-[#1E3355] text-white placeholder-slate-500 focus:border-sky-400'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleAnalyze()}
                    className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 active:scale-[0.98] transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>{loadingMessage}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Fotoğrafın Su Ayak İzini Analiz Et</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className={`p-3 rounded-xl border text-xs font-medium ${
                isDark ? 'bg-rose-950/40 border-rose-900 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Analysis Result or How it Works Banner */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className={`rounded-2xl p-5 border space-y-4 animate-fade-in transition-colors ${
              isDark
                ? 'bg-[#101A2E] border-sky-500/40 shadow-xl shadow-sky-950/40 text-white'
                : 'bg-white border-sky-300 shadow-md text-slate-900'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-sky-400' : 'text-sky-600'
                  }`}>
                    Tespit Edilen Ürün (Tekil Porsiyon)
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
                    {result.itemName}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] block leading-none ${
                    isDark ? 'text-sky-400' : 'text-sky-600'
                  }`}>
                    {formatWaterLiters(result.totalLiters)}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                    Tekil Tüketim
                  </span>
                </div>
              </div>

              {/* Water Gauge */}
              <WaterGauge
                totalLiters={result.totalLiters}
                greenLiters={result.greenWater}
                blueLiters={result.blueWater}
                greyLiters={result.greyWater}
                showEquivalents={true}
              />

              {/* Scientific Explanation */}
              <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                isDark ? 'bg-[#09101F] border-[#1C2C47] text-slate-300' : 'bg-slate-50 border-slate-200/80 text-slate-700'
              }`}>
                <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  Neden bu kadar su harcanıyor?
                </span>
                <p className="leading-relaxed">{result.explanation}</p>
              </div>

              {/* Supply Chain Factors */}
              {result.supplyChainKeyFactors && result.supplyChainKeyFactors.length > 0 && (
                <div className="space-y-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Tedarik Zinciri Aşamaları
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {result.supplyChainKeyFactors.map((factor, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 ${
                          isDark ? 'bg-[#09101F] border-[#1C2C47] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                        <span className="line-clamp-2">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Eco Swap */}
              {result.recommendedEcoSwap && (
                <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  isDark
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                    : 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                }`}>
                  <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Tasarruf Alternatifi (Eco-Swap):</span>
                    <span>{result.recommendedEcoSwap}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAddResultToBasket}
                  className={`flex-1 h-11 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                    addedSuccess
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow-xs'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Sepete Eklendi!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Bugünkü Sepetime Ekle</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                    setHintText('');
                    setTextPrompt('');
                  }}
                  className={`h-11 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isDark
                      ? 'bg-[#13223E] hover:bg-[#1A2D50] border-[#1E3355] text-slate-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Yeni Analiz</span>
                </button>
              </div>
            </div>
          ) : selectedCatalogItem ? (
            <div className={`rounded-2xl border p-5 shadow-sm space-y-4 animate-fade-in ${
              isDark
                ? 'bg-[#101A2E] border-sky-500/40 text-white'
                : 'bg-white border-sky-300 text-slate-900'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl select-none">{selectedCatalogItem.emoji}</span>
                  <div>
                    <h3 className="text-base font-bold">{selectedCatalogItem.name}</h3>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Birim: {selectedCatalogItem.unit}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-extrabold font-['Outfit'] block ${
                    isDark ? 'text-sky-400' : 'text-sky-600'
                  }`}>
                    {formatWaterLiters(selectedCatalogItem.totalLiters)}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                    Tekil porsiyon
                  </span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {selectedCatalogItem.shortWhy}
              </p>

              <WaterGauge
                totalLiters={selectedCatalogItem.totalLiters}
                greenLiters={selectedCatalogItem.greenWater}
                blueLiters={selectedCatalogItem.blueWater}
                greyLiters={selectedCatalogItem.greyWater}
                showEquivalents={true}
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onAddToBasket(selectedCatalogItem, 1);
                    setSelectedCatalogItem(null);
                  }}
                  className="flex-1 h-11 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Sepetime Ekle</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCatalogItem(null)}
                  className={`h-11 px-4 rounded-xl border text-xs font-semibold ${
                    isDark
                      ? 'bg-[#13223E] hover:bg-[#1A2D50] border-[#1E3355] text-slate-300'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Kapat
                </button>
              </div>
            </div>
          ) : (
            /* Guide / How it Works Card when idle on Desktop */
            <div className={`rounded-2xl p-5 border space-y-4 transition-colors ${
              isDark
                ? 'bg-[#101A2E]/70 border-[#1C2C47] text-white'
                : 'bg-white/80 border-slate-200 text-slate-900 shadow-xs'
            }`}>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm sm:text-base font-bold">
                  Sanal Su Ayak İzi Nedir?
                </h3>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Yediğimiz bir dilim ekmekten giydiğimiz kot pantolona kadar her ürünün arkasında görünmeyen binlerce litre tatlı su harcanır.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className={`p-3 rounded-xl border text-center ${
                  isDark ? 'bg-[#09101F] border-[#1C2C47]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-xs font-bold text-emerald-400 block mb-0.5">🌱 Yeşil Su</span>
                  <span className={`text-[10px] block leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Tarımsal yağmur suyu
                  </span>
                </div>

                <div className={`p-3 rounded-xl border text-center ${
                  isDark ? 'bg-[#09101F] border-[#1C2C47]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-xs font-bold text-sky-400 block mb-0.5">💧 Mavi Su</span>
                  <span className={`text-[10px] block leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Yeraltı & sulama suyu
                  </span>
                </div>

                <div className={`p-3 rounded-xl border text-center ${
                  isDark ? 'bg-[#09101F] border-[#1C2C47]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-xs font-bold text-slate-400 block mb-0.5">⚙️ Gri Su</span>
                  <span className={`text-[10px] block leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Atık arıtma suyu
                  </span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                isDark ? 'bg-[#09101F] border-[#1C2C47] text-slate-300' : 'bg-sky-50 border-sky-100 text-sky-900'
              }`}>
                <span>Türkiye Kişi Başı Günlük Ortalaması:</span>
                <span className="font-extrabold font-mono">~4.500 L / gün</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popular Items Grid (12 Items) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              Sık Tüketilen Ürünler (Tekil Değerler)
            </h3>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Detayları görmek için herhangi birine dokunun
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {POPULAR_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectQuickItem(item.id)}
              className={`p-3 rounded-xl text-left transition-all active:scale-[0.98] flex items-center justify-between border ${
                isDark
                  ? 'bg-[#101A2E] hover:border-sky-500/50 border-[#1C2C47] shadow-xs'
                  : 'bg-white hover:border-sky-300 border-slate-200/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-xl select-none shrink-0">{item.emoji}</span>
                <div className="truncate">
                  <span className={`text-xs sm:text-sm font-bold block truncate ${
                    isDark ? 'text-slate-100' : 'text-slate-800'
                  }`}>
                    {item.name}
                  </span>
                  <span className={`text-[10px] block truncate ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {item.unit}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0 pl-1">
                <span className={`text-xs sm:text-sm font-extrabold font-['Outfit'] block ${
                  isDark ? 'text-sky-400' : 'text-sky-600'
                }`}>
                  {formatWaterLiters(item.liters)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Search with Instant AI Fallback */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Geniş Veri Tabanında Ara
          </h3>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {WATER_DATABASE.length} Onaylı Ürün
          </span>
        </div>

        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Veri tabanında ara (köfte, pirinç pilavı, spor ayakkabı, a4 kağıt...)"
            className={`w-full h-11 pl-10 pr-9 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none ${
              isDark
                ? 'bg-[#09101F] border-[#1C2C47] text-white placeholder-slate-500 focus:border-sky-400'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 shadow-2xs'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <div className={`rounded-xl border divide-y max-h-72 overflow-y-auto shadow-sm ${
            isDark
              ? 'bg-[#101A2E] border-[#1C2C47] divide-[#1C2C47]'
              : 'bg-white border-slate-200 divide-slate-100'
          }`}>
            {filteredCatalog.length === 0 ? (
              <div className="p-5 text-center space-y-2.5">
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  "{searchQuery}" sabit katalogda bulunamadı.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleAnalyze(searchQuery);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-10 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>"{searchQuery}" için Yapay Zeka ile Su Ayak İzi Hesapla</span>
                </button>
              </div>
            ) : (
              filteredCatalog.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedCatalogItem(item)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-[#13223E]' : 'hover:bg-sky-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none">{item.emoji}</span>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {item.name}
                      </h4>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.unit} · {item.tag}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm sm:text-base font-bold font-['Outfit'] block ${
                      isDark ? 'text-sky-400' : 'text-sky-600'
                    }`}>
                      {formatWaterLiters(item.totalLiters)}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                      Tekil
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
