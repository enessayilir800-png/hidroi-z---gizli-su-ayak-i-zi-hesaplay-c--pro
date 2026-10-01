import React, { useState, useRef } from 'react';
import { estimateVirtualWater, ImageInput } from '../services/aiEstimator';
import { WaterEstimateResult, WaterItem } from '../types/water';
import { WaterGauge } from './WaterGauge';
import { formatWaterLiters } from '../utils/waterCalculations';
import {
  Camera,
  Upload,
  Sparkles,
  Loader2,
  Plus,
  Check,
  ShowerHead,
  Lightbulb,
  X,
  ScanLine,
  ChevronRight,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface AiEstimatorViewProps {
  onAddToBasket: (item: WaterItem, qty?: number) => void;
}

const QUICK_TAGS = [
  { label: 'Dana Burger', emoji: '🍔', hint: 'burger' },
  { label: 'Filtre Kahve', emoji: '☕', hint: 'kahve' },
  { label: 'Dana Eti / Biftek', emoji: '🥩', hint: 'biftek' },
  { label: 'Tavuk Porsiyon', emoji: '🍗', hint: 'tavuk' },
  { label: 'Kaşar Peyniri', emoji: '🧀', hint: 'peynir' },
  { label: 'Ekmek / Tost', emoji: '🍞', hint: 'ekmek' },
  { label: 'Pizza Dilimi', emoji: '🍕', hint: 'pizza' },
  { label: 'Pamuklu Tişört', emoji: '👕', hint: 'tişört' },
  { label: 'Kot Pantolon', emoji: '👖', hint: 'kot' },
  { label: 'Elma / Meyve', emoji: '🍎', hint: 'elma' }
];

export const AiEstimatorView: React.FC<AiEstimatorViewProps> = ({ onAddToBasket }) => {
  const [selectedImage, setSelectedImage] = useState<{
    dataUrl: string;
    base64Data: string;
    mimeType: string;
    name?: string;
  } | null>(null);

  const [selectedTag, setSelectedTag] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WaterEstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addedToBasket, setAddedToBasket] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir görsel formatı seçin (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const base64Data = dataUrl.split(',')[1] || '';
      setSelectedImage({
        dataUrl,
        base64Data,
        mimeType: file.type || 'image/jpeg',
        name: file.name
      });
      setError(null);
      setResult(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Sample quick test generator
  const handleSelectPreset = (tag: typeof QUICK_TAGS[0]) => {
    setSelectedTag(tag.label);
    setCustomNote(tag.label);

    // Create a representative photo canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Soft background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 400, 360);

      // Card circle
      ctx.beginPath();
      ctx.arc(200, 160, 90, 0, Math.PI * 2);
      ctx.fillStyle = '#e0f2fe';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Emoji
      ctx.font = '84px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tag.emoji, 200, 160);

      // Text
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(tag.label, 200, 285);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Örnek Fotoğraf (Tek Porsiyon)', 200, 315);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const base64Data = dataUrl.split(',')[1];
      setSelectedImage({
        dataUrl,
        base64Data,
        mimeType: 'image/jpeg',
        name: `${tag.label}.jpg`
      });
      setError(null);
      setResult(null);
    }
  };

  const handleCalculate = async () => {
    if (!selectedImage && !customNote.trim()) {
      setError('Lütfen bir fotoğraf çekin veya bir ürün adı girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setAddedToBasket(false);

    try {
      const imagePayload: ImageInput | undefined = selectedImage ? {
        data: selectedImage.base64Data,
        mimeType: selectedImage.mimeType
      } : undefined;

      const hintText = customNote.trim() || selectedTag;
      const data = await estimateVirtualWater(hintText || undefined, imagePayload, hintText);
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Hesaplama yapılırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAiItemToBasket = () => {
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
      emoji: '📸',
      tag: 'Fotoğraf Analizi',
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
    setAddedToBasket(true);
    setTimeout(() => setAddedToBasket(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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

      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/15 space-y-1">
        <div className="flex items-center gap-1.5 text-sky-100 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-white" />
          <span>Görsel Su Dedektifi</span>
        </div>
        <h2 className="text-base font-extrabold tracking-tight font-['Outfit']">
          Yemeğin veya Eşyanın Fotoğrafını Çek
        </h2>
        <p className="text-xs text-sky-100/95 leading-relaxed">
          Tabağındaki <strong>tek 1 porsiyonun</strong> veya giydiğin <strong>tek bir kıyafetin</strong> gerçek sanal su ayak izini hesapla.
        </p>
      </div>

      {/* Main Photo Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3.5">
        {!selectedImage ? (
          /* Empty State / Photo picker */
          <div className="space-y-3">
            <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center shadow-xs">
                <Camera className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-800">
                  Fotoğraf Çek veya Yükle
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Tabağındaki yemeğin, fincandaki kahvenin veya bir giysinin fotoğrafını ekle.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 max-w-xs mx-auto">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="min-h-[44px] px-3 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Kamera</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 active:scale-95 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Galeriden Seç</span>
                </button>
              </div>
            </div>

            {/* Quick 1-tap test chips */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Veya Hızlı Test Et:</span>
                <span className="text-[11px] text-sky-600">Tek tıkla fotoğrafla</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {QUICK_TAGS.slice(0, 6).map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => handleSelectPreset(tag)}
                    className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-medium text-slate-700 hover:text-sky-700 flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 active:scale-95"
                  >
                    <span>{tag.emoji}</span>
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Image Selected & Ready to Analyze */
          <div className="space-y-3 animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 h-52 flex items-center justify-center shadow-inner">
              <img
                src={selectedImage.dataUrl}
                alt="Seçilen Fotoğraf"
                className="w-full h-full object-cover"
              />

              {loading && (
                <div className="absolute inset-0 bg-sky-600/20 backdrop-blur-xs flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-sky-600 flex items-center justify-center shadow-lg">
                    <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
                  </div>
                  <span className="text-xs font-bold text-white mt-2 bg-slate-900/60 px-3 py-1 rounded-full">
                    Sanal Su Analiz Ediliyor...
                  </span>
                </div>
              )}

              {/* Remove button */}
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setResult(null);
                  setError(null);
                }}
                disabled={loading}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md border border-slate-200"
                aria-label="Fotoğrafı kaldır"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Tag Selector to help accuracy */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Fotoğraftaki Ürün Nedir? (İsteğe Bağlı Seç / Yaz):
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => {
                      setSelectedTag(tag.label);
                      setCustomNote(tag.label);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                      customNote === tag.label
                        ? 'bg-sky-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag.emoji} {tag.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Örn: Dana burger, filtre kahve, keten tişört..."
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            {/* Analyze CTA */}
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full min-h-[46px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Hesaplanıyor...</span>
                </>
              ) : (
                <>
                  <ScanLine className="w-4 h-4" />
                  <span>Gizli Su Ayak İzini Hesapla</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Error Card */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed">
          {error}
        </div>
      )}

      {/* RESULT CARD */}
      {result && !loading && (
        <div className="p-4 bg-white rounded-2xl border border-sky-200/90 shadow-md space-y-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md inline-block mb-1">
                TEKİL TANE / PORSİYON HESABI
              </span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                {result.itemName}
              </h3>
            </div>

            <button
              onClick={handleAddAiItemToBasket}
              className={`min-h-[40px] px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                addedToBasket
                  ? 'bg-emerald-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
              }`}
            >
              {addedToBasket ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Sepete Eklendi</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Sepetime Ekle</span>
                </>
              )}
            </button>
          </div>

          {/* Big Number Display */}
          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 text-center space-y-1">
            <span className="text-xs text-sky-800 font-medium block">
              Görünen 1 Adet / Porsiyonun Toplam Sanal Suyu
            </span>
            <div className="text-3xl font-extrabold text-sky-700 font-['Outfit'] tabular-nums tracking-tight">
              {formatWaterLiters(result.totalLiters)}
            </div>
            <div className="text-xs text-slate-600 flex items-center justify-center gap-1.5 pt-1">
              <ShowerHead className="w-4 h-4 text-sky-600" />
              <span>
                Yaklaşık <strong className="text-slate-900 font-bold">{result.showerEquivalent} kez</strong> duş almaya denk
              </span>
            </div>
          </div>

          {/* Water Breakdown Gauge */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Su Rengi Dağılımı
            </h4>
            <WaterGauge
              totalLiters={result.totalLiters}
              greenLiters={result.greenWater}
              blueLiters={result.blueWater}
              greyLiters={result.greyWater}
              showEquivalents={false}
            />
          </div>

          {/* Reason Story */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Neden Bu Kadar Su?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              {result.explanation}
            </p>
          </div>

          {/* Key Supply Factors */}
          {result.supplyChainKeyFactors && result.supplyChainKeyFactors.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Su Harcayan Kritik Aşamalar
              </h4>
              <div className="space-y-1">
                {result.supplyChainKeyFactors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Eco Swap */}
          {result.recommendedEcoSwap && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>Akıllı Alternatif</span>
              </div>
              <p className="text-emerald-900 leading-relaxed font-medium">
                {result.recommendedEcoSwap}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
