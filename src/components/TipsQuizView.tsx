import React, { useState } from 'react';
import { QUIZ_QUESTIONS, WATER_TIPS } from '../data/quizzesAndTips';
import { formatWaterLiters } from '../utils/waterCalculations';
import { CheckCircle2, XCircle, Award, Target, BookOpen, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TipsQuizViewProps {
  currentBasketLiters: number;
}

export const TipsQuizView: React.FC<TipsQuizViewProps> = ({ currentBasketLiters }) => {
  // Budget goal state
  const [dailyBudget, setDailyBudget] = useState<number>(3500);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const activeQuestion = QUIZ_QUESTIONS[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    if (idx === activeQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  const budgetPercent = Math.min(150, Math.round((currentBasketLiters / dailyBudget) * 100));

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
      {/* 1. Daily Water Budget Target Section */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/80 border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Günlük Sanal Su Hedefiniz
            </h3>
          </div>
          <span className="text-xs font-bold text-cyan-300 font-mono">
            {formatWaterLiters(dailyBudget)}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Türkiye ortalaması yaklaşık <strong>4.500 Litre/gün</strong>dür. Kendinize sürdürülebilir bir su bütçesi belirleyin:
        </p>

        {/* Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min={1500}
            max={6000}
            step={250}
            value={dailyBudget}
            onChange={(e) => setDailyBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1.500 L (Çok İleri)</span>
            <span>3.500 L (Önerilen)</span>
            <span>6.000 L (Geniş)</span>
          </div>
        </div>

        {/* Current status vs budget */}
        {currentBasketLiters > 0 && (
          <div className="pt-2 border-t border-slate-700/50 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Bugünkü Tüketiminiz:</span>
              <span className="font-bold text-white tabular-nums">
                {formatWaterLiters(currentBasketLiters)} (%{budgetPercent})
              </span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, budgetPercent)}%` }}
                className={`h-full transition-all duration-500 ${
                  budgetPercent > 100 ? 'bg-rose-500' : 'bg-cyan-400'
                }`}
              />
            </div>
            {budgetPercent > 100 ? (
              <span className="text-[11px] text-rose-400 block">
                ⚠️ Günlük hedefinizi {formatWaterLiters(currentBasketLiters - dailyBudget)} aştınız.
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 block">
                ✨ Harika! Hedef bütçenizin {formatWaterLiters(dailyBudget - currentBasketLiters)} altındasınız.
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Interactive Water Footprint Quiz */}
      <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Su Bilinci Testi
            </h3>
          </div>
          {quizStarted && !quizFinished && (
            <span className="text-[11px] font-mono text-cyan-400">
              Soru {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
            </span>
          )}
        </div>

        {!quizStarted ? (
          <div className="text-center py-4 space-y-3">
            <div className="text-3xl select-none">🌊</div>
            <h4 className="text-sm font-semibold text-white">
              Sanal Su Bilginizi Test Edin
            </h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              Kıyafetlerin ve yediğimiz besinlerin gizli suyu hakkında 6 ilginç soruyu yanıtlayın, Su Muhafızı rozeti kazanın.
            </p>
            <button
              onClick={() => setQuizStarted(true)}
              className="min-h-[44px] px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs active:scale-95 transition-all shadow-md shadow-cyan-500/20"
            >
              Teste Başla
            </button>
          </div>
        ) : quizFinished ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Tebrikler! Test Tamamlandı
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                6 sorudan <strong className="text-cyan-400">{score}</strong> tanesini doğru bildiniz.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 max-w-xs mx-auto text-xs text-slate-300">
              {score >= 5 ? (
                <div className="space-y-1">
                  <span className="font-bold text-emerald-400 block">🏅 Usta Su Muhafızı</span>
                  <span>Gizli su ayak izi konusunda olağanüstü bir bilince sahipsiniz!</span>
                </div>
              ) : score >= 3 ? (
                <div className="space-y-1">
                  <span className="font-bold text-cyan-400 block">🥈 Eko-Bilinçli Tüketici</span>
                  <span>Temel sanal su dinamiklerini biliyorsunuz, rehberi inceleyerek daha da geliştirebilirsiniz.</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="font-bold text-amber-400 block">🥉 Su Öğrencisi</span>
                  <span>Görünmeyen suların büyüklüğü sizi şaşırtmış olabilir. Aşağıdaki rehbere göz atın!</span>
                </div>
              )}
            </div>

            <button
              onClick={handleRestartQuiz}
              className="min-h-[42px] px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 mx-auto active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tekrar Dene</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white leading-relaxed">
              {activeQuestion.question}
            </h4>

            {/* Options */}
            <div className="space-y-2">
              {activeQuestion.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700/80';
                if (isAnswerSubmitted) {
                  if (idx === activeQuestion.correctIndex) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                  } else {
                    btnStyle = 'bg-slate-900/40 text-slate-500 border-slate-800';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && idx === activeQuestion.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && idx === selectedOption && idx !== activeQuestion.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation */}
            {isAnswerSubmitted && (
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 animate-fade-in text-xs">
                <p className="text-slate-300 leading-relaxed">
                  {activeQuestion.explanation}
                </p>
                <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{activeQuestion.fact}</span>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="w-full min-h-[42px] mt-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center justify-center transition-all"
                >
                  {currentQIndex === QUIZ_QUESTIONS.length - 1 ? 'Sonuçları Gör' : 'Sonraki Soru'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. High Impact Eco-Saving Tips */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Gizli Su Tasarrufu Rehberi
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {WATER_TIPS.map((tip) => (
            <div
              key={tip.id}
              className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-semibold text-white tracking-tight">
                  {tip.title}
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-md shrink-0">
                  {tip.litersSaved}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tip.description}
              </p>
              <div className="text-[11px] text-cyan-400 font-medium pt-1">
                👉 {tip.actionText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
