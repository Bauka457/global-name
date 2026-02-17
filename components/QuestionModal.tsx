
import React, { useState, useEffect, useMemo } from 'react';
import { Timer, Lightbulb, CheckCircle2, XCircle, Landmark, Mountain, Pyramid, TowerControl as Tower, Trees, Building2, MapPin } from 'lucide-react';
import { Question } from '../types';

interface QuestionModalProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({ question, onAnswer }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [showHint, setShowHint] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [status, setStatus] = useState<'pending' | 'correct' | 'wrong' | 'timeout'>('pending');

  // Елге байланысты түстер палитрасын анықтау
  const countryStyles = useMemo(() => {
    const loc = question.locationName.toLowerCase();
    if (loc.includes('франция')) return { accent: 'blue', gradient: 'from-blue-900/40 via-white/5 to-red-900/40' };
    if (loc.includes('жапония')) return { accent: 'red', gradient: 'from-red-600/20 via-white/5 to-red-600/20' };
    if (loc.includes('бразилия')) return { accent: 'green', gradient: 'from-green-600/20 via-yellow-400/10 to-blue-600/20' };
    if (loc.includes('қазақстан')) return { accent: 'cyan', gradient: 'from-sky-400/20 via-yellow-400/10 to-sky-400/20' };
    if (loc.includes('мысыр')) return { accent: 'yellow', gradient: 'from-amber-600/30 via-stone-800 to-black' };
    if (loc.includes('сауд арабиясы')) return { accent: 'emerald', gradient: 'from-emerald-800/40 via-emerald-600/10 to-emerald-900/40' };
    return { accent: 'blue', gradient: 'from-slate-900 via-slate-950 to-slate-900' };
  }, [question.locationName]);

  const CategoryIcon = useMemo(() => {
    switch (question.markerType) {
      case 'tower': return Tower;
      case 'pyramid': return Pyramid;
      case 'mountain': return Mountain;
      case 'temple': return Landmark;
      case 'nature': return Trees;
      case 'modern': return Building2;
      default: return MapPin;
    }
  }, [question.markerType]);

  useEffect(() => {
    if (status !== 'pending') return;
    if (timeLeft <= 0) {
      setStatus('timeout');
      setTimeout(() => onAnswer(false), 2000);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handleOptionClick = (idx: number) => {
    if (status !== 'pending' || disabledOptions.includes(idx)) return;
    setSelectedOption(idx);
    const isCorrect = idx === question.correctIndex;
    setStatus(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => onAnswer(isCorrect), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xl overflow-hidden p-4">
      <div className={`w-full max-w-2xl bg-slate-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] relative flex flex-col`}>
        
        {/* Dynamic Country Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${countryStyles.gradient} opacity-40 pointer-events-none`} />
        
        {/* Large Decorative Icon Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none scale-[2.5]">
          <CategoryIcon size={200} />
        </div>

        {/* Header */}
        <div className="p-8 bg-white/5 border-b border-white/10 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-${countryStyles.accent}-500/20 rounded-2xl border border-${countryStyles.accent}-500/30`}>
              <CategoryIcon className={`w-8 h-8 text-${countryStyles.accent}-400`} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">Орын</p>
              <h3 className="font-black text-2xl text-white uppercase tracking-tighter">{question.locationName}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-black/60 px-6 py-3 rounded-3xl border border-white/10">
            <Timer className={`w-6 h-6 ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`} />
            <span className={`font-mono text-3xl font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}>{timeLeft}с</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 md:p-14 relative z-10">
          <h2 className="text-2xl md:text-4xl font-black mb-12 text-center text-white leading-tight drop-shadow-lg">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;
              const isDisabled = disabledOptions.includes(idx);
              
              let btnClass = "w-full p-6 rounded-[1.5rem] border-2 transition-all text-left flex justify-between items-center font-bold text-lg ";
              
              if (status === 'pending') {
                btnClass += isDisabled 
                  ? "opacity-20 cursor-not-allowed border-transparent bg-slate-900" 
                  : "bg-white/5 border-white/10 hover:border-white/40 hover:bg-white/10 text-slate-200 active:scale-95";
              } else {
                if (isCorrect) btnClass += "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]";
                else if (isSelected) btnClass += "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]";
                else btnClass += "opacity-20 border-transparent grayscale";
              }

              return (
                <button
                  key={idx}
                  disabled={status !== 'pending' || isDisabled}
                  onClick={() => handleOptionClick(idx)}
                  className={btnClass}
                >
                  <span>{opt}</span>
                  {status !== 'pending' && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  {status !== 'pending' && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <button
              onClick={() => {
                if (showHint) return;
                setShowHint(true);
                const incorrect = question.options.map((_, i) => i).filter(i => i !== question.correctIndex);
                setDisabledOptions(incorrect.sort(() => 0.5 - Math.random()).slice(0, 2));
              }}
              disabled={showHint || status !== 'pending'}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all font-black uppercase text-xs tracking-widest ${
                showHint || status !== 'pending' ? 'opacity-30 cursor-not-allowed' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500 hover:text-black shadow-lg shadow-yellow-500/10'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              <span>50/50 Көмек</span>
            </button>
            {showHint && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-2xl flex-1 animate-in fade-in slide-in-from-right-4">
                <p className="text-yellow-500/90 text-sm italic font-medium leading-relaxed">
                  <span className="font-bold uppercase not-italic">Нұсқау: </span>
                  {question.hint}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Animated Feedback Bar */}
        <div className={`py-6 text-center font-black text-3xl uppercase tracking-[0.3em] transition-all duration-500 ${status === 'pending' ? 'opacity-0 h-0' : 'opacity-100 h-auto'} ${status === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
          {status === 'correct' ? 'Керемет!' : status === 'timeout' ? 'Уақыт бітті!' : 'Қателестіңіз!'}
        </div>

        <div className="h-3 w-full bg-white/5">
          <div className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 5 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : `bg-${countryStyles.accent}-500`}`} style={{ width: `${(timeLeft / 15) * 100}%` }} />
        </div>
      </div>
    </div>
  );
};
